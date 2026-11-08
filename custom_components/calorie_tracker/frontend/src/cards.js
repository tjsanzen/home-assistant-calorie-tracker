// Entry point for the dashboard cards.
//
// The integration auto-loads this file on every dashboard (frontend extra JS),
// and older setups may also list it as a manual Lovelace resource. The guard
// keeps a second copy from re-defining elements or duplicating card-picker entries.
//
// After the cards load, they are re-registered every 500 ms for the first
// minute. Some Home Assistant installs replace window.customElements after
// startup; a card defined in the old registry is then invisible to dashboards
// ("Custom element doesn't exist"). Re-defining into the current registry fixes it.

const CARD_ELEMENTS = [
  'health-fitness-card',
  'hf-log-dialog',
  'calorie-summary-card',
  'calorie-summary-editor',
  'calorie-daily-log-card',
  'calorie-daily-log-editor',
  'calorie-profile-card',
  'calorie-profile-editor',
  'calorie-gauge-card',
  'calorie-gauge-editor',
  'protein-gauge-card',
  'protein-gauge-editor',
  'fat-gauge-card',
  'fat-gauge-editor',
  'carbs-gauge-card',
  'carbs-gauge-editor',
  'macro-percentages-card',
  'macro-percentages-editor',
  'weight-progress-card',
  'weight-progress-editor',
];

function keepRegistered() {
  const classes = CARD_ELEMENTS.map((name) => [name, customElements.get(name)]).filter(([, cls]) => cls);
  let ticks = 0;
  const timer = setInterval(() => {
    for (const [name, cls] of classes) {
      if (!window.customElements.get(name)) {
        try {
          window.customElements.define(name, cls);
        } catch (err) {
          // Already defined under another name in this registry; nothing to do.
        }
      }
    }
    if (++ticks >= 120) clearInterval(timer);
  }, 500);
}

if (!window.__calorieTrackerCards) {
  window.__calorieTrackerCards = import('./cards-impl.js')
    .then(keepRegistered)
    .catch((err) => console.error('Calorie Tracker cards failed to load:', err));
}
