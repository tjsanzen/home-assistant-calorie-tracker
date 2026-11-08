"""Websocket commands backing the Health & Fitness dashboard card.

- ``calorie_tracker/get_dashboard_stats``: today's calorie budget, today's
  macros, 7/30-day macro averages and the last logged weight in one call.
- ``calorie_tracker/search_foods``: searches USDA FoodData Central and returns
  results in a normalized shape (saved meals live in ``meals.py``).
"""

from __future__ import annotations

import asyncio
from datetime import date, timedelta
import logging
import re
import time
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import homeassistant.util.dt as dt_util

from .meals import register_meal_websockets

_LOGGER = logging.getLogger(__name__)


USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
USDA_FOOD_URL = "https://api.nal.usda.gov/fdc/v1/food/{fdc_id}"
USDA_DATA_TYPES = "Foundation,SR Legacy,Survey (FNDDS),Branded"
USDA_TIMEOUT = aiohttp.ClientTimeout(total=15)
USDA_CACHE_TTL = 15 * 60  # seconds
USDA_CACHE_MAX = 200

# FoodData Central nutrient ids
NUTRIENT_ENERGY_KCAL = (1008, 2047, 2048)
NUTRIENT_PROTEIN = 1003
NUTRIENT_FAT = 1004
NUTRIENT_CARBS = 1005

MACRO_KEYS = ("p", "c", "f", "a")


def _resolve_user(hass: HomeAssistant, entity_id: str):
    """Return (config_entry, CalorieTrackerUser) for a profile sensor, or (None, None)."""
    entity_entry = er.async_get(hass).entities.get(entity_id)
    if not entity_entry or entity_entry.config_entry_id is None:
        return None, None
    config_entry = hass.config_entries.async_get_entry(entity_entry.config_entry_id)
    if not config_entry or not getattr(config_entry, "runtime_data", None):
        return None, None
    return config_entry, config_entry.runtime_data.get("user")


# ---------------------------------------------------------------------------
# Dashboard stats
# ---------------------------------------------------------------------------


def _empty_day() -> dict[str, float]:
    return {"calories": 0, "entries": 0, **{k: 0.0 for k in MACRO_KEYS}}


def _average(days: list[dict[str, float]]) -> dict[str, Any]:
    """Average calories/macros over days that have at least one food entry."""
    logged = [d for d in days if d["entries"] > 0]
    if not logged:
        return {"days_logged": 0, "calories": None, **{k: None for k in MACRO_KEYS}}
    n = len(logged)
    return {
        "days_logged": n,
        "calories": round(sum(d["calories"] for d in logged) / n),
        **{k: round(sum(d[k] for d in logged) / n, 1) for k in MACRO_KEYS},
    }


async def websocket_get_dashboard_stats(hass: HomeAssistant, connection, msg):
    """Return everything the Health & Fitness card needs in one round trip."""
    config_entry, user = _resolve_user(hass, msg["entity_id"])
    if user is None:
        connection.send_error(msg["id"], "not_found", "Calorie Tracker profile not found")
        return
    health_sync = config_entry.runtime_data.get("health_sync")

    today: date = dt_util.now().date()
    if msg.get("date"):
        parsed = dt_util.parse_date(msg["date"])
        if parsed:
            today = parsed
    today_iso = today.isoformat()

    # Bucket the last 31 days (today + 30 complete days) in a single pass.
    window = {(today - timedelta(days=i)).isoformat(): _empty_day() for i in range(31)}
    for entry in user.storage().get_food_entries():
        day = window.get((entry.get("timestamp") or "")[:10])
        if day is None:
            continue
        day["entries"] += 1
        day["calories"] += entry.get("calories", 0) or 0
        for key in MACRO_KEYS:
            day[key] += float(entry.get(key, 0) or 0)

    # Averages use complete days only (yesterday and earlier) so a half-logged
    # today doesn't drag them down.
    past = [window[(today - timedelta(days=i)).isoformat()] for i in range(1, 31)]

    log = user.get_log(today_iso)
    food_cal, exercise_cal = log.get("calories", (0, 0))
    remaining = user.calculate_remaining_calories(today_iso)
    goal = user.get_goal(today_iso) or {}
    has_goal = bool(goal.get("goal_value"))

    weight_history = user.get_weight_history()
    last_weight = weight_history[-1] if weight_history else None

    today_bucket = window[today_iso]
    connection.send_result(
        msg["id"],
        {
            "date": today_iso,
            "calories": {
                "consumed": food_cal,
                "exercise": exercise_cal,
                "remaining": remaining if has_goal else None,
                # consumed + remaining == the day's allowance, whatever the goal type
                "budget": (food_cal + remaining) if has_goal else None,
                "goal_type": goal.get("goal_type"),
            },
            "macros": {
                "today": {
                    "calories": today_bucket["calories"],
                    **{k: round(today_bucket[k], 1) for k in MACRO_KEYS},
                },
                "avg_7": _average(past[:7]),
                "avg_30": _average(past),
            },
            "last_weight": (
                {
                    "date": last_weight["date"],
                    "weight": last_weight["weight"],
                    "unit": user.get_weight_unit(),
                }
                if last_weight
                else None
            ),
            "health": (
                health_sync.summary()
                if health_sync and today_iso == dt_util.now().date().isoformat()
                else None
            ),
            "food_entries": log.get("food_entries", []),
            "exercise_entries": log.get("exercise_entries", []),
        },
    )


# ---------------------------------------------------------------------------
# Food search
# ---------------------------------------------------------------------------

# --- Portions / household measures -------------------------------------------
# A portion is a named amount of one specific food with a known gram weight,
# e.g. "1 cup, sliced" = 150 g. Volume portions also let the frontend work out
# the food's density and convert any other volume unit (tbsp, tsp, ml...).

_AMOUNT_RE = re.compile(r"^\s*(\d+\s+\d+/\d+|\d+/\d+|\d*\.\d+|\d+)\s*")
_VOLUME_PATTERNS = (
    ("floz", re.compile(r"\bfl\.?\s*oz\b|\bfluid\s+ounces?\b")),
    ("tbsp", re.compile(r"\btbsps?\b|\btablespoons?\b|\btbs\b|\btbl\b")),
    ("tsp", re.compile(r"\btsps?\b|\bteaspoons?\b")),
    ("cup", re.compile(r"\bcups?\b")),
    ("ml", re.compile(r"\bml\b|\bmls\b|\bmlt\b|\bmillilit(?:er|re)s?\b")),
    ("l", re.compile(r"\blit(?:er|re)s?\b")),
)
_MASS_ONLY_RE = re.compile(r"^(g|grams?|grm|oz|onz|ounces?|lbs?|pounds?|kg|kilograms?)\.?$")


def _parse_amount(text: str) -> tuple[float | None, str]:
    """Split a leading quantity ("1 1/2", "1/2", "0.5") off a measure string."""
    match = _AMOUNT_RE.match(text)
    if not match:
        return None, text
    raw = match.group(1)
    try:
        if " " in raw:
            whole, frac = raw.split()
            num_, den = frac.split("/")
            qty = float(whole) + float(num_) / float(den)
        elif "/" in raw:
            num_, den = raw.split("/")
            qty = float(num_) / float(den)
        else:
            qty = float(raw)
    except (ValueError, ZeroDivisionError):
        return None, text
    return (qty if qty > 0 else None), text[match.end():]


def _make_portion(text: str | None, grams: Any, amount: Any = None) -> dict[str, Any] | None:
    """Normalize a household measure into {unit_label, per_unit_g, volume_unit, ...}."""
    grams = _num(grams)
    text = (text or "").strip()
    if not grams or grams <= 0 or not text:
        return None
    if text.isupper():
        text = text.lower()
    if "quantity not specified" in text.lower():
        return {"unit_label": "typical portion", "per_unit_g": grams, "volume_unit": None}
    qty, rest = _parse_amount(text)
    qty = qty or _num(amount) or 1.0
    rest = rest.strip(" ,") or "serving"
    lower = rest.lower()
    if _MASS_ONLY_RE.match(lower):
        return None  # "1 oz" etc. adds nothing over the built-in weight units
    for unit, pattern in _VOLUME_PATTERNS:
        if pattern.search(lower):
            return {
                "unit_label": rest,
                "per_unit_g": round(grams / qty, 3),
                "volume_unit": unit,
            }
    return {"unit_label": rest, "per_unit_g": round(grams / qty, 3), "volume_unit": None}


def _dedupe_portions(portions: list[dict[str, Any] | None], limit: int = 12) -> list[dict[str, Any]]:
    seen: set[tuple[str, float]] = set()
    out: list[dict[str, Any]] = []
    for portion in portions:
        if not portion:
            continue
        key = (portion["unit_label"].lower(), round(portion["per_unit_g"]))
        if key in seen:
            continue
        seen.add(key)
        out.append(portion)
        if len(out) >= limit:
            break
    return out


def _usda_detail_portion(raw: dict[str, Any]) -> dict[str, Any] | None:
    """Portion from the Food Details endpoint (SR Legacy, Foundation, FNDDS)."""
    description = (raw.get("portionDescription") or "").strip()
    if not description:
        unit = (raw.get("measureUnit") or {}).get("name") or ""
        modifier = str(raw.get("modifier") or "")
        parts = [
            unit if unit and unit.lower() != "undetermined" else "",
            modifier if modifier and not modifier.isdigit() else "",
        ]
        description = ", ".join(p for p in parts if p)
        amount = _num(raw.get("amount")) or 1
        description = f"{amount:g} {description}" if description else ""
    return _make_portion(description, raw.get("gramWeight"), raw.get("amount"))


def _num(value: Any) -> float | None:
    try:
        return None if value is None or value == "" else float(value)
    except (TypeError, ValueError):
        return None


def _pretty(text: str | None) -> str | None:
    if not text:
        return text
    return text.title() if text.isupper() else text


def _normalize_usda(food: dict[str, Any]) -> dict[str, Any] | None:
    nutrients: dict[int, float] = {}
    for n in food.get("foodNutrients", []):
        nid = n.get("nutrientId")
        value = _num(n.get("value"))
        if nid is None or value is None:
            continue
        if nid in NUTRIENT_ENERGY_KCAL and (n.get("unitName") or "").upper() != "KCAL":
            continue
        nutrients.setdefault(nid, value)

    protein = nutrients.get(NUTRIENT_PROTEIN)
    carbs = nutrients.get(NUTRIENT_CARBS)
    fat = nutrients.get(NUTRIENT_FAT)
    calories = next((nutrients[i] for i in NUTRIENT_ENERGY_KCAL if i in nutrients), None)
    if calories is None and None not in (protein, carbs, fat):
        calories = protein * 4 + carbs * 4 + fat * 9
    if calories is None:
        return None

    default_g = 100.0
    serving = _num(food.get("servingSize"))
    if serving and (food.get("servingSizeUnit") or "").lower() in ("g", "grm"):
        default_g = serving

    portions = [
        _make_portion(m.get("disseminationText"), m.get("gramWeight"))
        for m in sorted(food.get("foodMeasures") or [], key=lambda m: m.get("rank") or 999)
    ]
    if serving and (food.get("servingSizeUnit") or "").lower() in ("g", "grm"):
        portions.insert(0, _make_portion(food.get("householdServingFullText"), serving))
    portions = _dedupe_portions(portions)
    is_branded = food.get("dataType") == "Branded"

    brand = _pretty(food.get("brandName") or food.get("brandOwner"))
    return {
        "source": "usda",
        "source_label": "USDA",
        "id": f"usda:{food.get('fdcId')}",
        "name": _pretty(food.get("description")) or "Unknown",
        "brand": brand,
        # FoodData Central search results are per 100 g.
        "base_g": 100.0,
        "default_g": default_g,
        "serving_label": food.get("householdServingFullText"),
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fat": fat,
        "fdc_id": food.get("fdcId"),
        "portions": portions,
        # Non-branded foods usually have more measures on the details endpoint.
        "portions_pending": not is_branded and not portions,
    }


class UsdaError(Exception):
    """A USDA request failed; the message is shown to the user."""


_usda_cache: dict[tuple, tuple[float, Any]] = {}


async def _usda_get(hass: HomeAssistant, url: str, params: dict[str, str]) -> dict[str, Any]:
    """GET a USDA endpoint with one retry, readable errors and a short cache.

    USDA FoodData Central is often slow and returns occasional 5xx errors, and
    the shared DEMO_KEY is heavily rate limited, so: retry once on timeouts,
    connection errors and 5xx; cache successful responses for 15 minutes.
    """
    key = (url, tuple(sorted((k, v) for k, v in params.items())))
    cached = _usda_cache.get(key)
    if cached and time.monotonic() - cached[0] < USDA_CACHE_TTL:
        return cached[1]

    session = async_get_clientsession(hass)
    demo = params.get("api_key") == "DEMO_KEY"
    last_error = "Couldn't reach USDA FoodData Central."
    for attempt in range(2):
        if attempt:
            await asyncio.sleep(0.8)
        try:
            async with session.get(url, params=params, timeout=USDA_TIMEOUT) as resp:
                if resp.status == 429:
                    raise UsdaError(
                        "USDA's hourly limit for the shared demo key is used up. "
                        "Add your own free API key in the card settings."
                        if demo
                        else "USDA rate limit reached for your API key. Try again later."
                    )
                if resp.status in (401, 403):
                    raise UsdaError("USDA rejected the API key. Check it in the card settings.")
                if resp.status >= 500:
                    last_error = f"USDA is having problems right now (error {resp.status}). Try again shortly."
                    _LOGGER.warning("USDA returned %s for %s (attempt %s)", resp.status, url, attempt + 1)
                    continue
                resp.raise_for_status()
                data = await resp.json(content_type=None)
        except UsdaError:
            raise
        except TimeoutError:
            last_error = "USDA didn't respond in time (it's often slow). Try again in a moment."
            _LOGGER.warning("USDA request timed out: %s (attempt %s)", url, attempt + 1)
            continue
        except aiohttp.ClientResponseError as err:
            raise UsdaError(f"USDA returned an error ({err.status}).") from err
        except aiohttp.ClientError as err:
            last_error = f"Couldn't connect to USDA from Home Assistant ({type(err).__name__})."
            _LOGGER.warning("USDA connection failed: %s (attempt %s)", err, attempt + 1)
            continue
        except ValueError as err:  # not JSON (proxy or maintenance page)
            last_error = "USDA sent an unexpected response. Try again shortly."
            _LOGGER.warning("USDA response was not JSON: %s", err)
            continue

        if len(_usda_cache) >= USDA_CACHE_MAX:
            _usda_cache.pop(next(iter(_usda_cache)))
        _usda_cache[key] = (time.monotonic(), data)
        return data
    raise UsdaError(last_error)


async def _search_usda(
    hass: HomeAssistant, query: str, api_key: str, limit: int
) -> list[dict[str, Any]]:
    params = {
        "query": query.lower(),
        "pageSize": str(limit),
        "dataType": USDA_DATA_TYPES,
        "api_key": api_key,
    }
    data = await _usda_get(hass, USDA_SEARCH_URL, params)
    results = []
    for food in data.get("foods", []):
        item = _normalize_usda(food)
        if item:
            results.append(item)
    return results


async def websocket_search_foods(hass: HomeAssistant, connection, msg):
    """Search USDA FoodData Central. (Saved meals are filtered in the browser.)"""
    query = (msg.get("query") or "").strip()
    limit = msg.get("limit", 20)
    if len(query) < 2:
        connection.send_result(msg["id"], {"results": [], "errors": []})
        return

    errors: list[str] = []
    results: list[dict[str, Any]] = []
    try:
        results = await _search_usda(hass, query, msg.get("usda_api_key") or "DEMO_KEY", limit)
    except UsdaError as err:
        errors.append(str(err))

    connection.send_result(msg["id"], {"results": results, "errors": errors})


async def websocket_get_food_portions(hass: HomeAssistant, connection, msg):
    """Fetch household measures (cup, slice, medium...) for one USDA food."""
    url = USDA_FOOD_URL.format(fdc_id=msg["fdc_id"])
    try:
        data = await _usda_get(hass, url, {"api_key": msg.get("usda_api_key") or "DEMO_KEY"})
    except UsdaError as err:
        connection.send_result(msg["id"], {"portions": [], "error": str(err)})
        return

    raw_portions = sorted(data.get("foodPortions") or [], key=lambda p: p.get("sequenceNumber") or 999)
    portions = [_usda_detail_portion(p) for p in raw_portions]
    if (data.get("servingSizeUnit") or "").lower() in ("g", "grm"):
        portions.insert(0, _make_portion(data.get("householdServingFullText"), data.get("servingSize")))
    connection.send_result(msg["id"], {"portions": _dedupe_portions(portions)})


# ---------------------------------------------------------------------------
# Previously logged foods
# ---------------------------------------------------------------------------

# Matches the amount suffix the card appends: "(150 g)", "(1.5 cup · ~355 g)", "(1 serving)"
_SUFFIX_RE = re.compile(r"\s*\(([^()]*\d[^()]*)\)\s*$")
_GRAMS_RE = re.compile(r"~?\s*(\d+(?:\.\d+)?)\s*g$")
_QTY_UNIT_RE = re.compile(r"^(\d+(?:\.\d+)?)\s+(.+)$")
_VOLUME_IDS = {"cup": "cup", "tbsp": "tbsp", "tsp": "tsp", "fl oz": "floz", "ml": "ml"}


def _parse_logged_name(food_item: str) -> tuple[str, float | None, str | None, float | None]:
    """Split "Oats (1.5 cup · ~120 g)" into (name, qty, unit, grams)."""
    match = _SUFFIX_RE.search(food_item or "")
    if not match:
        return (food_item or "").strip(), None, None, None
    name = food_item[: match.start()].strip()
    parts = [p.strip() for p in match.group(1).split("·")]
    qty = unit = grams = None
    gm = _GRAMS_RE.match(parts[-1])
    if gm:
        grams = float(gm.group(1))
    qm = _QTY_UNIT_RE.match(parts[0])
    if qm and not (len(parts) == 1 and gm):
        qty, unit = float(qm.group(1)), qm.group(2).strip()
    elif gm:
        qty, unit = grams, "g"
    if qty is None:
        return food_item.strip(), None, None, None  # parentheses weren't an amount
    return name or food_item.strip(), qty, unit, grams


def _history_item(entry: dict[str, Any], times: int) -> dict[str, Any]:
    name, qty, unit, grams = _parse_logged_name(entry.get("food_item", ""))
    item: dict[str, Any] = {
        "source": "history",
        "source_label": "Logged before",
        "id": f"history:{entry.get('id')}",
        "name": name,
        "brand": None,
        "calories": float(entry.get("calories") or 0),
        "protein": _num(entry.get("p")),
        "carbs": _num(entry.get("c")),
        "fat": _num(entry.get("f")),
        "times_logged": times,
        "last_logged": (entry.get("timestamp") or "")[:10],
    }
    if grams and qty:
        # Weighed: scale by grams, and remember the unit it was logged in.
        item.update(base_g=grams, default_g=grams, portions_only=False)
        item["portions"] = (
            [{"unit_label": unit, "per_unit_g": round(grams / qty, 3), "volume_unit": _VOLUME_IDS.get(unit)}]
            if unit != "g"
            else []
        )
        item["last"] = {"qty": qty, "unit": unit}
    else:
        # No weight: offer the same unit it was logged in (or "serving").
        qty = qty or 1.0
        unit = unit or "serving"
        item.update(base_g=qty, default_g=qty, portions_only=True)
        item["portions"] = [{"unit_label": unit, "per_unit_g": 1, "volume_unit": None}]
        item["last"] = {"qty": qty, "unit": unit}
    return item


async def websocket_search_history(hass: HomeAssistant, connection, msg):
    """Foods this profile logged before, newest version of each, best matches first.

    An empty query returns the most recently logged distinct foods.
    """
    _, user = _resolve_user(hass, msg["entity_id"])
    if user is None:
        connection.send_error(msg["id"], "not_found", "Calorie Tracker profile not found")
        return
    query = (msg.get("query") or "").strip().lower()
    tokens = query.split()
    latest: dict[str, dict[str, Any]] = {}
    counts: dict[str, int] = {}
    for entry in user.storage().get_food_entries():
        name = _parse_logged_name(entry.get("food_item", ""))[0]
        key = name.lower()
        if not key or (tokens and not all(t in key for t in tokens)):
            continue
        counts[key] = counts.get(key, 0) + 1
        current = latest.get(key)
        if current is None or (entry.get("timestamp") or "") >= (current.get("timestamp") or ""):
            latest[key] = entry

    # Newest first, then (when searching) prefix matches and most-logged foods
    # first; Python's sort is stable so recency breaks the ties.
    keys = sorted(latest, key=lambda k: latest[k].get("timestamp") or "", reverse=True)
    if tokens:
        keys.sort(key=lambda k: (0 if k.startswith(query) else 1, -counts[k]))
    keys = keys[: msg.get("limit", 8)]
    connection.send_result(
        msg["id"], {"results": [_history_item(latest[k], counts[k]) for k in keys]}
    )


def register_dashboard_websockets(hass: HomeAssistant) -> None:
    """Register the dashboard card websocket commands."""
    register_meal_websockets(hass)
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {
                vol.Required("type"): "calorie_tracker/search_history",
                vol.Required("entity_id"): str,
                vol.Optional("query", default=""): str,
                vol.Optional("limit", default=8): vol.All(int, vol.Range(min=1, max=50)),
            }
        )(websocket_api.async_response(websocket_search_history)),
    )
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {
                vol.Required("type"): "calorie_tracker/get_dashboard_stats",
                vol.Required("entity_id"): str,
                vol.Optional("date"): str,
            }
        )(websocket_api.async_response(websocket_get_dashboard_stats)),
    )
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {
                vol.Required("type"): "calorie_tracker/search_foods",
                vol.Required("query"): str,
                vol.Optional("usda_api_key"): str,
                vol.Optional("limit", default=20): vol.All(int, vol.Range(min=1, max=50)),
            }
        )(websocket_api.async_response(websocket_search_foods)),
    )
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {
                vol.Required("type"): "calorie_tracker/get_food_portions",
                vol.Required("fdc_id"): vol.Coerce(int),
                vol.Optional("usda_api_key"): str,
            }
        )(websocket_api.async_response(websocket_get_food_portions)),
    )
