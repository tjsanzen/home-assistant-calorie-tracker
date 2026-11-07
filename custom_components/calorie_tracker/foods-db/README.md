# foods-db

Local food database searched by the **Health & Fitness** card's Log dialog,
alongside USDA FoodData Central. One JSON file per brand or restaurant
(e.g. `McDonalds.json`, `Chipotle.json`, `MyRecipes.json`).

Two locations are searched:

| Folder | Purpose |
| --- | --- |
| `custom_components/calorie_tracker/foods-db/` | Bundled with the integration (contribute here). Overwritten on HACS updates. |
| `<config>/calorie_tracker/foods-db/` | Your personal foods. Survives updates. |

Files whose name starts with `_` are ignored (use them for templates).
Edits are picked up on the next search; no restart needed.

## Format

```json
{
  "brand": "McDonald's",
  "source": "https://www.mcdonalds.com/us/en-us/about-our-food/nutrition-calculator.html",
  "updated": "2026-11-06",
  "_note": "Numbers below are illustrative only. Copy real values from the official source.",
  "items": [
    {
      "name": "Big Mac",
      "serving_g": 219,
      "serving_label": "1 sandwich",
      "calories": 590,
      "protein": 25,
      "carbs": 46,
      "fat": 34,
      "aliases": ["bigmac"]
    },
    {
      "name": "Small Fries",
      "serving_g": 71,
      "serving_label": "1 small",
      "calories": 230,
      "protein": 3,
      "carbs": 31,
      "fat": 11,
      "portions": [
        { "label": "1 medium", "grams": 111 },
        { "label": "1 large", "grams": 150 }
      ]
    }
  ]
}
```

- **Nutrition values are per serving**, and `serving_g` is the weight of that serving.
  The dialog scales everything when you change the serving size.
- `portions` (optional) adds more units to the dialog's Unit menu. Each needs a
  `label` and its `grams`. If any label is a volume (`"1 cup"`, `"2 tbsp"`),
  every other volume unit for that food is converted from it, so one cup
  measurement makes tbsp/tsp/ml accurate too. Without one, volumes fall back to
  water density and the dialog flags the result as a rough guess.
- Required per item: `name`, `serving_g`, `calories`. `protein`, `carbs`, `fat`
  (grams), `serving_label` and `aliases` (extra search words) are optional.
- `brand` defaults to the file name. `source` and `updated` are for humans.
- Search matches every word you type against brand + name + aliases.
