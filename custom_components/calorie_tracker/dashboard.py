"""Websocket commands backing the Health & Fitness dashboard card.

- ``calorie_tracker/get_dashboard_stats``: today's calorie budget, today's
  macros, 7/30-day macro averages and the last logged weight in one call.
- ``calorie_tracker/search_foods``: searches the local ``foods-db`` JSON files
  and USDA FoodData Central, returning results in one normalized shape.
"""

from __future__ import annotations

from datetime import date, timedelta
import json
import logging
import re
from pathlib import Path
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import homeassistant.util.dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Bundled database ships with the integration; the user database lives in the
# HA config dir so it survives HACS updates.
BUNDLED_FOODS_DB = Path(__file__).parent / "foods-db"
USER_FOODS_DB_SUBDIR = Path(DOMAIN) / "foods-db"

USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
USDA_FOOD_URL = "https://api.nal.usda.gov/fdc/v1/food/{fdc_id}"
USDA_DATA_TYPES = "Foundation,SR Legacy,Survey (FNDDS),Branded"
USDA_TIMEOUT = aiohttp.ClientTimeout(total=10)

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

_local_db_cache: dict[str, tuple[float, list[dict[str, Any]]]] = {}

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


def _load_foods_db_sync(directories: list[Path]) -> list[dict[str, Any]]:
    """Load every *.json file in the foods-db folders (cached by mtime).

    Files starting with ``_`` are ignored (templates/examples).
    """
    items: list[dict[str, Any]] = []
    for directory in directories:
        if not directory.is_dir():
            continue
        for file in sorted(directory.glob("*.json")):
            if file.name.startswith("_"):
                continue
            key = str(file)
            mtime = file.stat().st_mtime
            cached = _local_db_cache.get(key)
            if cached and cached[0] == mtime:
                items.extend(cached[1])
                continue
            try:
                data = json.loads(file.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                _LOGGER.warning("Skipping unreadable foods-db file %s", file)
                continue
            brand = data.get("brand") or file.stem
            parsed: list[dict[str, Any]] = []
            for raw in data.get("items", []):
                name = raw.get("name")
                serving_g = _num(raw.get("serving_g"))
                if not name or not serving_g:
                    continue
                portions = [_make_portion(raw.get("serving_label") or "1 serving", serving_g)]
                portions += [
                    _make_portion(p.get("label"), p.get("grams"))
                    for p in raw.get("portions", [])
                    if isinstance(p, dict)
                ]
                parsed.append(
                    {
                        "source": "local",
                        "source_label": brand,
                        "id": f"{file.stem}:{name}",
                        "name": name,
                        "brand": brand,
                        # Local values are per serving.
                        "base_g": serving_g,
                        "default_g": serving_g,
                        "serving_label": raw.get("serving_label"),
                        "calories": _num(raw.get("calories")),
                        "protein": _num(raw.get("protein")),
                        "carbs": _num(raw.get("carbs")),
                        "fat": _num(raw.get("fat")),
                        "portions": _dedupe_portions(portions),
                        "_haystack": f"{brand} {name} {' '.join(raw.get('aliases', []))}".lower(),
                    }
                )
            _local_db_cache[key] = (mtime, parsed)
            items.extend(parsed)
    return items


def _search_local(items: list[dict[str, Any]], query: str, limit: int) -> list[dict[str, Any]]:
    tokens = [t for t in query.lower().replace("'", "").split() if t]
    if not tokens:
        return []
    hits = []
    for item in items:
        haystack = item["_haystack"].replace("'", "")
        if all(t in haystack for t in tokens):
            hits.append({k: v for k, v in item.items() if k != "_haystack"})
    hits.sort(key=lambda i: len(i["name"]))
    return hits[:limit]


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


async def _search_usda(
    hass: HomeAssistant, query: str, api_key: str, limit: int
) -> list[dict[str, Any]]:
    session = async_get_clientsession(hass)
    params = {
        "query": query,
        "pageSize": str(limit),
        "dataType": USDA_DATA_TYPES,
        "api_key": api_key,
    }
    async with session.get(USDA_SEARCH_URL, params=params, timeout=USDA_TIMEOUT) as resp:
        if resp.status == 429:
            raise RuntimeError("USDA rate limit reached. Add your own free API key in the card settings.")
        if resp.status in (401, 403):
            raise RuntimeError("USDA rejected the API key.")
        resp.raise_for_status()
        data = await resp.json(content_type=None)
    results = []
    for food in data.get("foods", []):
        item = _normalize_usda(food)
        if item:
            results.append(item)
    return results


async def websocket_search_foods(hass: HomeAssistant, connection, msg):
    """Search local foods-db files and USDA FoodData Central."""
    query = (msg.get("query") or "").strip()
    limit = msg.get("limit", 20)
    if len(query) < 2:
        connection.send_result(msg["id"], {"results": [], "errors": []})
        return

    errors: list[str] = []
    directories = [BUNDLED_FOODS_DB, Path(hass.config.path(str(USER_FOODS_DB_SUBDIR)))]
    local_items = await hass.async_add_executor_job(_load_foods_db_sync, directories)
    results = _search_local(local_items, query, limit)

    if msg.get("include_usda", True):
        try:
            results.extend(
                await _search_usda(hass, query, msg.get("usda_api_key") or "DEMO_KEY", limit)
            )
        except RuntimeError as err:
            errors.append(str(err))
        except (aiohttp.ClientError, TimeoutError) as err:
            _LOGGER.debug("USDA search failed: %s", err)
            errors.append("Couldn't reach USDA FoodData Central.")

    connection.send_result(msg["id"], {"results": results, "errors": errors})


async def websocket_get_food_portions(hass: HomeAssistant, connection, msg):
    """Fetch household measures (cup, slice, medium...) for one USDA food."""
    session = async_get_clientsession(hass)
    url = USDA_FOOD_URL.format(fdc_id=msg["fdc_id"])
    try:
        async with session.get(
            url, params={"api_key": msg.get("usda_api_key") or "DEMO_KEY"}, timeout=USDA_TIMEOUT
        ) as resp:
            resp.raise_for_status()
            data = await resp.json(content_type=None)
    except (aiohttp.ClientError, TimeoutError) as err:
        _LOGGER.debug("USDA portion lookup failed for %s: %s", msg["fdc_id"], err)
        connection.send_result(msg["id"], {"portions": [], "error": "Couldn't load serving sizes."})
        return

    raw_portions = sorted(data.get("foodPortions") or [], key=lambda p: p.get("sequenceNumber") or 999)
    portions = [_usda_detail_portion(p) for p in raw_portions]
    if (data.get("servingSizeUnit") or "").lower() in ("g", "grm"):
        portions.insert(0, _make_portion(data.get("householdServingFullText"), data.get("servingSize")))
    connection.send_result(msg["id"], {"portions": _dedupe_portions(portions)})


def register_dashboard_websockets(hass: HomeAssistant) -> None:
    """Register the dashboard card websocket commands."""
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
                vol.Optional("include_usda", default=True): bool,
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
