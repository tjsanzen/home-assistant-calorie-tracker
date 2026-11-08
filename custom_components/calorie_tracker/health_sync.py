"""Pull steps, weight and active calories from linked sensors (e.g. Apple Health).

Works with any sensor, but is designed around the Home Assistant iOS companion
app's Apple Health sensors (Labs). Link them under the integration's
**Configure** button.

- Weight: each new reading is logged as that day's weight (converted to the
  profile's unit). Readings already logged for that day are skipped.
- Steps: read live for the dashboard card; nothing is stored.
- Active calories: the profile's activity multiplier already budgets for a
  normal day's movement (BMR x (multiplier - 1)). Only active calories *above*
  that estimate, and above any exercise you logged separately (a Peloton ride
  the watch also counted, say), are credited, as one exercise entry per day that
  is kept up to date as the sensor changes.
"""

from __future__ import annotations

from datetime import datetime
import logging
from typing import Any

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.start import async_at_started
import homeassistant.util.dt as dt_util

_LOGGER = logging.getLogger(__name__)

CONF_STEPS_ENTITY = "health_steps_entity"
CONF_WEIGHT_ENTITY = "health_weight_entity"
CONF_ACTIVE_ENERGY_ENTITY = "health_active_energy_entity"
HEALTH_OPTION_KEYS = (CONF_STEPS_ENTITY, CONF_WEIGHT_ENTITY, CONF_ACTIVE_ENERGY_ENTITY)

HEALTH_EXERCISE_TYPE = "Extra activity (Apple Health)"

_KCAL_PER_UNIT = {"kcal": 1.0, "cal": 1.0, "kilocalories": 1.0, "kj": 1 / 4.184}
_KG_PER_UNIT = {"kg": 1.0, "g": 0.001, "lb": 0.45359237, "lbs": 0.45359237, "st": 6.35029318}


def _state_time(state: State) -> datetime:
    """Most recent time the source reported this value."""
    return getattr(state, "last_reported", None) or state.last_updated


def _numeric(state: State | None) -> float | None:
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE, ""):
        return None
    try:
        return float(state.state)
    except (TypeError, ValueError):
        return None


def _unit(state: State) -> str:
    return str(state.attributes.get("unit_of_measurement") or "").strip().lower()


class HealthSync:
    """Listens to the linked health sensors for one Calorie Tracker profile."""

    def __init__(self, hass: HomeAssistant, entry, user) -> None:
        self.hass = hass
        self.entry = entry
        self.user = user
        self._unsubs: list = []

    # ------------------------------------------------------------------ setup

    def _entity(self, key: str) -> str | None:
        return (self.entry.options or {}).get(key) or None

    @callback
    def async_start(self) -> None:
        """Subscribe to the linked sensors and do an initial sync once HA is up."""
        self.async_stop()
        weight_entity = self._entity(CONF_WEIGHT_ENTITY)
        active_entity = self._entity(CONF_ACTIVE_ENERGY_ENTITY)

        if weight_entity:
            self._unsubs.append(
                async_track_state_change_event(self.hass, [weight_entity], self._on_weight)
            )
        if active_entity:
            self._unsubs.append(
                async_track_state_change_event(self.hass, [active_entity], self._on_active)
            )
        if weight_entity or active_entity:
            self._unsubs.append(async_at_started(self.hass, self._initial_sync))

    @callback
    def async_stop(self) -> None:
        while self._unsubs:
            self._unsubs.pop()()

    async def _initial_sync(self, _hass: HomeAssistant) -> None:
        weight_entity = self._entity(CONF_WEIGHT_ENTITY)
        if weight_entity:
            await self._sync_weight(self.hass.states.get(weight_entity), only_today=True)
        await self.async_update_activity()

    # ----------------------------------------------------------------- values

    def _today_value(self, entity_id: str | None) -> float | None:
        """Numeric value of a daily-total sensor, or None if it isn't from today."""
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        value = _numeric(state)
        if value is None:
            return None
        if dt_util.as_local(_state_time(state)).date() != dt_util.now().date():
            return None  # yesterday's total that hasn't reset yet
        return value

    def steps_today(self) -> int | None:
        value = self._today_value(self._entity(CONF_STEPS_ENTITY))
        return None if value is None else int(round(value))

    def active_kcal_today(self) -> float | None:
        entity_id = self._entity(CONF_ACTIVE_ENERGY_ENTITY)
        value = self._today_value(entity_id)
        if value is None:
            return None
        factor = _KCAL_PER_UNIT.get(_unit(self.hass.states.get(entity_id)), 1.0)
        return value * factor

    def estimated_activity_kcal(self, date_str: str) -> float:
        """Movement already budgeted by the activity multiplier: BMR x (mult - 1)."""
        bmr = self.user.calculate_bmr(date_str) or 0.0
        return max(0.0, bmr * (self.user.get_neat() - 1.0))

    def summary(self) -> dict[str, Any] | None:
        """Health data for the dashboard card (None when nothing is linked)."""
        if not any(self._entity(k) for k in HEALTH_OPTION_KEYS):
            return None
        today = dt_util.now().date().isoformat()
        active = self.active_kcal_today()
        return {
            "steps": self.steps_today(),
            "steps_linked": bool(self._entity(CONF_STEPS_ENTITY)),
            "active_kcal": None if active is None else round(active),
            "active_linked": bool(self._entity(CONF_ACTIVE_ENERGY_ENTITY)),
            "estimated_activity_kcal": round(self.estimated_activity_kcal(today)),
            "credited_kcal": self._credited_entry(today)[1],
            "weight_linked": bool(self._entity(CONF_WEIGHT_ENTITY)),
        }

    # ----------------------------------------------------------------- weight

    async def _on_weight(self, event: Event) -> None:
        await self._sync_weight(event.data.get("new_state"))

    async def _sync_weight(self, state: State | None, only_today: bool = False) -> None:
        value = _numeric(state)
        if value is None or value <= 0:
            return
        unit = _unit(state)
        profile_unit = (self.user.get_weight_unit() or "lbs").lower()
        if unit in _KG_PER_UNIT and profile_unit in _KG_PER_UNIT and unit != profile_unit:
            value = value * _KG_PER_UNIT[unit] / _KG_PER_UNIT[profile_unit]
        value = round(value, 1)

        date_str = dt_util.as_local(_state_time(state)).date().isoformat()
        if only_today and date_str != dt_util.now().date().isoformat():
            return
        logged = self.user.storage().get_all_weights().get(date_str)
        if logged is not None and abs(float(logged) - value) < 0.05:
            return
        _LOGGER.debug("Logging %s %s from %s for %s", value, profile_unit, state.entity_id, date_str)
        await self.user.async_log_weight(value, date_str)
        await self._refresh_sensor()

    # --------------------------------------------------------------- activity

    async def _on_active(self, event: Event) -> None:
        await self.async_update_activity()

    def _credited_entry(self, date_str: str) -> tuple[dict | None, int]:
        for entry in self.user.get_log(date_str)["exercise_entries"]:
            if entry.get("exercise_type") == HEALTH_EXERCISE_TYPE:
                return entry, int(entry.get("calories_burned") or 0)
        return None, 0

    async def async_update_activity(self) -> None:
        """Create/update/remove today's 'above estimate' exercise entry."""
        active = self.active_kcal_today()
        if active is None:
            return
        today = dt_util.now().date().isoformat()
        existing, current = self._credited_entry(today)
        other_exercise = sum(
            int(e.get("calories_burned") or 0)
            for e in self.user.get_log(today)["exercise_entries"]
            if e.get("exercise_type") != HEALTH_EXERCISE_TYPE
        )
        extra = int(round(max(0.0, active - self.estimated_activity_kcal(today) - other_exercise)))
        if extra == current:
            return

        if existing and extra == 0:
            await self.user.delete_entry("exercise", existing["id"])
        elif existing:
            await self.user.update_entry("exercise", existing["id"], {**existing, "calories_burned": extra})
        else:
            await self.user.async_log_exercise(
                exercise_type=HEALTH_EXERCISE_TYPE, calories_burned=extra
            )
        await self._refresh_sensor()

    async def _refresh_sensor(self) -> None:
        sensor = (self.entry.runtime_data or {}).get("sensor")
        if sensor:
            await sensor.async_update_calories()
