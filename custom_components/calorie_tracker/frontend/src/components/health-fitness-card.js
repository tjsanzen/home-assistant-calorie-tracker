import { LitElement, html, css, svg, nothing } from 'lit';

/**
 * Health & Fitness dashboard card.
 *
 *   type: custom:health-fitness-card
 *   profile_entity_id: sensor.calorie_tracker_tovin   # optional, falls back to the user's default profile
 *   title: Health & Fitness                           # optional
 *   usda_api_key: xxxxx                               # optional, defaults to USDA's rate-limited DEMO_KEY
 *   search_usda: true                                 # optional, set false to only search foods-db
 *   show_exercise: true                               # optional, include exercise in the activity list
 *   list_height: 360                                  # optional, activity list height (px) when stacked on narrow screens
 */

const MACROS = [
  { key: 'p', label: 'Protein', short: 'P' },
  { key: 'c', label: 'Carbs', short: 'C' },
  { key: 'f', label: 'Fat', short: 'F' },
];

const SERVING_SUFFIX = /\s*\(([^()]*\d[^()]*)\)\s*$/;

const sharedStyles = css`
  :host {
    --hf-protein: var(--calorie-tracker-protein-color, #5b8def);
    --hf-carbs: var(--calorie-tracker-carbs-color, #e9a23b);
    --hf-fat: var(--calorie-tracker-fat-color, #d9607a);
    --hf-good: var(--success-color, #43a047);
    --hf-over: var(--error-color, #db4437);
    --hf-muted: var(--secondary-text-color);
    --hf-divider: var(--divider-color, rgba(127, 127, 127, 0.2));
  }
  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
  .dot.p { background: var(--hf-protein); }
  .dot.c { background: var(--hf-carbs); }
  .dot.f { background: var(--hf-fat); }
  button {
    font: inherit;
    cursor: pointer;
  }
  .btn {
    border: none;
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 600;
    font-size: 0.9rem;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }
  .btn:hover { filter: brightness(1.08); }
  .btn:disabled { opacity: 0.55; cursor: default; filter: none; }
  .btn.secondary {
    background: transparent;
    color: var(--primary-text-color);
    border: 1px solid var(--hf-divider);
  }
`;

function num(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function localDateString(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ------------------------------------------------------------------------- */
/* Units                                                                     */
/* ------------------------------------------------------------------------- */

// US customary volumes in millilitres.
const ML_PER = { ml: 1, l: 1000, tsp: 4.92892, tbsp: 14.7868, floz: 29.5735, cup: 236.588 };
const VOLUME_UNITS = [
  ['cup', 'cup'],
  ['tbsp', 'tbsp'],
  ['tsp', 'tsp'],
  ['floz', 'fl oz'],
  ['ml', 'ml'],
];
const MASS_UNITS = [
  ['g', 'g', 1],
  ['oz', 'oz', 28.3495],
  ['lb', 'lb', 453.592],
  ['kg', 'kg', 1000],
];

/** Parse "1.5", "1,5", "1/2" or "1 1/2". Returns null when it isn't a positive number. */
function parseAmount(text) {
  const t = String(text ?? '').trim().replace(',', '.');
  if (!t) return null;
  let m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return Number(m[3]) ? Number(m[1]) + Number(m[2]) / Number(m[3]) : null;
  m = t.match(/^(\d+)\/(\d+)$/);
  if (m) return Number(m[2]) ? Number(m[1]) / Number(m[2]) : null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function fmtAmount(n) {
  return String(Math.round(n * 100) / 100);
}

/**
 * Units offered for a food.
 * quality: exact (weight or the food's own measure), derived (volume converted
 * via density from one of the food's volume measures), rough (water density
 * assumed), unknown (no food selected, so volume can't become grams).
 */
function buildUnits(item) {
  const units = [];
  const portions = item?.portions || [];
  const volumePortion =
    portions.find((p) => p.volume_unit === 'cup') || portions.find((p) => p.volume_unit);
  const density = volumePortion ? volumePortion.per_unit_g / ML_PER[volumePortion.volume_unit] : null;

  portions.forEach((p, i) => {
    // A plain "cup"/"tbsp" portion is covered by the Volume group below.
    const generic = VOLUME_UNITS.some(([id, label]) => p.volume_unit === id && p.unit_label.toLowerCase() === label);
    if (generic) return;
    let label = p.unit_label;
    // "slices" -> "slice" when it's the unit of a single item
    label = label.replace(/^([a-z]{3,}[^s])s\b/i, '$1');
    units.push({ id: `p${i}`, label, group: 'food', g: p.per_unit_g, quality: 'exact' });
  });

  for (const [id, label] of VOLUME_UNITS) {
    if (!item) {
      units.push({ id, label, group: 'volume', g: null, quality: 'unknown' });
      continue;
    }
    const sameUnit = volumePortion && volumePortion.volume_unit === id && volumePortion.unit_label.toLowerCase() === label;
    units.push({
      id,
      label,
      group: 'volume',
      g: ML_PER[id] * (density ?? 1),
      quality: sameUnit ? 'exact' : density ? 'derived' : 'rough',
      basis: volumePortion,
    });
  }

  for (const [id, label, g] of MASS_UNITS) {
    units.push({ id, label, group: 'mass', g, quality: 'exact' });
  }
  return units;
}

/* ------------------------------------------------------------------------- */
/* Card                                                                      */
/* ------------------------------------------------------------------------- */

class HealthFitnessCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _stats: { state: true },
      _error: { state: true },
      _entityId: { state: true },
    };
  }

  constructor() {
    super();
    this._stats = null;
    this._error = null;
    this._entityId = null;
    this._lastStamp = null;
    this._fetching = false;
    this._refetch = false;
    this._resolvingDefault = false;
    this._onLogged = () => this._fetch();
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = {
      title: 'Health & Fitness',
      show_exercise: true,
      search_usda: true,
      list_height: 360,
      ...config,
    };
    if (config.profile_entity_id) this._entityId = config.profile_entity_id;
  }

  static getStubConfig() {
    return { title: 'Health & Fitness' };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        {
          name: 'profile_entity_id',
          selector: { entity: { filter: { integration: 'calorie_tracker', domain: 'sensor' } } },
        },
        { name: 'usda_api_key', selector: { text: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'search_usda', selector: { boolean: {} } },
            { name: 'show_exercise', selector: { boolean: {} } },
          ],
        },
        { name: 'list_height', selector: { number: { min: 150, max: 1000, step: 10, unit_of_measurement: 'px' } } },
      ],
      computeLabel: (s) =>
        ({
          title: 'Title',
          profile_entity_id: 'Calorie Tracker profile (defaults to your own)',
          usda_api_key: 'USDA FoodData Central API key (optional)',
          search_usda: 'Search USDA database',
          show_exercise: 'Show exercise in activity list',
          list_height: 'Activity list height on narrow screens',
        })[s.name],
    };
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._debounce);
  }

  updated(changed) {
    if (changed.has('hass') && this.hass) this._maybeFetch();
  }

  async _resolveEntity() {
    if (this._entityId) return this._entityId;
    if (this._resolvingDefault) return null;
    this._resolvingDefault = true;
    try {
      const resp = await this.hass.callWS({
        type: 'calorie_tracker/get_user_profile',
        user_id: this.hass.user?.id,
      });
      this._entityId =
        resp?.default_profile?.entity_id || resp?.all_profiles?.[0]?.entity_id || null;
      if (!this._entityId) this._error = 'No Calorie Tracker profile found.';
    } catch (err) {
      this._error = `Couldn't find a Calorie Tracker profile: ${err.message || err}`;
    } finally {
      this._resolvingDefault = false;
    }
    return this._entityId;
  }

  async _maybeFetch() {
    const entityId = await this._resolveEntity();
    if (!entityId) return;
    const stateObj = this.hass.states[entityId];
    // Refetch whenever the profile sensor updates, or the day rolls over.
    const stamp = `${stateObj?.last_updated}|${localDateString()}`;
    if (stamp === this._lastStamp) return;
    this._lastStamp = stamp;
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._fetch(), 150);
  }

  async _fetch() {
    if (!this.hass || !this._entityId) return;
    if (this._fetching) {
      this._refetch = true;
      return;
    }
    this._fetching = true;
    try {
      this._stats = await this.hass.callWS({
        type: 'calorie_tracker/get_dashboard_stats',
        entity_id: this._entityId,
        date: localDateString(),
      });
      this._error = null;
    } catch (err) {
      this._error =
        err?.code === 'unknown_command'
          ? 'This card needs the updated Calorie Tracker integration. Restart Home Assistant after updating.'
          : `Couldn't load data: ${err.message || err}`;
    } finally {
      this._fetching = false;
      if (this._refetch) {
        this._refetch = false;
        this._fetch();
      }
    }
  }

  _openLog() {
    const dialog = document.createElement('hf-log-dialog');
    dialog.hass = this.hass;
    dialog.entityId = this._entityId;
    dialog.usdaApiKey = this._config.usda_api_key || '';
    dialog.searchUsda = this._config.search_usda !== false;
    dialog.addEventListener('hf-logged', this._onLogged);
    document.body.appendChild(dialog);
  }

  /* ---------- formatting ---------- */

  get _lang() {
    return this.hass?.locale?.language || this.hass?.language || undefined;
  }

  _fmt(value, digits = 0) {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat(this._lang, { maximumFractionDigits: digits }).format(value);
  }

  _time(ts) {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(this._lang, { hour: 'numeric', minute: '2-digit' });
  }

  _shortDate(iso) {
    const [y, m, d] = (iso || '').split('-').map(Number);
    if (!y) return '';
    const date = new Date(y, m - 1, d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'today';
    if (date.toDateString() === yesterday.toDateString()) return 'yesterday';
    return date.toLocaleDateString(this._lang, { month: 'short', day: 'numeric' });
  }

  /* ---------- render ---------- */

  render() {
    if (!this._config) return nothing;
    return html`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title}</div>
          <button class="btn" @click=${this._openLog} ?disabled=${!this._entityId}>
            <ha-icon icon="mdi:plus"></ha-icon>Log
          </button>
        </div>
        ${this._error
          ? html`<div class="error">${this._error}</div>`
          : !this._stats
            ? html`<div class="loading">Loading…</div>`
            : html`
                <div class="layout">
                  <div class="left">
                    ${this._renderRing()} ${this._renderMacroTable()} ${this._renderActivityTile()}
                    ${this._renderWeight()}
                  </div>
                  <div class="right" style="--hf-list-height:${Number(this._config.list_height) || 360}px">
                    ${this._renderActivity()}
                  </div>
                </div>
              `}
      </ha-card>
    `;
  }

  _renderRing() {
    const { consumed, budget, remaining, exercise } = this._stats.calories;
    const hasBudget = budget !== null && budget > 0;
    const pct = hasBudget ? consumed / budget : 0;
    const over = hasBudget && remaining < 0;
    const r = 52;
    const circ = 2 * Math.PI * r;
    const arc = Math.min(pct, 1) * circ;

    return html`
      <div class="ring-block">
        <svg class="ring" viewBox="0 0 128 128" role="img"
          aria-label=${hasBudget ? `${Math.round(pct * 100)}% of daily calories` : 'Calories today'}>
          ${svg`
            <circle cx="64" cy="64" r=${r} class="ring-track"></circle>
            <circle cx="64" cy="64" r=${r} class="ring-value ${over ? 'over' : ''}"
              stroke-dasharray="${arc} ${circ}" transform="rotate(-90 64 64)"></circle>
          `}
        </svg>
        <div class="ring-text">
          <div class="ring-big">${this._fmt(consumed)}</div>
          <div class="ring-small">${hasBudget ? html`of ${this._fmt(budget)} kcal` : 'kcal eaten'}</div>
        </div>
        <div class="ring-side">
          ${hasBudget
            ? html`
                <div class="stat ${over ? 'over' : 'good'}">
                  <span class="stat-num">${this._fmt(Math.abs(remaining))}</span>
                  <span class="stat-label">${over ? 'kcal over' : 'kcal left'}</span>
                </div>
                <div class="stat">
                  <span class="stat-num">${Math.round(pct * 100)}%</span>
                  <span class="stat-label">of daily goal</span>
                </div>
              `
            : html`<div class="stat"><span class="stat-label">No calorie goal set</span></div>`}
          ${this._stats.health?.steps_linked
            ? html`<div class="stat">
                <span class="stat-num">${this._fmt(this._stats.health.steps)}</span>
                <span class="stat-label">steps</span>
              </div>`
            : nothing}
          ${exercise > 0
            ? html`<div class="stat">
                <span class="stat-num">${this._fmt(exercise)}</span>
                <span class="stat-label">kcal exercise</span>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  _renderMacroTable() {
    const { today, avg_7: avg7, avg_30: avg30 } = this._stats.macros;
    const row = (label, data, hint) => html`
      <tr title=${hint || ''}>
        <th scope="row">${label}</th>
        ${MACROS.map((m) => html`<td>${data?.[m.key] === null || data?.[m.key] === undefined ? '—' : `${this._fmt(data[m.key])}g`}</td>`)}
        <td class="kcal">${this._fmt(data?.calories)}</td>
      </tr>
    `;
    const daysHint = (a, n) => `Average of ${a.days_logged} logged day${a.days_logged === 1 ? '' : 's'} in the last ${n} (excludes today)`;
    return html`
      <table class="macros">
        <thead>
          <tr>
            <th></th>
            ${MACROS.map((m) => html`<th><span class="dot ${m.key}"></span>${m.label}</th>`)}
            <th class="kcal">kcal</th>
          </tr>
        </thead>
        <tbody>
          ${row('Today', today)} ${row('7-day avg', avg7, daysHint(avg7, 7))}
          ${row('30-day avg', avg30, daysHint(avg30, 30))}
        </tbody>
      </table>
      ${this._renderMacroBar(today)}
    `;
  }

  _renderMacroBar(today) {
    const kcal = { p: (today.p || 0) * 4, c: (today.c || 0) * 4, f: (today.f || 0) * 9 };
    const total = kcal.p + kcal.c + kcal.f;
    if (!total) return nothing;
    return html`
      <div class="macro-bar" title="Today's calories by macro">
        ${MACROS.map(
          (m) => html`<span class="seg ${m.key}" style="flex-grow:${kcal[m.key]}"
            >${kcal[m.key] / total >= 0.12 ? `${Math.round((kcal[m.key] / total) * 100)}%` : ''}</span>`,
        )}
      </div>
    `;
  }

  _renderActivityTile() {
    const h = this._stats.health;
    if (!h?.active_linked) return nothing;
    const active = h.active_kcal;
    const budget = h.estimated_activity_kcal;
    const pct = active !== null && budget > 0 ? Math.min(active / budget, 1) : 0;
    const title =
      'Your activity multiplier already budgets this much movement per day. ' +
      'Only active calories above it (minus exercise you logged yourself) are added as exercise.';
    return html`
      <div class="tile" title=${title}>
        <div class="tile-row">
          <ha-icon icon="mdi:fire"></ha-icon>
          <span class="tile-label">Active</span>
          <span class="tile-value">${active === null ? '—' : this._fmt(active)}<small> / ${this._fmt(budget)} kcal</small></span>
        </div>
        <div class="meter"><span style="width:${pct * 100}%"></span></div>
        <div class="tile-note">
          ${active === null
            ? 'Waiting for today\'s first Apple Health reading'
            : h.credited_kcal > 0
              ? html`<span class="good">+${this._fmt(h.credited_kcal)} kcal</span> above your usual day, added as exercise`
              : `${this._fmt(Math.max(0, budget - active))} kcal until extra activity counts`}
        </div>
      </div>
    `;
  }

  _renderWeight() {
    const w = this._stats.last_weight;
    return html`
      <div class="weight">
        <ha-icon icon="mdi:scale-bathroom"></ha-icon>
        <span class="weight-label">Last weight</span>
        ${w
          ? html`<span class="weight-value">${this._fmt(w.weight, 1)} ${w.unit}</span>
              <span class="weight-date">${this._shortDate(w.date)}</span>`
          : html`<span class="weight-date">None logged yet</span>`}
      </div>
    `;
  }

  _renderActivity() {
    const foods = (this._stats.food_entries || []).map((e) => ({ ...e, kind: 'food' }));
    const exercise = this._config.show_exercise
      ? (this._stats.exercise_entries || []).map((e) => ({ ...e, kind: 'exercise' }))
      : [];
    const items = [...foods, ...exercise].sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

    return html`
      <div class="activity-head">
        <span>Today</span>
        <span class="muted">${foods.length} item${foods.length === 1 ? '' : 's'}</span>
      </div>
      <div class="activity">
        ${items.length === 0
          ? html`<div class="empty">
              <ha-icon icon="mdi:silverware-fork-knife"></ha-icon>
              <div>Nothing logged yet today.</div>
            </div>`
          : items.map((item) => (item.kind === 'food' ? this._renderFood(item) : this._renderExercise(item)))}
      </div>
    `;
  }

  _renderFood(entry) {
    let name = entry.food_item || 'Food';
    let grams = null;
    const m = name.match(SERVING_SUFFIX);
    if (m) {
      grams = m[1];
      name = name.replace(SERVING_SUFFIX, '');
    }
    const hasMacros = MACROS.some((mac) => num(entry[mac.key]));
    return html`
      <div class="item">
        <div class="item-main">
          <div class="item-name" title=${name}>${name}</div>
          <div class="item-meta">${this._time(entry.timestamp)}${grams ? html` · ${grams}` : nothing}</div>
          ${hasMacros
            ? html`<div class="item-macros">
                ${MACROS.map(
                  (mac) => html`<span><span class="dot ${mac.key}"></span>${this._fmt(num(entry[mac.key]) || 0)}g</span>`,
                )}
              </div>`
            : nothing}
        </div>
        <div class="item-cal">${this._fmt(entry.calories)}<span>kcal</span></div>
      </div>
    `;
  }

  _renderExercise(entry) {
    const details = [this._time(entry.timestamp)];
    if (entry.duration_minutes) details.push(`${entry.duration_minutes} min`);
    return html`
      <div class="item exercise">
        <div class="item-main">
          <div class="item-name">
            <ha-icon icon="mdi:run"></ha-icon>${entry.exercise_type || 'Exercise'}
          </div>
          <div class="item-meta">${details.join(' · ')}</div>
        </div>
        <div class="item-cal">−${this._fmt(entry.calories_burned || 0)}<span>kcal</span></div>
      </div>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: block;
          container-type: inline-size;
        }
        ha-card {
          color: var(--primary-text-color);
          padding: 16px;
          box-sizing: border-box;
          height: 100%;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .title {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .btn ha-icon { --mdc-icon-size: 18px; }
        .error, .loading {
          padding: 24px 8px;
          color: var(--hf-muted);
          text-align: center;
        }
        .error { color: var(--hf-over); }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px;
        }
        .left {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
        }
        /* Right column fills the left column's height and scrolls. */
        .right {
          position: relative;
          min-height: 240px;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--hf-divider);
          padding-left: 20px;
        }
        @container (max-width: 560px) {
          .layout { grid-template-columns: minmax(0, 1fr); }
          .right {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--hf-divider);
            padding-top: 12px;
          }
          .activity {
            position: static !important;
            max-height: var(--hf-list-height);
          }
        }

        /* Ring */
        .ring-block {
          display: grid;
          grid-template-columns: 128px 1fr;
          align-items: center;
          gap: 16px;
          position: relative;
        }
        .ring { width: 128px; height: 128px; }
        .ring circle { fill: none; stroke-width: 12; }
        .ring-track { stroke: var(--hf-divider); }
        .ring-value {
          stroke: var(--primary-color);
          stroke-linecap: round;
          transition: stroke-dasharray 0.6s ease;
        }
        .ring-value.over { stroke: var(--hf-over); }
        .ring-text {
          position: absolute;
          left: 0;
          top: 0;
          width: 128px;
          height: 128px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ring-big {
          font-size: 1.7rem;
          font-weight: 600;
          line-height: 1.1;
          color: var(--primary-text-color);
        }
        .ring-small { font-size: 0.75rem; color: var(--hf-muted); }
        .ring-side { display: flex; flex-direction: column; gap: 8px; }
        .stat { display: flex; flex-direction: column; line-height: 1.15; }
        .stat-num { font-size: 1.15rem; font-weight: 600; color: var(--primary-text-color); }
        .stat-label { font-size: 0.8rem; color: var(--hf-muted); }
        .stat.good .stat-num { color: var(--hf-good); }
        .stat.over .stat-num { color: var(--hf-over); }

        /* Macro table */
        table.macros {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          font-variant-numeric: tabular-nums;
        }
        .macros th, .macros td {
          padding: 5px 4px;
          text-align: right;
          white-space: nowrap;
        }
        .macros thead th {
          font-weight: 500;
          font-size: 0.75rem;
          color: var(--hf-muted);
          border-bottom: 1px solid var(--hf-divider);
        }
        .macros td { color: var(--primary-text-color); }
        .macros tbody th {
          text-align: left;
          font-weight: 500;
          color: var(--hf-muted);
        }
        .macros tbody tr:first-child td { font-weight: 600; color: var(--primary-text-color); }
        .macros .kcal { color: var(--hf-muted); }
        .macro-bar {
          display: flex;
          height: 16px;
          border-radius: 8px;
          overflow: hidden;
          font-size: 0.65rem;
          font-weight: 600;
          color: #fff;
        }
        .macro-bar .seg {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-basis: 0;
          min-width: 0;
        }
        .seg.p { background: var(--hf-protein); }
        .seg.c { background: var(--hf-carbs); }
        .seg.f { background: var(--hf-fat); }

        /* Activity tile */
        .tile {
          padding: 10px 12px;
          border-radius: 10px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
          font-size: 0.9rem;
        }
        .tile-row { display: flex; align-items: center; gap: 8px; }
        .tile-row ha-icon { color: var(--hf-carbs); --mdc-icon-size: 20px; }
        .tile-label { color: var(--hf-muted); }
        .tile-value { margin-left: auto; font-weight: 600; color: var(--primary-text-color); }
        .tile-value small { font-weight: 400; color: var(--hf-muted); font-size: 0.8rem; }
        .meter {
          height: 6px;
          border-radius: 3px;
          margin: 8px 0 6px;
          background: var(--hf-divider);
          overflow: hidden;
        }
        .meter span {
          display: block;
          height: 100%;
          background: var(--hf-carbs);
          border-radius: 3px;
          transition: width 0.6s ease;
        }
        .tile-note { font-size: 0.78rem; color: var(--hf-muted); }
        .tile-note .good { color: var(--hf-good); font-weight: 600; }

        /* Weight */
        .weight {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 10px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
          font-size: 0.9rem;
        }
        .weight ha-icon { color: var(--hf-muted); --mdc-icon-size: 20px; }
        .weight-label { color: var(--hf-muted); }
        .weight-value { margin-left: auto; font-weight: 600; color: var(--primary-text-color); }
        .weight-date { color: var(--hf-muted); font-size: 0.8rem; }
        .weight-label + .weight-date { margin-left: auto; }

        /* Activity list */
        .activity-head {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--primary-text-color);
        }
        .muted { color: var(--hf-muted); font-weight: 400; font-size: 0.85rem; }
        .activity {
          position: absolute;
          top: 28px;
          bottom: 0;
          left: 20px;
          right: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 32px 0;
          color: var(--hf-muted);
        }
        .item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 10px 2px;
          border-bottom: 1px solid var(--hf-divider);
        }
        .item:last-child { border-bottom: none; }
        .item-name {
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .item-name ha-icon { --mdc-icon-size: 18px; color: var(--hf-good); }
        .item-meta { font-size: 0.75rem; color: var(--hf-muted); margin-top: 1px; }
        .item-macros {
          display: flex;
          gap: 10px;
          margin-top: 4px;
          font-size: 0.78rem;
          color: var(--hf-muted);
          font-variant-numeric: tabular-nums;
        }
        .item-macros .dot { width: 6px; height: 6px; margin-right: 4px; }
        .item-cal {
          font-size: 1.6rem;
          font-weight: 600;
          line-height: 1;
          color: var(--primary-text-color);
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .item-cal span {
          display: block;
          font-size: 0.7rem;
          font-weight: 400;
          color: var(--hf-muted);
          margin-top: 2px;
        }
        .item.exercise .item-cal { color: var(--hf-good); }
      `,
    ];
  }
}

/* ------------------------------------------------------------------------- */
/* Log dialog (appended to <body> so dashboard layouts can't clip it)        */
/* ------------------------------------------------------------------------- */

class HfLogDialog extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      entityId: { attribute: false },
      usdaApiKey: { attribute: false },
      searchUsda: { attribute: false },
      _query: { state: true },
      _results: { state: true },
      _searching: { state: true },
      _searchErrors: { state: true },
      _selected: { state: true },
      _units: { state: true },
      _loadingPortions: { state: true },
      _form: { state: true },
      _caloriesTouched: { state: true },
      _saving: { state: true },
      _error: { state: true },
    };
  }

  constructor() {
    super();
    this._query = '';
    this._results = [];
    this._searching = false;
    this._searchErrors = [];
    this._selected = null;
    this._units = buildUnits(null);
    this._loadingPortions = false;
    this._form = { name: '', amount: '', unit: 'g', calories: '', p: '', c: '', f: '' };
    this._unitTouched = false;
    this._caloriesTouched = false;
    this._saving = false;
    this._error = null;
    this._searchSeq = 0;
    this._onKey = (e) => {
      if (e.key === 'Escape') this._close();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKey);
    clearTimeout(this._searchTimer);
  }

  firstUpdated() {
    this.renderRoot.querySelector('#search')?.focus();
  }

  _close() {
    this.remove();
  }

  /* ---------- search ---------- */

  _onSearchInput(e) {
    this._query = e.target.value;
    clearTimeout(this._searchTimer);
    if (this._query.trim().length < 2) {
      this._results = [];
      this._searchErrors = [];
      this._searching = false;
      return;
    }
    this._searching = true;
    this._searchTimer = setTimeout(() => this._search(), 400);
  }

  async _search() {
    const seq = ++this._searchSeq;
    const msg = {
      type: 'calorie_tracker/search_foods',
      query: this._query.trim(),
      include_usda: this.searchUsda !== false,
      limit: 20,
    };
    if (this.usdaApiKey) msg.usda_api_key = this.usdaApiKey;
    try {
      const resp = await this.hass.callWS(msg);
      if (seq !== this._searchSeq) return; // a newer search is in flight
      this._results = resp.results || [];
      this._searchErrors = resp.errors || [];
    } catch (err) {
      if (seq !== this._searchSeq) return;
      this._results = [];
      this._searchErrors = [`Search failed: ${err.message || err}`];
    } finally {
      if (seq === this._searchSeq) this._searching = false;
    }
  }

  /* ---------- units & scaling ---------- */

  get _unit() {
    return this._units.find((u) => u.id === this._form.unit) || this._units.find((u) => u.id === 'g');
  }

  /** Grams for the current amount + unit, or null when it can't be known. */
  _grams(form = this._form) {
    const unit = this._units.find((u) => u.id === form.unit);
    const amount = parseAmount(form.amount);
    if (!unit || amount === null || unit.g === null) return null;
    return amount * unit.g;
  }

  _scaled(item, grams) {
    const factor = grams / item.base_g;
    const s = (v) => (v === null || v === undefined ? '' : round1(v * factor));
    return {
      calories: item.calories === null ? '' : Math.round(item.calories * factor),
      p: s(item.protein),
      c: s(item.carbs),
      f: s(item.fat),
    };
  }

  /** Default unit for a food: its first household portion, else grams. */
  _defaultAmount(item, units) {
    const first = item.portions?.[0];
    // Branded labels like "2 tbsp" (32 g) open as 2 tbsp.
    if (first?.volume_unit && !units.some((u) => u.group === 'food' && u.g === first.per_unit_g)) {
      const servings = item.default_g !== item.base_g ? item.default_g / first.per_unit_g : 1;
      return { unit: first.volume_unit, amount: fmtAmount(servings) };
    }
    const portion = units.find((u) => u.group === 'food');
    if (portion) return { unit: portion.id, amount: '1' };
    return { unit: 'g', amount: String(round1(item.default_g || item.base_g || 100)) };
  }

  _applyScaling(form) {
    const grams = this._grams(form);
    if (this._selected && grams && grams > 0) {
      const calories = form.calories;
      Object.assign(form, this._scaled(this._selected, grams));
      if (this._caloriesTouched) form.calories = calories;
    }
    return form;
  }

  _select(item) {
    const label =
      item.brand && !item.name.toLowerCase().includes(item.brand.toLowerCase())
        ? `${item.brand} ${item.name}`
        : item.name;
    this._selected = item;
    this._units = buildUnits(item);
    this._unitTouched = false;
    this._caloriesTouched = false;
    this._form = this._applyScaling({ ...this._form, name: label, ...this._defaultAmount(item, this._units) });
    this._results = [];
    this._query = '';
    this.updateComplete.then(() => this.renderRoot.querySelector('#amount')?.select());
    if (item.portions_pending && item.fdc_id) this._loadPortions(item);
  }

  async _loadPortions(item) {
    this._loadingPortions = true;
    try {
      const msg = { type: 'calorie_tracker/get_food_portions', fdc_id: item.fdc_id };
      if (this.usdaApiKey) msg.usda_api_key = this.usdaApiKey;
      const resp = await this.hass.callWS(msg);
      if (this._selected !== item || !resp?.portions?.length) return;
      const updated = { ...item, portions: resp.portions, portions_pending: false };
      this._selected = updated;
      this._units = buildUnits(updated);
      // Only switch the unit if the user hasn't already picked one.
      if (!this._unitTouched) {
        this._form = this._applyScaling({ ...this._form, ...this._defaultAmount(updated, this._units) });
      } else {
        this._form = this._applyScaling({ ...this._form });
      }
    } catch (err) {
      // Non-fatal: grams and generic volumes still work.
    } finally {
      this._loadingPortions = false;
    }
  }

  _clearSelection() {
    this._selected = null;
    this._units = buildUnits(null);
    if (!this._units.some((u) => u.id === this._form.unit)) {
      this._form = { ...this._form, unit: 'g' };
    }
  }

  /* ---------- form ---------- */

  _caloriesFromMacros(form) {
    const p = num(form.p) || 0;
    const c = num(form.c) || 0;
    const f = num(form.f) || 0;
    return p || c || f ? Math.round(p * 4 + c * 4 + f * 9) : '';
  }

  _onField(field, e) {
    const value = e.target.value;
    let form = { ...this._form, [field]: value };

    if (field === 'amount' || field === 'unit') {
      if (field === 'unit') {
        this._unitTouched = true;
        form.amount = this._convertAmount(this._form, value);
      }
      form = this._applyScaling(form);
    } else if (field === 'calories') {
      this._caloriesTouched = value !== '';
      if (!this._caloriesTouched) form.calories = this._caloriesFromMacros(form);
    } else if (['p', 'c', 'f'].includes(field)) {
      // Hand-edited macros no longer follow the selected food's numbers.
      this._selected = null;
      this._units = buildUnits(null);
      if (!this._units.some((u) => u.id === form.unit)) form.unit = 'g';
      if (!this._caloriesTouched) form.calories = this._caloriesFromMacros(form);
    }
    this._form = form;
  }

  /** Keep the quantity when switching g<->oz or cup<->tbsp; start portions at 1. */
  _convertAmount(form, newUnitId) {
    const from = this._units.find((u) => u.id === form.unit);
    const to = this._units.find((u) => u.id === newUnitId);
    const amount = parseAmount(form.amount);
    if (!from || !to || amount === null) return form.amount;
    // Anything with a known weight converts cleanly into a weight unit.
    const grams = this._grams(form);
    if (to.group === 'mass' && grams !== null) {
      return to.id === 'g' ? String(Math.round(grams)) : fmtAmount(grams / to.g);
    }
    if (from.group === to.group && from.group !== 'food') {
      const ratio = from.group === 'mass' ? from.g / to.g : ML_PER[from.id] / ML_PER[to.id];
      const converted = amount * ratio;
      return to.id === 'g' ? String(Math.round(converted)) : fmtAmount(converted);
    }
    return '1';
  }

  /** "(1.5 cup · 355 g)", "(150 g)", "(1 cup)" — appended to the stored food name. */
  _amountSuffix() {
    const amount = parseAmount(this._form.amount);
    if (amount === null) return '';
    const unit = this._unit;
    const grams = this._grams();
    const qty = fmtAmount(amount);
    if (unit.id === 'g') return ` (${qty} g)`;
    const unitText = unit.label.split(' (')[0];
    if (grams === null) return ` (${qty} ${unitText})`;
    const approx = unit.quality === 'rough' || unit.quality === 'derived' ? '~' : '';
    return ` (${qty} ${unitText} · ${approx}${Math.round(grams)} g)`;
  }

  async _save(e) {
    e?.preventDefault();
    const name = this._form.name.trim();
    const calories = num(this._form.calories);
    if (!name) {
      this._error = 'Give the food a name.';
      return;
    }
    if (calories === null || calories < 0) {
      this._error = 'Enter calories, or macros to calculate them.';
      return;
    }
    if (this._form.amount.trim() && parseAmount(this._form.amount) === null) {
      this._error = 'Amount should be a number like 1.5 or 1 1/2.';
      return;
    }
    const entry = {
      food_item: `${name}${this._amountSuffix()}`,
      calories: Math.round(calories),
    };
    for (const key of ['p', 'c', 'f']) {
      const v = num(this._form[key]);
      if (v) entry[key] = round1(v);
    }

    this._saving = true;
    this._error = null;
    try {
      await this.hass.callWS({
        type: 'calorie_tracker/add_entry',
        entity_id: this.entityId,
        entry_type: 'food',
        entry,
      });
      this.dispatchEvent(new CustomEvent('hf-logged', { detail: entry }));
      this._close();
    } catch (err) {
      this._error = `Couldn't save: ${err.message || err}`;
    } finally {
      this._saving = false;
    }
  }

  /* ---------- render ---------- */

  _resultKcal(item) {
    const grams = item.default_g || item.base_g;
    return Math.round((item.calories * grams) / item.base_g);
  }

  _resultServing(item) {
    const portion = item.portions?.[0];
    if (portion) return `1 ${portion.unit_label.split(' (')[0]} · ${Math.round(portion.per_unit_g)} g`;
    return `${Math.round(item.default_g || item.base_g)} g`;
  }

  _renderAmountHint() {
    if (this._loadingPortions) return html`<div class="hint">Loading serving sizes…</div>`;
    const unit = this._unit;
    const grams = this._grams();
    if (unit.id === 'g' || grams === null) {
      if (unit.quality === 'unknown' && parseAmount(this._form.amount) !== null) {
        return html`<div class="hint">Pick a food from search to convert ${unit.label} to grams.</div>`;
      }
      return nothing;
    }
    const g = Math.round(grams);
    if (unit.quality === 'exact') return html`<div class="hint">= ${g} g</div>`;
    if (unit.quality === 'derived') {
      return html`<div class="hint">≈ ${g} g · based on 1 ${unit.basis.unit_label} = ${Math.round(unit.basis.per_unit_g)} g</div>`;
    }
    return html`<div class="hint warn">≈ ${g} g · rough guess: no volume data for this food, so it assumes the density of water. Weigh it or pick a portion for accuracy.</div>`;
  }

  _renderUnitSelect() {
    const groups = [
      ['food', 'This food'],
      ['volume', 'Volume'],
      ['mass', 'Weight'],
    ];
    return html`
      <select id="unit" @change=${(e) => this._onField('unit', e)}>
        ${groups.map(([group, label]) => {
          const opts = this._units.filter((u) => u.group === group);
          if (!opts.length) return nothing;
          return html`<optgroup label=${label}>
            ${opts.map(
              (u) => html`<option value=${u.id} ?selected=${u.id === this._form.unit}>
                ${u.group === 'food' ? `${u.label} (${fmtAmount(u.g)} g)` : u.label}
              </option>`,
            )}
          </optgroup>`;
        })}
      </select>
    `;
  }

  render() {
    const f = this._form;
    const autoCalories = !this._caloriesTouched && f.calories !== '' && !this._selected;
    return html`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="hf-title">
        <div class="dialog-head">
          <h2 id="hf-title">Log food</h2>
          <button class="icon-btn" @click=${this._close} aria-label="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <div class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input id="search" type="search" autocomplete="off"
            placeholder=${this.searchUsda === false ? 'Search your foods database' : 'Search foods or brands (USDA + your foods database)'}
            .value=${this._query} @input=${this._onSearchInput} />
          ${this._searching ? html`<span class="spinner"></span>` : nothing}
        </div>
        ${this._searchErrors.map((msg) => html`<div class="hint warn">${msg}</div>`)}
        ${this._results.length
          ? html`<div class="results">
              ${this._results.map(
                (item) => html`
                  <button class="result" @click=${() => this._select(item)}>
                    <div class="result-main">
                      <div class="result-name">${item.name}</div>
                      <div class="result-meta">
                        <span class="chip ${item.source}">${item.source_label}</span>
                        ${item.brand && item.source !== 'local' ? html`<span>${item.brand}</span>` : nothing}
                        <span>${this._resultServing(item)}</span>
                      </div>
                    </div>
                    <div class="result-kcal">${this._resultKcal(item)}<span>kcal</span></div>
                  </button>
                `,
              )}
            </div>`
          : !this._searching && this._query.trim().length >= 2 && !this._searchErrors.length
            ? html`<div class="hint">No matches. Enter it manually below.</div>`
            : nothing}

        <form @submit=${this._save}>
          ${this._selected
            ? html`<div class="selected">
                <span>Nutrition scales with the amount (from ${this._selected.source_label}).</span>
                <button type="button" class="link" @click=${this._clearSelection}>Unlink</button>
              </div>`
            : nothing}
          <label class="full">
            <span>Food name</span>
            <input .value=${f.name} @input=${(e) => this._onField('name', e)} required />
          </label>
          <div>
            <div class="row amount-row">
              <label>
                <span>Amount</span>
                <input id="amount" type="text" inputmode="decimal" placeholder="e.g. 1 1/2"
                  .value=${String(f.amount)} @input=${(e) => this._onField('amount', e)} />
              </label>
              <label>
                <span>Unit</span>
                ${this._renderUnitSelect()}
              </label>
              <label>
                <span>Calories ${autoCalories ? html`<em>from macros</em>` : nothing}</span>
                <input type="number" inputmode="numeric" min="0" step="1"
                  .value=${String(f.calories)} @input=${(e) => this._onField('calories', e)} />
              </label>
            </div>
            ${this._renderAmountHint()}
          </div>
          <div class="row three">
            ${MACROS.map(
              (m) => html`
                <label>
                  <span><span class="dot ${m.key}"></span>${m.label} (g)</span>
                  <input type="number" inputmode="decimal" min="0" step="any"
                    .value=${String(f[m.key])} @input=${(e) => this._onField(m.key, e)} />
                </label>
              `,
            )}
          </div>
          ${this._error ? html`<div class="hint warn">${this._error}</div>` : nothing}
          <div class="actions">
            <button type="button" class="btn secondary" @click=${this._close}>Cancel</button>
            <button type="submit" class="btn" ?disabled=${this._saving}>
              ${this._saving ? 'Saving…' : 'Log food'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family-body, Roboto, sans-serif));
        }
        .backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
        }
        .dialog {
          position: relative;
          width: min(520px, calc(100vw - 32px));
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          background: var(--card-background-color, var(--primary-background-color, #fff));
          color: var(--primary-text-color);
          border-radius: var(--ha-dialog-border-radius, 20px);
          padding: 20px;
          box-sizing: border-box;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 600px) {
          :host { align-items: flex-end; }
          .dialog {
            width: 100vw;
            max-height: 92vh;
            border-radius: 20px 20px 0 0;
            padding-bottom: calc(20px + env(safe-area-inset-bottom));
          }
        }
        .dialog-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
        .icon-btn {
          background: none;
          border: none;
          color: var(--hf-muted);
          padding: 4px;
          border-radius: 50%;
          display: flex;
        }
        .search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid var(--hf-divider);
          border-radius: 12px;
          background: var(--secondary-background-color, transparent);
        }
        .search ha-icon { color: var(--hf-muted); --mdc-icon-size: 20px; }
        .search input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 0;
          outline: none;
        }
        input {
          font: inherit;
          color: var(--primary-text-color);
          min-width: 0;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--hf-divider);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .results {
          margin-top: 8px;
          max-height: 260px;
          overflow-y: auto;
          border: 1px solid var(--hf-divider);
          border-radius: 12px;
        }
        .result {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-bottom: 1px solid var(--hf-divider);
          padding: 10px 12px;
          color: inherit;
        }
        .result:last-child { border-bottom: none; }
        .result:hover, .result:focus-visible {
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
          outline: none;
        }
        .result-name {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          font-size: 0.75rem;
          color: var(--hf-muted);
          margin-top: 2px;
        }
        .chip {
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 600;
          background: var(--hf-divider);
          color: var(--primary-text-color);
        }
        .chip.local { background: var(--primary-color); color: var(--text-primary-color, #fff); }
        .result-kcal { font-size: 1.15rem; font-weight: 600; text-align: right; }
        .result-kcal span { display: block; font-size: 0.65rem; font-weight: 400; color: var(--hf-muted); }
        .hint { font-size: 0.8rem; color: var(--hf-muted); margin: 8px 2px 0; }
        .hint.warn { color: var(--hf-over); }
        form { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .selected {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--hf-muted);
          padding: 8px 10px;
          border-radius: 10px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
        }
        .link {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 600;
          padding: 0;
        }
        .row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .row.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .row.amount-row { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr) minmax(0, 1fr); }
        select {
          font: inherit;
          color: var(--primary-text-color);
          width: 100%;
          box-sizing: border-box;
          padding: 10px 8px;
          border: 1px solid var(--hf-divider);
          border-radius: 10px;
          background: var(--secondary-background-color, transparent);
          outline: none;
        }
        select:focus { border-color: var(--primary-color); }
        option, optgroup { background: var(--card-background-color, #fff); color: var(--primary-text-color); }
        label { display: flex; flex-direction: column; gap: 4px; }
        label > span { font-size: 0.78rem; color: var(--hf-muted); }
        label em { font-style: normal; color: var(--primary-color); margin-left: 4px; }
        label input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid var(--hf-divider);
          border-radius: 10px;
          background: var(--secondary-background-color, transparent);
          outline: none;
        }
        label input:focus { border-color: var(--primary-color); }
        .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
        .actions .btn { padding: 9px 18px; }
      `,
    ];
  }
}

if (!customElements.get('hf-log-dialog')) {
  customElements.define('hf-log-dialog', HfLogDialog);
}
if (!customElements.get('health-fitness-card')) {
  customElements.define('health-fitness-card', HealthFitnessCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'health-fitness-card',
  name: 'Calorie Tracker: Health & Fitness',
  description: "Today's calories, macros with 7/30-day averages, last weight, and a scrollable food log with quick logging and USDA search.",
  preview: true,
});
