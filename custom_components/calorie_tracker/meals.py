"""Saved meals ("My meals"), stored in <config>/calorie_tracker/my_meals.json.

A meal is a named list of ingredients with a number of servings, e.g. a batch of
chili that makes 4 servings. Totals are always recomputed here from the
ingredients, so the file can be edited by hand.

File format::

    {
      "version": 1,
      "meals": [
        {
          "id": "3f2c...",
          "name": "Overnight oats",
          "servings": 2,
          "ingredients": [
            {"name": "Rolled oats", "amount": "1", "unit": "cup", "grams": 81,
             "calories": 303, "protein": 10.5, "carbs": 54.4, "fat": 5.3}
          ],
          "created": "2026-11-08T09:00:00-06:00",
          "updated": "2026-11-08T09:00:00-06:00"
        }
      ]
    }

Websocket commands: ``calorie_tracker/meals/list``, ``.../meals/save``,
``.../meals/delete``. Meals are shared by all profiles.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
from pathlib import Path
from typing import Any
import uuid

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
import homeassistant.util.dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

MEALS_FILE = Path(DOMAIN) / "my_meals.json"
DATA_KEY = f"{DOMAIN}_meal_store"
MACROS = ("protein", "carbs", "fat")


def _num(value: Any) -> float | None:
    try:
        return None if value is None or value == "" else float(value)
    except (TypeError, ValueError):
        return None


class MealStore:
    """Reads/writes my_meals.json. Re-reads when the file is edited by hand."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.lock = asyncio.Lock()
        self._mtime: float | None = None
        self._meals: list[dict[str, Any]] = []

    def load_sync(self) -> list[dict[str, Any]]:
        if not self.path.exists():
            self._mtime, self._meals = None, []
            return self._meals
        mtime = self.path.stat().st_mtime
        if mtime == self._mtime:
            return self._meals
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as err:
            # Never overwrite a file the user may be mid-way through editing.
            raise HomeAssistantError(f"{self.path.name} is not valid JSON: {err}") from err
        meals = data.get("meals", []) if isinstance(data, dict) else []
        self._meals = [m for m in meals if isinstance(m, dict) and m.get("id") and m.get("name")]
        self._mtime = mtime
        return self._meals

    def save_sync(self, meals: list[dict[str, Any]]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".json.tmp")
        tmp.write_text(
            json.dumps({"version": 1, "meals": meals}, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        os.replace(tmp, self.path)  # atomic: a crash never leaves half a file
        self._meals = meals
        self._mtime = self.path.stat().st_mtime


def _store(hass: HomeAssistant) -> MealStore:
    if DATA_KEY not in hass.data:
        hass.data[DATA_KEY] = MealStore(Path(hass.config.path(str(MEALS_FILE))))
    return hass.data[DATA_KEY]


def _clean_ingredient(raw: dict[str, Any]) -> dict[str, Any]:
    ing: dict[str, Any] = {
        "name": str(raw["name"]).strip(),
        "calories": round(max(0.0, _num(raw.get("calories")) or 0.0)),
    }
    for key in MACROS:
        value = _num(raw.get(key))
        if value:
            ing[key] = round(max(0.0, value), 1)
    grams = _num(raw.get("grams"))
    if grams and grams > 0:
        ing["grams"] = round(grams, 1)
    if raw.get("amount") not in (None, ""):
        ing["amount"] = str(raw["amount"])
    if raw.get("unit"):
        ing["unit"] = str(raw["unit"])
    if raw.get("source"):
        ing["source"] = str(raw["source"])
    return ing


def _with_computed(meal: dict[str, Any]) -> dict[str, Any]:
    """Add totals, weight and a search-result 'item' for the frontend."""
    ingredients = meal.get("ingredients", [])
    servings = _num(meal.get("servings")) or 1.0
    totals = {
        "calories": round(sum(_num(i.get("calories")) or 0 for i in ingredients)),
        **{k: round(sum(_num(i.get(k)) or 0 for i in ingredients), 1) for k in MACROS},
    }
    grams = [_num(i.get("grams")) for i in ingredients]
    weight = round(sum(grams), 1) if grams and all(g and g > 0 for g in grams) else None

    item: dict[str, Any] = {
        "source": "meal",
        "source_label": "My meal",
        "id": f"meal:{meal['id']}",
        "meal_id": meal["id"],
        "name": meal["name"],
        "brand": None,
        "ingredient_count": len(ingredients),
        "servings": servings,
        **totals,  # nutrition of the whole recipe, i.e. for base_g
    }
    whole = servings != 1
    if weight:
        per = weight / servings
        item.update(base_g=weight, default_g=per, portions_only=False)
        portions = [{"unit_label": "serving", "per_unit_g": round(per, 3), "volume_unit": None}]
        if whole:
            portions.append({"unit_label": "whole recipe", "per_unit_g": weight, "volume_unit": None})
    else:
        # Some ingredient has no weight: offer servings only. One "gram" here
        # is one serving, so the dialog's scaling maths still works.
        item.update(base_g=servings, default_g=1, portions_only=True)
        portions = [{"unit_label": "serving", "per_unit_g": 1, "volume_unit": None}]
        if whole:
            portions.append({"unit_label": "whole recipe", "per_unit_g": servings, "volume_unit": None})
    item["portions"] = portions
    return {**meal, "servings": servings, "totals": totals, "weight_g": weight, "item": item}


async def _load(hass: HomeAssistant) -> list[dict[str, Any]]:
    return await hass.async_add_executor_job(_store(hass).load_sync)


async def websocket_list_meals(hass: HomeAssistant, connection, msg):
    try:
        meals = await _load(hass)
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "invalid_file", str(err))
        return
    connection.send_result(msg["id"], {"meals": [_with_computed(m) for m in meals]})


async def websocket_save_meal(hass: HomeAssistant, connection, msg):
    raw = msg["meal"]
    store = _store(hass)
    now = dt_util.now().isoformat(timespec="seconds")
    async with store.lock:
        try:
            meals = [dict(m) for m in await _load(hass)]
        except HomeAssistantError as err:
            connection.send_error(msg["id"], "invalid_file", str(err))
            return
        meal = {
            "id": raw.get("id") or uuid.uuid4().hex,
            "name": raw["name"].strip(),
            "servings": raw.get("servings", 1),
            "ingredients": [_clean_ingredient(i) for i in raw["ingredients"]],
            "updated": now,
        }
        index = next((i for i, m in enumerate(meals) if m["id"] == meal["id"]), None)
        if index is None:
            meal["created"] = now
            meals.append(meal)
        else:
            meal["created"] = meals[index].get("created", now)
            meals[index] = meal
        await hass.async_add_executor_job(store.save_sync, meals)
    connection.send_result(msg["id"], {"meal": _with_computed(meal)})


async def websocket_delete_meal(hass: HomeAssistant, connection, msg):
    store = _store(hass)
    async with store.lock:
        try:
            meals = await _load(hass)
        except HomeAssistantError as err:
            connection.send_error(msg["id"], "invalid_file", str(err))
            return
        remaining = [m for m in meals if m["id"] != msg["meal_id"]]
        if len(remaining) == len(meals):
            connection.send_error(msg["id"], "not_found", "Meal not found")
            return
        await hass.async_add_executor_job(store.save_sync, remaining)
    connection.send_result(msg["id"], {"success": True})


INGREDIENT_SCHEMA = vol.Schema(
    {
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=200)),
        vol.Required("calories"): vol.Coerce(float),
        vol.Optional("protein"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("carbs"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("fat"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("grams"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("amount"): vol.Any(None, str, vol.Coerce(float)),
        vol.Optional("unit"): vol.Any(None, str),
        vol.Optional("source"): vol.Any(None, str),
    },
    extra=vol.REMOVE_EXTRA,
)

MEAL_SCHEMA = vol.Schema(
    {
        vol.Optional("id"): vol.Any(None, str),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=100)),
        vol.Optional("servings", default=1): vol.All(vol.Coerce(float), vol.Range(min=0.1, max=100)),
        vol.Required("ingredients"): vol.All([INGREDIENT_SCHEMA], vol.Length(min=1, max=100)),
    },
    extra=vol.REMOVE_EXTRA,
)


def register_meal_websockets(hass: HomeAssistant) -> None:
    """Register My meals websocket commands."""
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command({vol.Required("type"): "calorie_tracker/meals/list"})(
            websocket_api.async_response(websocket_list_meals)
        ),
    )
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {vol.Required("type"): "calorie_tracker/meals/save", vol.Required("meal"): MEAL_SCHEMA}
        )(websocket_api.async_response(websocket_save_meal)),
    )
    websocket_api.async_register_command(
        hass,
        websocket_api.websocket_command(
            {vol.Required("type"): "calorie_tracker/meals/delete", vol.Required("meal_id"): str}
        )(websocket_api.async_response(websocket_delete_meal)),
    )
