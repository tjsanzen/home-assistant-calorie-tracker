import{a as kt,b as u,c as Wt,e as P,g as Ct,h as ae}from"./chunk-EMR7U3YA.js";import{a as S,b as Z,e as U,f as J}from"./chunk-5HHMTMB7.js";var Ot=U(()=>{var ft=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._summaryLoaded=!1,this._styleObserver=null,this._translations=null,this._translationsLang=null}async _ensureSummaryLoaded(){if(!this._summaryLoaded&&!customElements.get("calorie-summary"))try{await import("./summary-T45HUWTR.js"),this._summaryLoaded=!0}catch(t){console.error("Failed to load summary component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <calorie-summary></calorie-summary>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var r,a,n,o,d,h;await this._ensureSummaryLoaded(),await customElements.whenDefined("calorie-summary");let t=this.querySelector("calorie-summary");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(c=>c.startsWith("sensor.calorie_tracker_profile"))),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.weekStartDay=((r=i==null?void 0:i.attributes)==null?void 0:r.week_start_day)||"sunday",t.selectedDate=this.selectedDate||this._getLocalDateString(),this._applyWrapperStyles(t),!this._styleObserver&&t.renderRoot&&(this._styleObserver=new MutationObserver(()=>{this._applyWrapperStyles(t)}),this._styleObserver.observe(t.renderRoot,{childList:!0,subtree:!0}));let s=((n=(a=this.hass)==null?void 0:a.locale)==null?void 0:n.language)||((o=this.hass)==null?void 0:o.language)||"en";if(!this._translations||this._translationsLang!==s)try{let c=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:s,namespace:"frontend.summary"});this._translations=(c==null?void 0:c.translations)||{},this._translationsLang=s}catch(c){console.warn("Failed to fetch summary translations:",c),this._translations={},this._translationsLang=s}t.translations=this._translations||{};try{let[c,F]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_weekly_summary",entity_id:e,date:t.selectedDate}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate})]);t.weeklySummary=(d=c==null?void 0:c.weekly_summary)!=null?d:{},t.weight=(h=F==null?void 0:F.weight)!=null?h:null}catch(c){console.error("Failed to fetch calorie data:",c)}this._eventsAttached||(t.addEventListener("select-summary-date",c=>{this.selectedDate=c.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyWrapperStyles(t){if(!(t!=null&&t.renderRoot))return;let e=t.renderRoot.querySelector(".gauge-container");if(e){e.style.width="120px",e.style.height="120px",e.style.maxWidth="120px";let i=e.querySelector("svg");i&&(i.style.maxWidth="120px",i.style.maxHeight="120px")}}disconnectedCallback(){this._styleObserver&&(this._styleObserver.disconnect(),this._styleObserver=null)}};customElements.get("calorie-summary-card")||customElements.define("calorie-summary-card",ft);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-summary-card",name:"Calorie Tracker: Summary",description:"Full weekly summary card for the Calorie Tracker integration",editor:"calorie-summary-editor",preview:!0});var Lt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),s=()=>{let r=S({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",s),e&&e.addEventListener("value-changed",s)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-summary-editor")||customElements.define("calorie-summary-editor",Lt);ft.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};ft.getStubConfig=function(){return{profile_entity_id:""}}});var jt=U(()=>{var _t=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._dailyDataLoaded=!1}async _ensureDailyDataLoaded(){if(!this._dailyDataLoaded&&!customElements.get("daily-data-card"))try{await import("./daily-data-5E2NVXPT.js"),this._dailyDataLoaded=!0}catch(t){console.error("Failed to load daily-data component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <daily-data-card></daily-data-card>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s,r,a,n;await this._ensureDailyDataLoaded(),await customElements.whenDefined("daily-data-card");let t=this.querySelector("daily-data-card");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(o=>o.startsWith("sensor.calorie_tracker_")&&o.includes("_profile")&&this.hass.states[o])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.selectedDate=this.selectedDate||this._getLocalDateString();try{let o=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate});t.log={food_entries:(o==null?void 0:o.food_entries)||[],exercise_entries:(o==null?void 0:o.exercise_entries)||[],weight:(s=o==null?void 0:o.weight)!=null?s:null,body_fat_pct:(r=o==null?void 0:o.body_fat_pct)!=null?r:null,bmr_and_neat:(a=o==null?void 0:o.bmr_and_neat)!=null?a:null,macros:(o==null?void 0:o.macros)||null,config_entry_id:(n=o==null?void 0:o.config_entry_id)!=null?n:null}}catch(o){console.error("Failed to fetch daily data:",o),t.log={food_entries:[],exercise_entries:[],weight:null,body_fat_pct:null,bmr_and_neat:null}}this._eventsAttached||(t.addEventListener("select-daily-date",o=>{this.selectedDate=o.detail.date,this._updateCard()}),t.addEventListener("refresh-daily-data",()=>{this._updateCard()}),t.addEventListener("add-daily-entry",async o=>{try{await this.hass.connection.sendMessagePromise(S({type:"calorie_tracker/add_entry",entity_id:e},o.detail)),this._updateCard()}catch(d){console.error("Failed to add entry:",d)}}),t.addEventListener("edit-daily-entry",async o=>{try{await this.hass.connection.sendMessagePromise(S({type:"calorie_tracker/update_entry",entity_id:e},o.detail)),this._updateCard()}catch(d){console.error("Failed to edit entry:",d)}}),t.addEventListener("delete-daily-entry",async o=>{try{await this.hass.connection.sendMessagePromise(S({type:"calorie_tracker/delete_entry",entity_id:e},o.detail)),this._updateCard()}catch(d){console.error("Failed to delete entry:",d)}}),this._eventsAttached=!0)}};customElements.get("calorie-daily-log-card")||customElements.define("calorie-daily-log-card",_t);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-daily-log-card",name:"Calorie Tracker: Daily Log",description:"Daily food/exercise log UI for the Calorie Tracker integration",editor:"calorie-daily-log-editor",preview:!0});var Et=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),s=()=>{let r=S({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",s),e&&e.addEventListener("value-changed",s)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-daily-log-editor")||customElements.define("calorie-daily-log-editor",Et);_t.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};_t.getStubConfig=function(){return{profile_entity_id:""}}});var Gt=U(()=>{var yt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._profileLoaded=!1}async _ensureProfileLoaded(){if(!this._profileLoaded&&!customElements.get("profile-card"))try{await import("./profile-card-Q5HMXRPY.js"),this._profileLoaded=!0}catch(t){console.error("Failed to load profile component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header" id="ct-header">${this.title}</div>`:""}
        <profile-card></profile-card>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}async _updateCard(){var a,n,o,d,h,c,F,N,M;await this._ensureProfileLoaded(),await customElements.whenDefined("profile-card");let t=this.querySelector("profile-card");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find($=>$.startsWith("sensor.calorie_tracker_")&&$.includes("_profile")&&this.hass.states[$])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i;let s=i.attributes||{};t.goalType=(a=s.goal_type)!=null?a:"Not Set",t.dailyGoal=(n=s.daily_goal_calories)!=null?n:null,t.goalValue=(o=s.goal_value)!=null?o:null,t.currentWeight=(d=s.current_weight)!=null?d:null;let r=this.querySelector("#ct-header");if(r)if(this.title)r.textContent=this.title;else{let $=((h=i.attributes)==null?void 0:h.spoken_name)||e||"Calorie Tracker";r.textContent=`${$} Calorie Tracker Profile`}try{let[$,y]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_user_profile",user_id:((c=this.hass.user)==null?void 0:c.id)||"unknown"}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_linked_components",entity_id:e})]);t.allProfiles=(F=$==null?void 0:$.all_profiles)!=null?F:[],t.defaultProfile=(N=$==null?void 0:$.default_profile)!=null?N:null,t.linkedDevices=(M=y==null?void 0:y.linked_components)!=null?M:[]}catch($){console.error("Failed to fetch profile data:",$);let y=Object.keys(this.hass.states).filter(C=>C.startsWith("sensor.calorie_tracker_profile")).map(C=>{var x;let E=this.hass.states[C];return{entity_id:C,spoken_name:((x=E.attributes)==null?void 0:x.spoken_name)||C}}).filter(C=>C);t.allProfiles=y,t.linkedDevices=[]}this._eventsAttached||(t.addEventListener("refresh-profile",()=>{this._updateCard()}),t.addEventListener("profile-selected",$=>{this.profileEntityId=$.detail.entityId,this._updateCard()}),t.addEventListener("profiles-updated",$=>{this._updateCard()}),this._eventsAttached=!0)}};customElements.get("calorie-profile-card")||customElements.define("calorie-profile-card",yt);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-profile-card",name:"Calorie Tracker: Profile",description:"Profile card for Calorie Tracker (shows user profile and settings)",editor:"calorie-profile-editor",preview:!0});var Tt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),s=()=>{let r=S({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",s),e&&e.addEventListener("value-changed",s)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-profile-editor")||customElements.define("calorie-profile-editor",Tt);yt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};yt.getStubConfig=function(){return{profile_entity_id:""}}});var Yt=U(()=>{var vt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._summaryLoaded=!1,this._styleObserver=null}async _ensureSummaryLoaded(){if(!this._summaryLoaded&&!customElements.get("calorie-summary"))try{await import("./summary-T45HUWTR.js"),this._summaryLoaded=!0}catch(t){console.error("Failed to load summary component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <calorie-summary></calorie-summary>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s,r;await this._ensureSummaryLoaded(),await customElements.whenDefined("calorie-summary");let t=this.querySelector("calorie-summary");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(a=>a.startsWith("sensor.calorie_tracker_")&&a.includes("_profile")&&this.hass.states[a])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.selectedDate=this.selectedDate||this._getLocalDateString(),this._applyGaugeOnlyStyles(t),!this._styleObserver&&t.renderRoot&&(this._styleObserver=new MutationObserver(()=>{this._applyGaugeOnlyStyles(t)}),this._styleObserver.observe(t.renderRoot,{childList:!0,subtree:!0}));try{let[a,n]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_weekly_summary",entity_id:e,date:t.selectedDate}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate})]);t.weeklySummary=(s=a==null?void 0:a.weekly_summary)!=null?s:{},t.weight=(r=n==null?void 0:n.weight)!=null?r:null}catch(a){console.error("Failed to fetch calorie data:",a)}this._eventsAttached||(t.addEventListener("select-summary-date",a=>{this.selectedDate=a.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyGaugeOnlyStyles(t){if(!(t!=null&&t.renderRoot))return;let e=t.renderRoot.querySelector(".bar-graph-section");e&&(e.style.display="none");let i=t.renderRoot.querySelector(".gauge-labels");i&&(i.style.display="none");let s=t.renderRoot.querySelector(".summary-container");s&&(s.style.justifyContent="center",s.style.alignItems="center",s.style.height="100%",s.style.maxWidth="none");let r=t.renderRoot.querySelector(".gauge-section");r&&(r.style.width="100%",r.style.flex="1",r.style.maxWidth="none");let a=t.renderRoot.querySelector(".gauge-container");a&&(a.style.width="100%",a.style.height="auto",a.style.aspectRatio="1 / 1",a.style.maxWidth=this.maxHeight,a.style.maxHeight=this.maxHeight);let n=t.renderRoot.querySelector(".gauge-container svg");n&&(n.style.width="100%",n.style.height="100%",n.style.maxWidth="none",n.style.maxHeight="none"),t.style&&(t.style.height="100%",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center")}disconnectedCallback(){this._styleObserver&&(this._styleObserver.disconnect(),this._styleObserver=null)}};customElements.get("calorie-gauge-card")||customElements.define("calorie-gauge-card",vt);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-gauge-card",name:"Calorie Gauge",description:"A compact gauge-only view for the Calorie Tracker summary",editor:"calorie-gauge-editor",preview:!0});var Dt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelectorAll("paper-input")[1],s=this.querySelector(".error"),r=()=>{let a=S({},this._config);t&&t.value?a.title=t.value.trim():delete a.title,e&&e.value?a.profile_entity_id=e.value:delete a.profile_entity_id,i&&i.value?a.max_height=i.value.trim():delete a.max_height,a.profile_entity_id?s&&(s.style.display="none"):s&&(s.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a}}))};t&&t.addEventListener("value-changed",r),e&&e.addEventListener("value-changed",r),i&&i.addEventListener("value-changed",r)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-gauge-editor")||customElements.define("calorie-gauge-editor",Dt);vt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}}]}};vt.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}}});var Bt=U(()=>{var ct=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var s;let i=(s=this.translations)==null?void 0:s[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,a)=>Object.prototype.hasOwnProperty.call(i,a)?String(i[a]):`{${a}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="protein-gauge-wrapper">
          <div class="protein-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="protein-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s,r,a;let t=this.querySelector(".protein-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyProteinStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),o=(s=n==null?void 0:n.weight)!=null?s:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(a=n==null?void 0:n.macros)!=null?a:{},c=Math.round(h.p||h.protein||0),F=this._profile&&this._profile.attributes||{},N=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(v,f,k)=>Number.isFinite(v)?!f||!k||f===k?v:f==="kg"&&k==="lbs"?v*2.20462:f==="lbs"&&k==="kg"?v/2.20462:v:null,y=Number.isFinite(N)?N:null;!Number.isFinite(y)&&Number.isFinite(o)&&(y=$(Number(o),d||M,M));let C=Number.isFinite(y)?y:null,E=Number.isFinite(y)?M==="kg"?y*2.20462:y:null,x=v=>v==null?null:v<5&&C!==null?Math.round(v*C):v,m=x(this.min),q=x(this.max),A=E!=null?E:150,T=Math.ceil(A/10)*10;(!Number.isFinite(T)||T<=0)&&(T=150),q!==null&&(T=q),this._gaugeMax=T,this._gaugeMin=m!==null?m:0,this._proteinValue=c,this._proteinWeight=E||0,this._proteinMin=m,this._proteinMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch protein data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyProteinStyles(t){if(!t)return;let e=t.querySelector(".protein-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("protein-gauge-card")||customElements.define("protein-gauge-card",ct);window.customCards=window.customCards||[];window.customCards.push({type:"protein-gauge-card",name:"Calorie Tracker: Protein Gauge",description:"Displays a protein gauge for the Calorie Tracker integration",editor:"protein-gauge-editor",preview:!0});var qt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],s=t[2],r=t[3],a=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),o=()=>{let c=S({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,a&&a.value?c.profile_entity_id=a.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,s&&s.value?c.min=Number(s.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",o)),a&&a.addEventListener("value-changed",o)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("protein-gauge-editor")||customElements.define("protein-gauge-editor",qt);ct.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};ct.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};ct.prototype._renderGauge=function(){let p=this.querySelector(".protein-svg");if(!p)return;let t=Math.max(0,this._proteinValue||0),e=this._proteinMin,i=this._proteinMax,s=this._gaugeMax||100,r=i!==null?i*1.1:s*1.1,a={x:70,y:70},n=40,o=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),N=d+F*c,M=l=>l*Math.PI/180,$=(l,_,b)=>{let w=M(l),H=M(_),z=a.x+b*Math.cos(w),I=a.y+b*Math.sin(w),O=a.x+b*Math.cos(H),G=a.y+b*Math.sin(H),B=Math.abs(_-l)>180?1:0;return`M ${z} ${I} A ${b} ${b} 0 ${B} 1 ${O} ${G}`},y=8,C=[5,10,25,50,100,200],E=C[0];for(let l of C)if(r/l<=y){E=l;break}let x=[];for(let l=0;l<=r;l+=E){let _=l/r,b=d+_*c,w=M(b),H=n+5,z=n+12,I=n+20,O=a.x+H*Math.cos(w),G=a.y+H*Math.sin(w),B=a.x+z*Math.cos(w),V=a.y+z*Math.sin(w),tt=a.x+I*Math.cos(w),W=a.y+I*Math.sin(w);x.push({line:`M ${O} ${G} L ${B} ${V}`,label:{x:tt,y:W,value:l}})}let m=[];if(e===null&&i===null)m.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let l=e/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#ffeb3b"}),m.push({startAngle:_,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let l=i/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#4caf50"}),m.push({startAngle:_,endAngle:h,color:"#f44336"})}else{let l=e/r,_=i/r,b=d+l*c,w=d+_*c;m.push({startAngle:d,endAngle:b,color:"#ffeb3b"}),m.push({startAngle:b,endAngle:w,color:"#4caf50"}),m.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(N),A=n-5,T=a.x+A*Math.cos(q),v=a.y+A*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${o}"
        stroke-linecap="round"
      />
  `;m.forEach(l=>{k+=`
      <path
        d="${$(l.startAngle,l.endAngle,n)}"
        fill="none"
        stroke="${l.color}"
        stroke-width="${o}"
        stroke-linecap="round"
      />
    `}),x.forEach(l=>{k+=`
      <path
        d="${l.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),x.forEach(l=>{k+=`
      <text
        x="${l.label.x}"
        y="${l.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${l.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${a.x}"
        y1="${a.y}"
        x2="${T}"
        y2="${v}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${a.x}"
        cy="${a.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${a.x}"
        y="${a.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("protein","Protein")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Vt=U(()=>{var dt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var s;let i=(s=this.translations)==null?void 0:s[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,a)=>Object.prototype.hasOwnProperty.call(i,a)?String(i[a]):`{${a}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="fat-gauge-wrapper">
          <div class="fat-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="fat-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s,r,a;let t=this.querySelector(".fat-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyFatStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),o=(s=n==null?void 0:n.weight)!=null?s:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(a=n==null?void 0:n.macros)!=null?a:{},c=Math.round(h.f||h.fat||0),F=this._profile&&this._profile.attributes||{},N=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(v,f,k)=>Number.isFinite(v)?!f||!k||f===k?v:f==="kg"&&k==="lbs"?v*2.20462:f==="lbs"&&k==="kg"?v/2.20462:v:null,y=Number.isFinite(N)?N:null;!Number.isFinite(y)&&Number.isFinite(o)&&(y=$(Number(o),d||M,M));let C=Number.isFinite(y)?y:null,E=Number.isFinite(y)?M==="kg"?y*2.20462:y:null,x=v=>v==null?null:v<5&&C!==null?Math.round(v*C):v,m=x(this.min),q=x(this.max),A=E!=null?E:150,T=Math.ceil(A*.36/10)*10;(!Number.isFinite(T)||T<=0)&&(T=80),q!==null&&(T=q),this._gaugeMax=T,this._gaugeMin=m!==null?m:0,this._fatValue=c,this._fatWeight=E||0,this._fatMin=m,this._fatMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch fat data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyFatStyles(t){if(!t)return;let e=t.querySelector(".fat-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("fat-gauge-card")||customElements.define("fat-gauge-card",dt);window.customCards=window.customCards||[];window.customCards.push({type:"fat-gauge-card",name:"Calorie Tracker: Fat Gauge",description:"Displays a fat gauge for the Calorie Tracker integration",editor:"fat-gauge-editor",preview:!0});var At=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],s=t[2],r=t[3],a=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),o=()=>{let c=S({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,a&&a.value?c.profile_entity_id=a.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,s&&s.value?c.min=Number(s.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",o)),a&&a.addEventListener("value-changed",o)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("fat-gauge-editor")||customElements.define("fat-gauge-editor",At);dt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};dt.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};dt.prototype._renderGauge=function(){let p=this.querySelector(".fat-svg");if(!p)return;let t=Math.max(0,this._fatValue||0),e=this._fatMin,i=this._fatMax,s=this._gaugeMax||100,r=i!==null?i*1.1:s*1.1,a={x:70,y:70},n=40,o=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),N=d+F*c,M=l=>l*Math.PI/180,$=(l,_,b)=>{let w=M(l),H=M(_),z=a.x+b*Math.cos(w),I=a.y+b*Math.sin(w),O=a.x+b*Math.cos(H),G=a.y+b*Math.sin(H),B=Math.abs(_-l)>180?1:0;return`M ${z} ${I} A ${b} ${b} 0 ${B} 1 ${O} ${G}`},y=8,C=[5,10,25,50,100,200],E=C[0];for(let l of C)if(r/l<=y){E=l;break}let x=[];for(let l=0;l<=r;l+=E){let _=l/r,b=d+_*c,w=M(b),H=n+5,z=n+12,I=n+20,O=a.x+H*Math.cos(w),G=a.y+H*Math.sin(w),B=a.x+z*Math.cos(w),V=a.y+z*Math.sin(w),tt=a.x+I*Math.cos(w),W=a.y+I*Math.sin(w);x.push({line:`M ${O} ${G} L ${B} ${V}`,label:{x:tt,y:W,value:l}})}let m=[];if(e===null&&i===null)m.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let l=e/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#ffeb3b"}),m.push({startAngle:_,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let l=i/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#4caf50"}),m.push({startAngle:_,endAngle:h,color:"#f44336"})}else{let l=e/r,_=i/r,b=d+l*c,w=d+_*c;m.push({startAngle:d,endAngle:b,color:"#ffeb3b"}),m.push({startAngle:b,endAngle:w,color:"#4caf50"}),m.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(N),A=n-5,T=a.x+A*Math.cos(q),v=a.y+A*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${o}"
        stroke-linecap="round"
      />
  `;m.forEach(l=>{k+=`
      <path
        d="${$(l.startAngle,l.endAngle,n)}"
        fill="none"
        stroke="${l.color}"
        stroke-width="${o}"
        stroke-linecap="round"
      />
    `}),x.forEach(l=>{k+=`
      <path
        d="${l.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),x.forEach(l=>{k+=`
      <text
        x="${l.label.x}"
        y="${l.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${l.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${a.x}"
        y1="${a.y}"
        x2="${T}"
        y2="${v}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${a.x}"
        cy="${a.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${a.x}"
        y="${a.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("fat","Fat")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Xt=U(()=>{var ht=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var s;let i=(s=this.translations)==null?void 0:s[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,a)=>Object.prototype.hasOwnProperty.call(i,a)?String(i[a]):`{${a}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="carbs-gauge-wrapper">
          <div class="carbs-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="carbs-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s,r,a;let t=this.querySelector(".carbs-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyCarbsStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),o=(s=n==null?void 0:n.weight)!=null?s:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(a=n==null?void 0:n.macros)!=null?a:{},c=Math.round(h.c||h.carbs||0),F=this._profile&&this._profile.attributes||{},N=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(v,f,k)=>Number.isFinite(v)?!f||!k||f===k?v:f==="kg"&&k==="lbs"?v*2.20462:f==="lbs"&&k==="kg"?v/2.20462:v:null,y=Number.isFinite(N)?N:null;!Number.isFinite(y)&&Number.isFinite(o)&&(y=$(Number(o),d||M,M));let C=Number.isFinite(y)?y:null,E=Number.isFinite(y)?M==="kg"?y*2.20462:y:null,x=v=>v==null?null:v<5&&C!==null?Math.round(v*C):v,m=x(this.min),q=x(this.max),A=E!=null?E:150,T=Math.ceil(A*1.36/10)*10;(!Number.isFinite(T)||T<=0)&&(T=200),q!==null&&(T=q),this._gaugeMax=T,this._gaugeMin=m!==null?m:0,this._carbsValue=c,this._carbsWeight=E||0,this._carbsMin=m,this._carbsMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch carbs data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyCarbsStyles(t){if(!t)return;let e=t.querySelector(".carbs-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("carbs-gauge-card")||customElements.define("carbs-gauge-card",ht);window.customCards=window.customCards||[];window.customCards.push({type:"carbs-gauge-card",name:"Calorie Tracker: Carbs Gauge",description:"Displays a carbs gauge for the Calorie Tracker integration",editor:"carbs-gauge-editor",preview:!0});var Ft=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],s=t[2],r=t[3],a=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),o=()=>{let c=S({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,a&&a.value?c.profile_entity_id=a.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,s&&s.value?c.min=Number(s.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",o)),a&&a.addEventListener("value-changed",o)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("carbs-gauge-editor")||customElements.define("carbs-gauge-editor",Ft);ht.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};ht.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};ht.prototype._renderGauge=function(){let p=this.querySelector(".carbs-svg");if(!p)return;let t=Math.max(0,this._carbsValue||0),e=this._carbsMin,i=this._carbsMax,s=this._gaugeMax||100,r=i!==null?i*1.1:s*1.1,a={x:70,y:70},n=40,o=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),N=d+F*c,M=l=>l*Math.PI/180,$=(l,_,b)=>{let w=M(l),H=M(_),z=a.x+b*Math.cos(w),I=a.y+b*Math.sin(w),O=a.x+b*Math.cos(H),G=a.y+b*Math.sin(H),B=Math.abs(_-l)>180?1:0;return`M ${z} ${I} A ${b} ${b} 0 ${B} 1 ${O} ${G}`},y=8,C=[5,10,25,50,100,200],E=C[0];for(let l of C)if(r/l<=y){E=l;break}let x=[];for(let l=0;l<=r;l+=E){let _=l/r,b=d+_*c,w=M(b),H=n+5,z=n+12,I=n+20,O=a.x+H*Math.cos(w),G=a.y+H*Math.sin(w),B=a.x+z*Math.cos(w),V=a.y+z*Math.sin(w),tt=a.x+I*Math.cos(w),W=a.y+I*Math.sin(w);x.push({line:`M ${O} ${G} L ${B} ${V}`,label:{x:tt,y:W,value:l}})}let m=[];if(e===null&&i===null)m.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let l=e/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#ffeb3b"}),m.push({startAngle:_,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let l=i/r,_=d+l*c;m.push({startAngle:d,endAngle:_,color:"#4caf50"}),m.push({startAngle:_,endAngle:h,color:"#f44336"})}else{let l=e/r,_=i/r,b=d+l*c,w=d+_*c;m.push({startAngle:d,endAngle:b,color:"#ffeb3b"}),m.push({startAngle:b,endAngle:w,color:"#4caf50"}),m.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(N),A=n-5,T=a.x+A*Math.cos(q),v=a.y+A*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${o}"
        stroke-linecap="round"
      />
  `;m.forEach(l=>{k+=`
      <path
        d="${$(l.startAngle,l.endAngle,n)}"
        fill="none"
        stroke="${l.color}"
        stroke-width="${o}"
        stroke-linecap="round"
      />
    `}),x.forEach(l=>{k+=`
      <path
        d="${l.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),x.forEach(l=>{k+=`
      <text
        x="${l.label.x}"
        y="${l.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${l.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${a.x}"
        y1="${a.y}"
        x2="${T}"
        y2="${v}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${a.x}"
        cy="${a.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${a.x}"
        y="${a.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("carbs","Carbs")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Kt=U(()=>{var ut=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var s;let i=(s=this.translations)==null?void 0:s[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,a)=>Object.prototype.hasOwnProperty.call(i,a)?String(i[a]):`{${a}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._applyStaticText(),this._renderPieChart()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}_applyStaticText(){let t=this.querySelector(".protein-text"),e=this.querySelector(".carbs-text"),i=this.querySelector(".fat-text"),s=this.querySelector(".alcohol-text"),r=this.querySelector(".chart-label");if(t&&(t.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("protein","Protein")})),e&&(e.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("carbs","Carbs")})),i&&(i.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("fat","Fat")})),s&&(s.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("alcohol","Alcohol")})),r&&(r.textContent=this._t("percent_of_total_calories","Percent of Total Calories")),!this.title||!this.title.trim()){let a=this.querySelector(".card-header");a&&(a.textContent=this._t("percent_of_total_calories","Percent of Total Calories"))}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px";let e=this.title&&this.title.trim()?this.title:this._t("percent_of_total_calories","Percent of Total Calories");this.innerHTML=`
      <ha-card>
        <div class="card-header">${e}</div>
        <div class="macro-percentages-wrapper">
          <div class="macro-percentages" style="display:flex;align-items:center;justify-content:center;padding:20px;flex-direction:column;">
            <div style="display:flex;align-items:center;justify-content:center;">
              <svg class="pie-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style="width:150px;height:150px;flex-shrink:0;"></svg>
              <div class="legend" style="margin-left:20px;font-family:var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif);">
                <div class="legend-item" style="display:flex;align-items:center;margin-bottom:8px;">
                  <div class="legend-color protein-color" style="width:16px;height:16px;margin-right:8px;border-radius:2px;background-color:#4CAF50;"></div>
                  <span class="protein-text">${this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("protein","Protein")})}</span>
                </div>
                <div class="legend-item" style="display:flex;align-items:center;margin-bottom:8px;">
                  <div class="legend-color carbs-color" style="width:16px;height:16px;margin-right:8px;border-radius:2px;background-color:#2196F3;"></div>
                  <span class="carbs-text">${this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("carbs","Carbs")})}</span>
                </div>
                <div class="legend-item" style="display:flex;align-items:center;margin-bottom:8px;">
                  <div class="legend-color fat-color" style="width:16px;height:16px;margin-right:8px;border-radius:2px;background-color:#FF9800;"></div>
                  <span class="fat-text">${this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("fat","Fat")})}</span>
                </div>
                <div class="legend-item" style="display:flex;align-items:center;margin-bottom:8px;">
                  <div class="legend-color alcohol-color" style="width:16px;height:16px;margin-right:8px;border-radius:2px;background-color:#9C27B0;"></div>
                  <span class="alcohol-text">${this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("alcohol","Alcohol")})}</span>
                </div>
              </div>
            </div>
            <div class="chart-label" style="margin-top:15px;font-family:var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif);font-size:14px;color:var(--secondary-text-color, #666);text-align:center;">
              ${this._t("percent_of_total_calories","Percent of Total Calories")}
            </div>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${s}`}async _updateCard(){var s;let t=this.querySelector(".macro-percentages");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(r=>r.startsWith("sensor.calorie_tracker_")&&this.hass.states[r])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyMacroStyles(t);try{let r=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),a=(s=r==null?void 0:r.macros)!=null?s:{},n=Math.round(a.p||a.protein||0),o=Math.round(a.c||a.carbs||0),d=Math.round(a.f||a.fat||0),h=Math.round(a.a||a.alcohol||0),c=n*4,F=o*4,N=d*9,M=h*7,$=c+F+N+M;this._proteinGrams=n,this._carbsGrams=o,this._fatGrams=d,this._alcoholGrams=h,this._proteinCals=c,this._carbsCals=F,this._fatCals=N,this._alcoholCals=M,this._totalCals=$,this._renderPieChart()}catch(r){console.error("Failed to fetch macro data:",r)}this._eventsAttached||(t.addEventListener("select-summary-date",r=>{this.selectedDate=r.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyMacroStyles(t){if(!t)return;let e=t.querySelector(".pie-svg");e&&(e.style.width="150px",e.style.height="150px")}};customElements.get("macro-percentages-card")||customElements.define("macro-percentages-card",ut);window.customCards=window.customCards||[];window.customCards.push({type:"macro-percentages-card",name:"Calorie Tracker Macro Pie Chart",description:"Shows macro percentage breakdown (protein/carbs/fat) for Calorie Tracker",editor:"macro-percentages-editor",preview:!0});var Pt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"Percent of Total Calories")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (optional)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelectorAll("paper-input")[1],s=this.querySelector(".error"),r=()=>{let a=S({},this._config);t&&t.value?a.title=t.value.trim():delete a.title,e&&e.value?a.profile_entity_id=e.value:delete a.profile_entity_id,i&&i.value?a.max_height=i.value.trim():delete a.max_height,a.profile_entity_id?s&&(s.style.display="none"):s&&(s.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a}}))};t&&t.addEventListener("value-changed",r),e&&e.addEventListener("value-changed",r),i&&i.addEventListener("value-changed",r)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("macro-percentages-editor")||customElements.define("macro-percentages-editor",Pt);ut.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}}]}};ut.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};ut.prototype._renderPieChart=function(){let p=this.querySelector(".pie-svg");if(!p)return;let t=this._proteinCals||0,e=this._carbsCals||0,i=this._fatCals||0,s=this._alcoholCals||0,r=this._totalCals||1,a=this._proteinGrams||0,n=this._carbsGrams||0,o=this._fatGrams||0,d=this._alcoholGrams||0,h=r>0?Math.round(t/r*100):0,c=r>0?Math.round(e/r*100):0,F=r>0?Math.round(i/r*100):0,N=r>0?Math.round(s/r*100):0,M=this.querySelector(".protein-text"),$=this.querySelector(".carbs-text"),y=this.querySelector(".fat-text"),C=this.querySelector(".alcohol-text");M&&(M.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("protein","Protein"),grams:a,percent:h})),$&&($.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("carbs","Carbs"),grams:n,percent:c})),y&&(y.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("fat","Fat"),grams:o,percent:F})),C&&(C.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("alcohol","Alcohol"),grams:d,percent:N}));let E=100,x=100,m=70,q={protein:"#4CAF50",carbs:"#2196F3",fat:"#FF9800",alcohol:"#9C27B0"},A=-90,T=[];if(r>0){if(t>0){let l=t/r*360;T.push({startAngle:A,endAngle:A+l,color:q.protein,label:"Protein"}),A+=l}if(e>0){let l=e/r*360;T.push({startAngle:A,endAngle:A+l,color:q.carbs,label:"Carbs"}),A+=l}if(i>0){let l=i/r*360;T.push({startAngle:A,endAngle:A+l,color:q.fat,label:"Fat"}),A+=l}if(s>0){let l=s/r*360;T.push({startAngle:A,endAngle:A+l,color:q.alcohol,label:"Alcohol"})}}let v=l=>l*Math.PI/180,f=(l,_)=>{let b=v(l),w=v(_),H=E+m*Math.cos(b),z=x+m*Math.sin(b),I=E+m*Math.cos(w),O=x+m*Math.sin(w),G=Math.abs(_-l)>180?1:0;return`M ${E} ${x} L ${H} ${z} A ${m} ${m} 0 ${G} 1 ${I} ${O} Z`},k='<svg viewBox="0 0 200 200" style="width: 100%; height: 100%;">';r===0||T.length===0?k+=`
      <circle cx="${E}" cy="${x}" r="${m}"
              fill="none" stroke="#eee" stroke-width="2"/>
      <text x="${E}" y="${x}" text-anchor="middle"
            font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
            font-size="14" fill="var(--secondary-text-color, #666)">${this._t("no_data","No Data")}</text>
    `:T.forEach(l=>{k+=`
        <path d="${f(l.startAngle,l.endAngle)}"
              fill="${l.color}"
              stroke="#fff"
              stroke-width="1"/>
      `}),k+="</svg>",p.innerHTML=k}});var Ut=U(()=>{var xt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._range="1m",this._weightData=[],this._lastGoalStartDate=null,this._resizeObserver=null,this.ranges=["2w","1m","2m","4m","6m","1y","goal","all"],this.translations={},this._translationsRequestedLang=null}_t(t,e){var s;let i=(s=this.translations)==null?void 0:s[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,a)=>Object.prototype.hasOwnProperty.call(i,a)?String(i[a]):`{${a}}`)}_getLocale(){var t,e,i;return((e=(t=this._hass)==null?void 0:t.locale)==null?void 0:e.language)||((i=this._hass)==null?void 0:i.language)||void 0}_getRangeLabel(t){return{"2w":this._t("range_last_2_weeks","Last 2 weeks"),"1m":this._t("range_last_month","Last month"),"2m":this._t("range_last_2_months","Last 2 months"),"4m":this._t("range_last_4_months","Last 4 months"),"6m":this._t("range_last_6_months","Last 6 months"),"1y":this._t("range_last_year","Last year"),goal:this._t("range_since_last_goal","Since last goal"),all:this._t("range_all","All")}[t]||t}_getRangeOptions(){return this.ranges.map(t=>({value:t,label:this._getRangeLabel(t)}))}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._refreshRangeSelectOptions(),this._renderChart()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}_refreshRangeSelectOptions(){let t=this.querySelector(".weight-range-select");if(!t)return;let e=t.value||this._range;t.innerHTML=this._getRangeOptions().map(i=>`<option value='${i.value}'>${i.label}</option>`).join(""),t.value=e}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="weight-progress-wrapper" style="padding:16px;">
          <div class="weight-controls" style="display:flex;align-items:center;gap:12px;margin-bottom:8px;flex-wrap:wrap;">
            <select class="weight-range-select" style="padding:4px 8px;">
              ${this._getRangeOptions().map(e=>`<option value='${e.value}'>${e.label}</option>`).join("")}
            </select>
            <div class="legend-items" style="display:flex;gap:12px;flex-wrap:wrap;"></div>
          </div>
          <div class="weight-prediction" style="margin-bottom:8px;padding:10px;background:var(--secondary-background-color, rgba(0, 0, 0, 0.05));color:var(--primary-text-color);border-radius:6px;border:1px solid var(--divider-color, rgba(0, 0, 0, 0.12));font-size:13px;line-height:1.4;display:none;">
          </div>
          <div class="weight-chart" style="width:100%;min-height:280px;position:relative;">
            <div class="weight-tooltip" style="position:absolute;display:none;background:rgba(0,0,0,0.8);color:white;padding:8px 12px;border-radius:4px;font-size:12px;pointer-events:none;z-index:1000;white-space:nowrap;"></div>
          </div>
        </div>
      </ha-card>
    `,this._syncLastGoalRangeAvailability()}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}async _updateCard(){let t=this.querySelector(".weight-chart");if(!t||!this._hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this._hass.states).find(i=>i.startsWith("sensor.calorie_tracker_")&&this._hass.states[i])),!e){t.innerHTML=`<div>${this._t("no_profile_entity_found","No calorie tracker profile entity found")}</div>`;return}try{let i=this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_weight_history",entity_id:e}),s=this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_goals",entity_id:e}).catch(()=>null),[r,a]=await Promise.all([i,s]);this._weightData=r.weight_history||[],this._lastGoalStartDate=this._extractLastGoalStartDate(a&&Array.isArray(a.goals)?a.goals:null),this._syncLastGoalRangeAvailability(),this._renderChart()}catch(i){this._lastGoalStartDate=null,this._syncLastGoalRangeAvailability(),t.innerHTML=`<div>${this._t("failed_fetch_weight_data","Failed to fetch weight data")}</div>`}if(!this._eventsAttached){let i=this.querySelector(".weight-range-select");i&&(i.value=this._range,i.addEventListener("change",r=>{if(this._range=r.target.value,this._range==="goal"&&!this._lastGoalStartDate){this._range="1m",i.value=this._range;return}this._renderChart()}));let s=this.querySelector(".weight-chart");s&&window.ResizeObserver&&(this._resizeObserver=new ResizeObserver(()=>{this._renderChart()}),this._resizeObserver.observe(s)),this._eventsAttached=!0}}disconnectedCallback(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null)}_filterDataByRange(t,e){if(!t||!Array.isArray(t)||t.length===0)return[];if(e==="all")return t;if(e==="goal"){if(!this._lastGoalStartDate)return[];let r=this._lastGoalStartDate;return t.filter(a=>!a||typeof a.date!="string"?!1:a.date.slice(0,10)>=r)}let i=new Date,s;switch(e){case"2w":s=new Date(i),s.setDate(i.getDate()-13);break;case"1m":s=new Date(i),s.setMonth(i.getMonth()-1);break;case"2m":s=new Date(i),s.setMonth(i.getMonth()-2);break;case"4m":s=new Date(i),s.setMonth(i.getMonth()-4);break;case"6m":s=new Date(i),s.setMonth(i.getMonth()-6);break;case"1y":s=new Date(i),s.setFullYear(i.getFullYear()-1);break;default:return t}return t.filter(r=>new Date(r.date)>=s)}_renderChart(){let t=this.querySelector(".weight-chart"),e=this.querySelector(".legend-items");t&&requestAnimationFrame(()=>{this._doRenderChart(t,e)})}_doRenderChart(t,e){if(!t)return;let i=this._filterDataByRange(this._weightData,this._range);if(!i.length||i.length<2){let g=this._t("no_weight_data_for_range","No weight data available for this range.");this._range==="goal"&&(g=this._lastGoalStartDate?this._t("need_more_weight_entries_since_goal","Need more weight entries since your last goal to display progress."):this._t("set_goal_to_track_progress","Set a goal to track progress from your most recent goal start date.")),t.innerHTML=`<div>${g}</div>`,e&&(e.innerHTML="");return}let s=this.profileEntityId||this._hass&&Object.keys(this._hass.states).find(g=>g.startsWith("sensor.calorie_tracker_")),r=null,a=null,n="kg";if(s&&this._hass&&this._hass.states[s]){let g=this._hass.states[s].attributes||{},D=L=>{if(L==null)return null;let R=Number(L);return Number.isFinite(R)?R:null};r=D(g.starting_weight),a=D(g.goal_weight),n=g.weight_unit||"kg"}let o=400,d=260,h=40,c=i.map(g=>new Date(g.date)),F=i.map(g=>g.weight),N=Math.min(...F),M=Math.max(...F),$=c[0],y=c[c.length-1],C=1440*60*1e3,E=Math.max((y-$)/C,1),x=(()=>{if(c.length<2)return null;let g=c.map(X=>(X.getTime()-$.getTime())/C),D=F,L=g.length,R=0,j=0,K=0,et=0;for(let X=0;X<L;X++){let st=g[X],mt=D[X];R+=st,j+=mt,K+=st*mt,et+=st*st}let pt=L*et-R*R;if(Math.abs(pt)<1e-9)return null;let it=(L*K-R*j)/pt,at=(j-it*R)/L,St=j/L,rt=0,lt=0;for(let X=0;X<L;X++){let st=at+it*g[X],mt=D[X];rt+=(mt-St)**2,lt+=(mt-st)**2}let $t=rt>0?1-lt/rt:1;return{slope:it,intercept:at,weightAt:X=>{let st=(X.getTime()-$.getTime())/C;return at+it*st},rSquared:$t}})(),m=0,q=y,A=null,T=!1;if(x){let g=x.slope,D=E,L=x.weightAt(y),R=D;if(a!==null&&Math.abs(g)>1e-6){let j=(a-L)/g;j>=0&&(T=!0,A=j,R=Math.min(R,j))}Math.abs(g)>1e-6&&(m=Math.max(0,R),m>0&&(q=new Date(y.getTime()+m*C)))}let v=m>0?q:y,f=$.getTime(),k=v.getTime(),l=g=>h+(g.getTime()-f)/Math.max(k-f,1)*(o-2*h),_=N,b=M;if(a!==null&&(_=Math.min(_,a),b=Math.max(b,a)),x&&m>0){let g=x.weightAt(q);_=Math.min(_,g),b=Math.max(b,g)}let w=b-_||1,H=.15,z=_-w*H,I=b+w*H,O=r!==null&&r>=z&&r<=I,G=a!==null&&a>=z&&a<=I;if(e){let g="";if(r!==null){let D=O?"":r>I?" \u2191":" \u2193";g+=`<div style="display:flex;align-items:center;"><div style="width:12px;height:2px;background:#ff9800;margin-right:4px;border-style:dashed;border-width:1px 0;border-color:#ff9800;"></div><span style="font-size:12px;">${this._t("start","Start")}: ${r}${D}</span></div>`}if(a!==null){let D=G?"":a>I?" \u2191":" \u2193";g+=`<div style="display:flex;align-items:center;"><div style="width:12px;height:2px;background:#8bc34a;margin-right:4px;border-style:dashed;border-width:1px 0;border-color:#8bc34a;"></div><span style="font-size:12px;">${this._t("goal","Goal")}: ${a}${D}</span></div>`}e.innerHTML=g}let B=this.querySelector(".weight-prediction");if(B)if(!x)B.style.display="none";else{let g=x.slope*7,D=g>=0?`+${g.toFixed(2)}`:g.toFixed(2),L=x.rSquared>.8?"high":x.rSquared>.5?"medium":"low",R=L==="high"?this._t("confidence_high","high"):L==="medium"?this._t("confidence_medium","medium"):this._t("confidence_low","low"),j=L==="high"?"var(--success-color, #4caf50)":L==="medium"?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)",K=`<strong>${this._t("trend","Trend")}:</strong> ${D} ${n}/${this._t("week","week")} <span style="color:${j};font-weight:bold;">(${R} ${this._t("confidence","confidence")})</span>`;if(a===null)K+=`<br/><em>${this._t("set_goal_weight_to_predict","Set a goal weight to see a predicted goal date.")}</em>`;else if(Math.abs(x.slope)<1e-6)K+=`<br/><em>${this._t("trend_flat_unable_project","Trend is flat, unable to project goal date.")}</em>`;else if(!T)K+=`<br/><em>${this._t("trend_moving_away_goal","Trend is moving away from the goal weight.")}</em>`;else if(A!==null&&Number.isFinite(A)){let et=new Date(y.getTime()+A*C),it=Math.round((et-new Date)/C),at=et.toLocaleDateString(this._getLocale(),{month:"short",day:"numeric",year:"numeric"});K+=`<br/><strong>${this._t("goal_projection","Goal projection")}:</strong> ${at} (${this._tf("days_remaining","{days} days",{days:it})})`}else K+=`<br/><em>${this._t("unable_calculate_goal_projection","Unable to calculate goal projection.")}</em>`;B.innerHTML=K,B.style.display="block"}let V=g=>d-h-(g-z)/(I-z)*(d-2*h),tt=i.map(g=>[l(new Date(g.date)),V(g.weight)]),W=`<svg viewBox='0 0 ${o} ${d}' preserveAspectRatio='xMidYMid meet' style='width:100%;height:auto;'>`,zt=g=>{let D=g.getDate().toString().padStart(2,"0"),L=new Intl.DateTimeFormat(this._getLocale(),{month:"short"}).format(g);return`${D} ${L}`};for(let g=0;g<5;g++){let D=g/4,L=f+D*(k-f),R=new Date(L),j=l(R);W+=`<line x1='${j}' y1='${h}' x2='${j}' y2='${d-h}' stroke='#d0d0d0' stroke-width='0.5' stroke-dasharray='3,3' />`,W+=`<text x='${j}' y='${d-h+18}' font-size='11' fill='#888' text-anchor='middle'>${zt(R)}</text>`}for(let g=0;g<5;g++){let D=g/4,L=z+D*(I-z),R=V(L);W+=`<line x1='${h}' y1='${R}' x2='${o-h}' y2='${R}' stroke='#d0d0d0' stroke-width='0.5' stroke-dasharray='3,3' />`,W+=`<text x='${h-12}' y='${R+4}' font-size='11' fill='#888' text-anchor='end'>${L.toFixed(1)}</text>`}if(W+=`<polyline fill='none' stroke='#03a9f4' stroke-width='2' points='${tt.map(g=>g.join(",")).join(" ")}' />`,x){let g=$,D=y,L=l(g),R=V(x.weightAt(g)),j=l(D),K=V(x.weightAt(D));if(W+=`<line x1='${L}' y1='${R}' x2='${j}' y2='${K}' stroke='#9c27b0' stroke-width='2' opacity='0.9' />`,m>0){let et=y,pt=x.weightAt(et),it=x.weightAt(q),at=l(et),St=V(pt),rt=l(q),lt=V(it);W+=`<line x1='${at}' y1='${St}' x2='${rt}' y2='${lt}' stroke='#9c27b0' stroke-width='1.75' stroke-dasharray='8,6' opacity='0.6' />`,W+=`<circle cx='${rt}' cy='${lt}' r='3.5' fill='#9c27b0' opacity='0.6' />`;let $t=q,Ht=`${$t.getDate()} ${new Intl.DateTimeFormat(this._getLocale(),{month:"short"}).format($t)}`;W+=`<text x='${rt}' y='${lt-12}' font-size='10' fill='#9c27b0' text-anchor='middle' opacity='0.7'>${Ht}</text>`}}if(tt.forEach((g,D)=>{W+=`<circle class='weight-point' data-index='${D}' cx='${g[0]}' cy='${g[1]}' r='4' fill='#03a9f4' stroke='#fff' stroke-width='1.5' style='cursor:pointer;' />`}),O){let g=V(r);W+=`<line x1='${h}' y1='${g}' x2='${o-h}' y2='${g}' stroke='#ff9800' stroke-dasharray='4,2' stroke-width='1.5' />`}if(G){let g=V(a);W+=`<line x1='${h}' y1='${g}' x2='${o-h}' y2='${g}' stroke='#8bc34a' stroke-dasharray='4,2' stroke-width='1.5' />`}if(r!==null&&!O){let g=r>I,D=g?h+5:d-h-5,L=g?"\u2191":"\u2193";W+=`<text x='${o-h-40}' y='${D}' font-size='12' fill='#ff9800' text-anchor='start'>${this._t("start","Start")} ${L}</text>`}if(a!==null&&!G){let g=a>I,D=g?h+5:d-h-5,L=g?"\u2191":"\u2193",R=r!==null&&!O&&a>I==r>I?80:40;W+=`<text x='${o-h-R}' y='${D}' font-size='12' fill='#8bc34a' text-anchor='start'>${this._t("goal","Goal")} ${L}</text>`}W+="</svg>",t.innerHTML=`<div style="position:relative;width:100%;">${W}<div class="weight-tooltip" style="position:absolute;display:none;background:rgba(0,0,0,0.8);color:white;padding:8px 12px;border-radius:4px;font-size:12px;pointer-events:none;z-index:1000;white-space:nowrap;"></div></div>`;let gt=t.querySelector(".weight-tooltip");t.querySelectorAll(".weight-point").forEach(g=>{g.addEventListener("mouseenter",D=>{let L=parseInt(D.target.getAttribute("data-index")),R=i[L],j=new Date(R.date);gt.innerHTML=`<div><strong>${zt(j)}</strong></div><div>${R.weight} ${n}</div>`,gt.style.display="block"}),g.addEventListener("mousemove",D=>{let L=t.getBoundingClientRect();gt.style.left=D.clientX-L.left+10+"px",gt.style.top=D.clientY-L.top-10+"px"}),g.addEventListener("mouseleave",()=>{gt.style.display="none"})})}_extractLastGoalStartDate(t){if(!Array.isArray(t)||t.length===0)return null;let e=t.map(i=>{if(!i||typeof i.start_date!="string")return null;let s=i.start_date.trim();return s?s.slice(0,10):null}).filter(Boolean);return e.length?e.reduce((i,s)=>i&&i>s?i:s,null):null}_syncLastGoalRangeAvailability(){let t=this.querySelector(".weight-range-select");if(!t)return;let e=[...t.options].find(s=>s.value==="goal");if(!e)return;let i=!!this._lastGoalStartDate;if(e.disabled=!i,e.hidden=!i,i){let s=new Date(this._lastGoalStartDate);if(Number.isNaN(s.getTime()))e.textContent=this._t("range_since_last_goal","Since last goal");else{let r=s.toLocaleDateString(this._getLocale(),{month:"short",day:"numeric",year:"numeric"});e.textContent=this._tf("range_since_last_goal_with_date","Since last goal ({date})",{date:r})}}else e.textContent=this._t("range_since_last_goal","Since last goal"),this._range==="goal"&&(this._range="1m",t.value=this._range)}};customElements.get("weight-progress-card")||customElements.define("weight-progress-card",xt);window.customCards=window.customCards||[];window.customCards.push({type:"weight-progress-card",name:"Calorie Tracker: Weight Progress",description:"Displays weight history and progress for Calorie Tracker",editor:"weight-progress-editor",preview:!0});var Rt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={});let t=[["2w","Last 2 weeks"],["1m","Last month"],["2m","Last 2 months"],["4m","Last 4 months"],["6m","Last 6 months"],["1y","Last year"],["goal","Since last goal"],["all","All"]],e=this._config.default_range||"1m";this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <label style="font-size:12px;color:var(--secondary-text-color);">Default range</label>
        <select>${t.map(o=>`<option value="${o[0]}" ${o[0]===e?"selected":""}>${o[1]}</option>`).join("")}</select>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let i=this.querySelector("paper-input"),s=this.querySelector("ha-entity-picker"),r=this.querySelector("select"),a=this.querySelector(".error"),n=()=>{let o=S({},this._config);i&&i.value?o.title=i.value.trim():delete o.title,s&&s.value?o.profile_entity_id=s.value:delete o.profile_entity_id,r&&r.value?o.default_range=r.value:delete o.default_range,o.profile_entity_id?a&&(a.style.display="none"):a&&(a.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o}}))};i&&i.addEventListener("value-changed",n),s&&s.addEventListener("value-changed",n),r&&r.addEventListener("change",n)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("weight-progress-editor")||customElements.define("weight-progress-editor",Rt);xt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"default_range",selector:{select:{options:[{value:"2w",label:"Last 2 weeks"},{value:"1m",label:"Last month"},{value:"2m",label:"Last 2 months"},{value:"4m",label:"Last 4 months"},{value:"6m",label:"Last 6 months"},{value:"1y",label:"Last year"},{value:"goal",label:"Since last goal"},{value:"all",label:"All"}]}}}]}};xt.getStubConfig=function(){return{profile_entity_id:"",default_range:"1m"}}});var se=U(()=>{ae();var ot=[{key:"p",label:"Protein",short:"P"},{key:"c",label:"Carbs",short:"C"},{key:"f",label:"Fat",short:"F"}],Zt=/\s*\(([^()]*\d[^()]*)\)\s*$/,ee=kt`
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
`;function Y(p){if(p==null||p==="")return null;let t=Number(p);return Number.isFinite(t)?t:null}function bt(p){return Math.round(p*10)/10}function Jt(p=new Date){let t=e=>String(e).padStart(2,"0");return`${p.getFullYear()}-${t(p.getMonth()+1)}-${t(p.getDate())}`}var Mt={ml:1,l:1e3,tsp:4.92892,tbsp:14.7868,floz:29.5735,cup:236.588},Qt=[["cup","cup"],["tbsp","tbsp"],["tsp","tsp"],["floz","fl oz"],["ml","ml"]],re=[["g","g",1],["oz","oz",28.3495],["lb","lb",453.592],["kg","kg",1e3]];function nt(p){let t=String(p!=null?p:"").trim().replace(",",".");if(!t)return null;let e=t.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(e)return Number(e[3])?Number(e[1])+Number(e[2])/Number(e[3]):null;if(e=t.match(/^(\d+)\/(\d+)$/),e)return Number(e[2])?Number(e[1])/Number(e[2]):null;let i=Number(t);return Number.isFinite(i)&&i>0?i:null}function Q(p){return String(Math.round(p*100)/100)}function wt(p){let t=[],e=(p==null?void 0:p.portions)||[];if(p!=null&&p.portions_only)return e.map((r,a)=>({id:`p${a}`,label:r.unit_label,group:"food",g:r.per_unit_g,quality:"exact"}));let i=e.find(r=>r.volume_unit==="cup")||e.find(r=>r.volume_unit),s=i?i.per_unit_g/Mt[i.volume_unit]:null;e.forEach((r,a)=>{if(Qt.some(([d,h])=>r.volume_unit===d&&r.unit_label.toLowerCase()===h))return;let o=r.unit_label;o=o.replace(/^([a-z]{3,}[^s])s\b/i,"$1"),t.push({id:`p${a}`,label:o,group:"food",g:r.per_unit_g,quality:"exact"})});for(let[r,a]of Qt){if(!p){t.push({id:r,label:a,group:"volume",g:null,quality:"unknown"});continue}let n=i&&i.volume_unit===r&&i.unit_label.toLowerCase()===a;t.push({id:r,label:a,group:"volume",g:Mt[r]*(s!=null?s:1),quality:n?"exact":s?"derived":"rough",basis:i})}for(let[r,a,n]of re)t.push({id:r,label:a,group:"mass",g:n,quality:"exact"});return t}var It=class extends Ct{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_stats:{state:!0},_error:{state:!0},_entityId:{state:!0}}}constructor(){super(),this._stats=null,this._error=null,this._entityId=null,this._lastStamp=null,this._fetching=!1,this._refetch=!1,this._resolvingDefault=!1,this._onLogged=()=>this._fetch()}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=S({title:"Health & Fitness",show_exercise:!0,search_usda:!0,list_height:360},t),t.profile_entity_id&&(this._entityId=t.profile_entity_id)}static getStubConfig(){return{title:"Health & Fitness"}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",selector:{entity:{filter:{integration:"calorie_tracker",domain:"sensor"}}}},{name:"usda_api_key",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"search_usda",selector:{boolean:{}}},{name:"show_exercise",selector:{boolean:{}}}]},{name:"list_height",selector:{number:{min:150,max:1e3,step:10,unit_of_measurement:"px"}}}],computeLabel:t=>({title:"Title",profile_entity_id:"Calorie Tracker profile (defaults to your own)",usda_api_key:"USDA FoodData Central API key (optional)",search_usda:"Search USDA too (off = only your own foods and meals)",show_exercise:"Show exercise in activity list",list_height:"Activity list height on narrow screens"})[t.name]}}getCardSize(){return 7}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._debounce)}updated(t){t.has("hass")&&this.hass&&this._maybeFetch()}async _resolveEntity(){var t,e,i,s;if(this._entityId)return this._entityId;if(this._resolvingDefault)return null;this._resolvingDefault=!0;try{let r=await this.hass.callWS({type:"calorie_tracker/get_user_profile",user_id:(t=this.hass.user)==null?void 0:t.id});this._entityId=((e=r==null?void 0:r.default_profile)==null?void 0:e.entity_id)||((s=(i=r==null?void 0:r.all_profiles)==null?void 0:i[0])==null?void 0:s.entity_id)||null,this._entityId||(this._error="No Calorie Tracker profile found.")}catch(r){this._error=`Couldn't find a Calorie Tracker profile: ${r.message||r}`}finally{this._resolvingDefault=!1}return this._entityId}async _maybeFetch(){let t=await this._resolveEntity();if(!t)return;let e=this.hass.states[t],i=`${e==null?void 0:e.last_updated}|${Jt()}`;i!==this._lastStamp&&(this._lastStamp=i,clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._fetch(),150))}async _fetch(){if(!(!this.hass||!this._entityId)){if(this._fetching){this._refetch=!0;return}this._fetching=!0;try{this._stats=await this.hass.callWS({type:"calorie_tracker/get_dashboard_stats",entity_id:this._entityId,date:Jt()}),this._error=null}catch(t){this._error=(t==null?void 0:t.code)==="unknown_command"?"This card needs the updated Calorie Tracker integration. Restart Home Assistant after updating.":`Couldn't load data: ${t.message||t}`}finally{this._fetching=!1,this._refetch&&(this._refetch=!1,this._fetch())}}}_openLog(){let t=document.createElement("hf-log-dialog");t.hass=this.hass,t.entityId=this._entityId,t.usdaApiKey=this._config.usda_api_key||"",t.searchUsda=this._config.search_usda!==!1,t.addEventListener("hf-logged",this._onLogged),document.body.appendChild(t)}get _lang(){var t,e,i;return((e=(t=this.hass)==null?void 0:t.locale)==null?void 0:e.language)||((i=this.hass)==null?void 0:i.language)||void 0}_fmt(t,e=0){return t==null?"\u2014":new Intl.NumberFormat(this._lang,{maximumFractionDigits:e}).format(t)}_time(t){let e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleTimeString(this._lang,{hour:"numeric",minute:"2-digit"})}_shortDate(t){let[e,i,s]=(t||"").split("-").map(Number);if(!e)return"";let r=new Date(e,i-1,s),a=new Date,n=new Date;return n.setDate(a.getDate()-1),r.toDateString()===a.toDateString()?"today":r.toDateString()===n.toDateString()?"yesterday":r.toLocaleDateString(this._lang,{month:"short",day:"numeric"})}render(){return this._config?u`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title}</div>
          <button class="btn" @click=${this._openLog} ?disabled=${!this._entityId}>
            <ha-icon icon="mdi:plus"></ha-icon>Log
          </button>
        </div>
        ${this._error?u`<div class="error">${this._error}</div>`:this._stats?u`
                <div class="layout">
                  <div class="left">
                    ${this._renderRing()} ${this._renderMacroTable()} ${this._renderActivityTile()}
                    ${this._renderWeight()}
                  </div>
                  <div class="right" style="--hf-list-height:${Number(this._config.list_height)||360}px">
                    ${this._renderActivity()}
                  </div>
                </div>
              `:u`<div class="loading">Loading…</div>`}
      </ha-card>
    `:P}_renderRing(){var c;let{consumed:t,budget:e,remaining:i,exercise:s}=this._stats.calories,r=e!==null&&e>0,a=r?t/e:0,n=r&&i<0,o=52,d=2*Math.PI*o,h=Math.min(a,1)*d;return u`
      <div class="ring-block">
        <svg class="ring" viewBox="0 0 128 128" role="img"
          aria-label=${r?`${Math.round(a*100)}% of daily calories`:"Calories today"}>
          ${Wt`
            <circle cx="64" cy="64" r=${o} class="ring-track"></circle>
            <circle cx="64" cy="64" r=${o} class="ring-value ${n?"over":""}"
              stroke-dasharray="${h} ${d}" transform="rotate(-90 64 64)"></circle>
          `}
        </svg>
        <div class="ring-text">
          <div class="ring-big">${this._fmt(t)}</div>
          <div class="ring-small">${r?u`of ${this._fmt(e)} kcal`:"kcal eaten"}</div>
        </div>
        <div class="ring-side">
          ${r?u`
                <div class="stat ${n?"over":"good"}">
                  <span class="stat-num">${this._fmt(Math.abs(i))}</span>
                  <span class="stat-label">${n?"kcal over":"kcal left"}</span>
                </div>
                <div class="stat">
                  <span class="stat-num">${Math.round(a*100)}%</span>
                  <span class="stat-label">of daily goal</span>
                </div>
              `:u`<div class="stat"><span class="stat-label">No calorie goal set</span></div>`}
          ${(c=this._stats.health)!=null&&c.steps_linked?u`<div class="stat">
                <span class="stat-num">${this._fmt(this._stats.health.steps)}</span>
                <span class="stat-label">steps</span>
              </div>`:P}
          ${s>0?u`<div class="stat">
                <span class="stat-num">${this._fmt(s)}</span>
                <span class="stat-label">kcal exercise</span>
              </div>`:P}
        </div>
      </div>
    `}_renderMacroTable(){let{today:t,avg_7:e,avg_30:i}=this._stats.macros,s=(a,n,o)=>u`
      <tr title=${o||""}>
        <th scope="row">${a}</th>
        ${ot.map(d=>u`<td>${(n==null?void 0:n[d.key])===null||(n==null?void 0:n[d.key])===void 0?"\u2014":`${this._fmt(n[d.key])}g`}</td>`)}
        <td class="kcal">${this._fmt(n==null?void 0:n.calories)}</td>
      </tr>
    `,r=(a,n)=>`Average of ${a.days_logged} logged day${a.days_logged===1?"":"s"} in the last ${n} (excludes today)`;return u`
      <table class="macros">
        <thead>
          <tr>
            <th></th>
            ${ot.map(a=>u`<th><span class="dot ${a.key}"></span>${a.label}</th>`)}
            <th class="kcal">kcal</th>
          </tr>
        </thead>
        <tbody>
          ${s("Today",t)} ${s("7-day avg",e,r(e,7))}
          ${s("30-day avg",i,r(i,30))}
        </tbody>
      </table>
      ${this._renderMacroBar(t)}
    `}_renderMacroBar(t){let e={p:(t.p||0)*4,c:(t.c||0)*4,f:(t.f||0)*9},i=e.p+e.c+e.f;return i?u`
      <div class="macro-bar" title="Today's calories by macro">
        ${ot.map(s=>u`<span class="seg ${s.key}" style="flex-grow:${e[s.key]}"
            >${e[s.key]/i>=.12?`${Math.round(e[s.key]/i*100)}%`:""}</span>`)}
      </div>
    `:P}_renderActivityTile(){let t=this._stats.health;if(!(t!=null&&t.active_linked))return P;let e=t.active_kcal,i=t.estimated_activity_kcal,s=e!==null&&i>0?Math.min(e/i,1):0;return u`
      <div class="tile" title=${"Your activity multiplier already budgets this much movement per day. Only active calories above it (minus exercise you logged yourself) are added as exercise."}>
        <div class="tile-row">
          <ha-icon icon="mdi:fire"></ha-icon>
          <span class="tile-label">Active</span>
          <span class="tile-value">${e===null?"\u2014":this._fmt(e)}<small> / ${this._fmt(i)} kcal</small></span>
        </div>
        <div class="meter"><span style="width:${s*100}%"></span></div>
        <div class="tile-note">
          ${e===null?"Waiting for today's first Apple Health reading":t.credited_kcal>0?u`<span class="good">+${this._fmt(t.credited_kcal)} kcal</span> above your usual day, added as exercise`:`${this._fmt(Math.max(0,i-e))} kcal until extra activity counts`}
        </div>
      </div>
    `}_renderWeight(){let t=this._stats.last_weight;return u`
      <div class="weight">
        <ha-icon icon="mdi:scale-bathroom"></ha-icon>
        <span class="weight-label">Last weight</span>
        ${t?u`<span class="weight-value">${this._fmt(t.weight,1)} ${t.unit}</span>
              <span class="weight-date">${this._shortDate(t.date)}</span>`:u`<span class="weight-date">None logged yet</span>`}
      </div>
    `}_renderActivity(){let t=(this._stats.food_entries||[]).map(s=>Z(S({},s),{kind:"food"})),e=this._config.show_exercise?(this._stats.exercise_entries||[]).map(s=>Z(S({},s),{kind:"exercise"})):[],i=[...t,...e].sort((s,r)=>(r.timestamp||"").localeCompare(s.timestamp||""));return u`
      <div class="activity-head">
        <span>Today</span>
        <span class="muted">${t.length} item${t.length===1?"":"s"}</span>
      </div>
      <div class="activity">
        ${i.length===0?u`<div class="empty">
              <ha-icon icon="mdi:silverware-fork-knife"></ha-icon>
              <div>Nothing logged yet today.</div>
            </div>`:i.map(s=>s.kind==="food"?this._renderFood(s):this._renderExercise(s))}
      </div>
    `}_renderFood(t){let e=t.food_item||"Food",i=null,s=e.match(Zt);s&&(i=s[1],e=e.replace(Zt,""));let r=ot.some(a=>Y(t[a.key]));return u`
      <div class="item">
        <div class="item-main">
          <div class="item-name" title=${e}>${e}</div>
          <div class="item-meta">${this._time(t.timestamp)}${i?u` · ${i}`:P}</div>
          ${r?u`<div class="item-macros">
                ${ot.map(a=>u`<span><span class="dot ${a.key}"></span>${this._fmt(Y(t[a.key])||0)}g</span>`)}
              </div>`:P}
        </div>
        <div class="item-cal">${this._fmt(t.calories)}<span>kcal</span></div>
      </div>
    `}_renderExercise(t){let e=[this._time(t.timestamp)];return t.duration_minutes&&e.push(`${t.duration_minutes} min`),u`
      <div class="item exercise">
        <div class="item-main">
          <div class="item-name">
            <ha-icon icon="mdi:run"></ha-icon>${t.exercise_type||"Exercise"}
          </div>
          <div class="item-meta">${e.join(" \xB7 ")}</div>
        </div>
        <div class="item-cal">−${this._fmt(t.calories_burned||0)}<span>kcal</span></div>
      </div>
    `}static get styles(){return[ee,kt`
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
      `]}},ie="calorie-tracker-search-source";function ne(){try{return localStorage.getItem(ie)==="meals"?"meals":"foods"}catch(p){return"foods"}}function te(p){try{localStorage.setItem(ie,p)}catch(t){}}var oe={name:"",amount:"",unit:"g",calories:"",p:"",c:"",f:""},Nt=class extends Ct{static get properties(){return{hass:{attribute:!1},entityId:{attribute:!1},usdaApiKey:{attribute:!1},searchUsda:{attribute:!1},_view:{state:!0},_source:{state:!0},_history:{state:!0},_meals:{state:!0},_mealsError:{state:!0},_mealDraft:{state:!0},_mealSaving:{state:!0},_confirmDelete:{state:!0},_query:{state:!0},_results:{state:!0},_searching:{state:!0},_searchErrors:{state:!0},_selected:{state:!0},_units:{state:!0},_loadingPortions:{state:!0},_form:{state:!0},_caloriesTouched:{state:!0},_saving:{state:!0},_error:{state:!0}}}constructor(){super(),this._view="log",this._source=ne(),this._meals=null,this._mealsError=null,this._mealDraft=null,this._mealSaving=!1,this._confirmDelete=!1,this._searchSeq=0,this._resetForm(),this._saving=!1,this._onKey=t=>{t.key==="Escape"&&(this._view==="ingredient"?this._backToMeal():this._view==="meal"?this._backToLog():this._close())}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),clearTimeout(this._searchTimer)}firstUpdated(){this._focusSearch(),this._loadMeals(),this._searchHistory()}_close(){this.remove()}_focusSearch(){this.updateComplete.then(()=>{var t;return(t=this.renderRoot.querySelector("#search"))==null?void 0:t.focus()})}_resetForm(){this._query="",this._history=[],this._results=[],this._searching=!1,this._searchErrors=[],this._selected=null,this._units=wt(null),this._loadingPortions=!1,this._form=S({},oe),this._unitTouched=!1,this._caloriesTouched=!1,this._error=null}get _activeSource(){return this._view==="ingredient"?"foods":this._source}get _usdaEnabled(){return this.searchUsda!==!1}_setSource(t){t!==this._source&&(this._source=t,te(t),this._results=[],this._searchErrors=[],this._searching=!1,t==="foods"&&(this._searchHistory(),this._query.trim().length>=2&&this._search()),this._focusSearch())}async _loadMeals(){try{let t=await this.hass.callWS({type:"calorie_tracker/meals/list"});this._meals=t.meals||[],this._mealsError=null}catch(t){this._meals=[],this._mealsError=(t==null?void 0:t.code)==="unknown_command"?"Saved meals need the updated integration. Restart Home Assistant.":t.message||String(t)}}_onSearchInput(t){if(this._query=t.target.value,this._activeSource!=="meals"){if(clearTimeout(this._historyTimer),this._historyTimer=setTimeout(()=>this._searchHistory(),120),clearTimeout(this._searchTimer),this._query.trim().length<2||!this._usdaEnabled){this._searchSeq++,this._results=[],this._searchErrors=[],this._searching=!1;return}this._searching=!0,this._searchTimer=setTimeout(()=>this._search(),600)}}async _searchHistory(){if(!this.entityId)return;let t=this._historySeq=(this._historySeq||0)+1;try{let e=await this.hass.callWS({type:"calorie_tracker/search_history",entity_id:this.entityId,query:this._query.trim(),limit:this._query.trim()?8:6});t===this._historySeq&&(this._history=e.results||[])}catch(e){t===this._historySeq&&(this._history=[])}}async _search(){let t=++this._searchSeq,e={type:"calorie_tracker/search_foods",query:this._query.trim(),limit:20};this.usdaApiKey&&(e.usda_api_key=this.usdaApiKey),this._searching=!0;try{let i=await this.hass.callWS(e);if(t!==this._searchSeq)return;this._results=i.results||[],this._searchErrors=i.errors||[]}catch(i){if(t!==this._searchSeq)return;this._results=[],this._searchErrors=[`Search failed: ${i.message||i}`]}finally{t===this._searchSeq&&(this._searching=!1)}}get _filteredMeals(){let t=this._meals||[],e=this._query.toLowerCase().split(/\s+/).filter(Boolean);return e.length?t.filter(i=>{let s=`${i.name} ${(i.ingredients||[]).map(r=>r.name).join(" ")}`.toLowerCase();return e.every(r=>s.includes(r))}).sort((i,s)=>i.name.localeCompare(s.name)):[...t].sort((i,s)=>(s.updated||"").localeCompare(i.updated||""))}get _unit(){return this._units.find(t=>t.id===this._form.unit)||this._units[0]}_grams(t=this._form){let e=this._units.find(s=>s.id===t.unit),i=nt(t.amount);return!e||i===null||e.g===null?null:i*e.g}_scaled(t,e){let i=e/t.base_g,s=r=>r==null?"":bt(r*i);return{calories:t.calories===null?"":Math.round(t.calories*i),p:s(t.protein),c:s(t.carbs),f:s(t.fat)}}_defaultAmount(t,e){var r;if(t.last){let a=e.find(n=>n.label===t.last.unit||t.last.unit==="g"&&n.id==="g");if(a)return{unit:a.id,amount:Q(t.last.qty)}}let i=(r=t.portions)==null?void 0:r[0];if(i!=null&&i.volume_unit&&!e.some(a=>a.group==="food"&&a.g===i.per_unit_g)){let a=t.default_g!==t.base_g?t.default_g/i.per_unit_g:1;return{unit:i.volume_unit,amount:Q(a)}}let s=e.find(a=>a.group==="food");return s?{unit:s.id,amount:"1"}:{unit:"g",amount:String(bt(t.default_g||t.base_g||100))}}_applyScaling(t){let e=this._grams(t);if(this._selected&&e&&e>0){let i=t.calories;Object.assign(t,this._scaled(this._selected,e)),this._caloriesTouched&&(t.calories=i)}return t}_select(t){let e=t.brand&&!t.name.toLowerCase().includes(t.brand.toLowerCase())?`${t.brand} ${t.name}`:t.name;this._selected=t,this._units=wt(t),this._unitTouched=!1,this._caloriesTouched=!1,this._form=this._applyScaling(S(Z(S({},this._form),{name:e}),this._defaultAmount(t,this._units))),this._results=[],this._query="",this.updateComplete.then(()=>{var i;return(i=this.renderRoot.querySelector("#amount"))==null?void 0:i.select()}),t.portions_pending&&t.fdc_id&&this._loadPortions(t)}async _loadPortions(t){var e;this._loadingPortions=!0;try{let i={type:"calorie_tracker/get_food_portions",fdc_id:t.fdc_id};this.usdaApiKey&&(i.usda_api_key=this.usdaApiKey);let s=await this.hass.callWS(i);if(this._selected!==t||!((e=s==null?void 0:s.portions)!=null&&e.length))return;let r=Z(S({},t),{portions:s.portions,portions_pending:!1});this._selected=r,this._units=wt(r);let a=this._unitTouched?{}:this._defaultAmount(r,this._units);this._form=this._applyScaling(S(S({},this._form),a))}catch(i){}finally{this._loadingPortions=!1}}_clearSelection(){this._selected=null,this._units=wt(null),this._units.some(t=>t.id===this._form.unit)||(this._form=Z(S({},this._form),{unit:"g"}))}_caloriesFromMacros(t){let e=Y(t.p)||0,i=Y(t.c)||0,s=Y(t.f)||0;return e||i||s?Math.round(e*4+i*4+s*9):""}_onField(t,e){let i=e.target.value,s=Z(S({},this._form),{[t]:i});t==="amount"||t==="unit"?(t==="unit"&&(this._unitTouched=!0,s.amount=this._convertAmount(this._form,i)),s=this._applyScaling(s)):t==="calories"?(this._caloriesTouched=i!=="",this._caloriesTouched||(s.calories=this._caloriesFromMacros(s))):["p","c","f"].includes(t)&&(this._selected=null,this._units=wt(null),this._units.some(r=>r.id===s.unit)||(s.unit="g"),this._caloriesTouched||(s.calories=this._caloriesFromMacros(s))),this._form=s}_convertAmount(t,e){let i=this._units.find(n=>n.id===t.unit),s=this._units.find(n=>n.id===e),r=nt(t.amount);if(!i||!s||r===null)return t.amount;let a=this._grams(t);if(s.group==="mass"&&a!==null)return s.id==="g"?String(Math.round(a)):Q(a/s.g);if(i.group===s.group&&i.group!=="food"){let n=i.group==="mass"?i.g/s.g:Mt[i.id]/Mt[s.id],o=r*n;return s.id==="g"?String(Math.round(o)):Q(o)}return"1"}_amountParts(){var r;let t=nt(this._form.amount);if(t===null)return{};let e=this._unit,s=((r=this._selected)==null?void 0:r.portions_only)?null:this._grams();return{qty:Q(t),unitText:e.id==="g"?"g":e.label.split(" (")[0],grams:s,approx:e.quality==="rough"||e.quality==="derived"}}_amountSuffix(){let{qty:t,unitText:e,grams:i,approx:s}=this._amountParts();return t?e==="g"?` (${t} g)`:i===null?` (${t} ${e})`:` (${t} ${e} \xB7 ${s?"~":""}${Math.round(i)} g)`:""}_validateForm(){if(!this._form.name.trim())return"Give the food a name.";let t=Y(this._form.calories);return t===null||t<0?"Enter calories, or macros to calculate them.":this._form.amount.trim()&&nt(this._form.amount)===null?"Amount should be a number like 1.5 or 1 1/2.":null}_onSubmit(t){t==null||t.preventDefault(),this._view==="ingredient"?this._addIngredient():this._save()}async _save(){if(this._error=this._validateForm(),this._error)return;let t={food_item:`${this._form.name.trim()}${this._amountSuffix()}`,calories:Math.round(Y(this._form.calories))};for(let e of["p","c","f"]){let i=Y(this._form[e]);i&&(t[e]=bt(i))}this._saving=!0;try{await this.hass.callWS({type:"calorie_tracker/add_entry",entity_id:this.entityId,entry_type:"food",entry:t}),this.dispatchEvent(new CustomEvent("hf-logged",{detail:t})),this._close()}catch(e){this._error=`Couldn't save: ${e.message||e}`}finally{this._saving=!1}}_newMeal(){this._mealDraft={id:null,name:this._query.trim(),servings:"1",ingredients:[]},this._confirmDelete=!1,this._mealError=null,this._resetForm(),this._view="meal"}_editMeal(t){this._mealDraft={id:t.id,name:t.name,servings:Q(t.servings||1),ingredients:(t.ingredients||[]).map(e=>S({},e))},this._confirmDelete=!1,this._mealError=null,this._resetForm(),this._view="meal"}_backToLog(){this._mealDraft=null,this._resetForm(),this._view="log",this._focusSearch()}_backToMeal(){this._resetForm(),this._view="meal"}_startIngredient(){this._resetForm(),this._view="ingredient",this._focusSearch()}_addIngredient(){var r;if(this._error=this._validateForm(),this._error)return;let{qty:t,unitText:e,grams:i}=this._amountParts(),s={name:this._form.name.trim(),calories:Math.round(Y(this._form.calories)),protein:Y(this._form.p),carbs:Y(this._form.c),fat:Y(this._form.f),grams:i?bt(i):null,amount:t||null,unit:t?e:null,source:((r=this._selected)==null?void 0:r.id)||null};this._mealDraft=Z(S({},this._mealDraft),{ingredients:[...this._mealDraft.ingredients,s]}),this._backToMeal()}_removeIngredient(t){let e=this._mealDraft.ingredients.filter((i,s)=>s!==t);this._mealDraft=Z(S({},this._mealDraft),{ingredients:e})}_onMealField(t,e){this._mealDraft=Z(S({},this._mealDraft),{[t]:e.target.value})}_mealTotals(){var n,o;let t=((n=this._mealDraft)==null?void 0:n.ingredients)||[],e=d=>t.reduce((h,c)=>h+(Y(c[d])||0),0),i={calories:e("calories"),p:e("protein"),c:e("carbs"),f:e("fat")},s=nt((o=this._mealDraft)==null?void 0:o.servings)||1,r=Object.fromEntries(Object.entries(i).map(([d,h])=>[d,h/s])),a=t.length&&t.every(d=>Y(d.grams));return{total:i,per:r,servings:s,grams:a?e("grams"):null}}async _saveMeal(){let t=this._mealDraft,e=nt(t.servings);if(!t.name.trim()){this._mealError="Give the meal a name.";return}if(!e){this._mealError="Servings should be a number like 1, 4 or 1/2.";return}if(!t.ingredients.length){this._mealError="Add at least one ingredient.";return}this._mealSaving=!0,this._mealError=null;try{let i={name:t.name.trim(),servings:e,ingredients:t.ingredients};t.id&&(i.id=t.id),await this.hass.callWS({type:"calorie_tracker/meals/save",meal:i}),await this._loadMeals(),this._source="meals",te("meals"),this._backToLog()}catch(i){this._mealError=`Couldn't save the meal: ${i.message||i}`}finally{this._mealSaving=!1}}async _deleteMeal(){if(!this._confirmDelete){this._confirmDelete=!0,clearTimeout(this._confirmTimer),this._confirmTimer=setTimeout(()=>this._confirmDelete=!1,4e3);return}try{await this.hass.callWS({type:"calorie_tracker/meals/delete",meal_id:this._mealDraft.id}),await this._loadMeals(),this._backToLog()}catch(t){this._mealError=`Couldn't delete: ${t.message||t}`}}_resultKcal(t){let e=t.default_g||t.base_g;return Math.round(t.calories*e/t.base_g)}_resultServing(t){var i;if(t.source==="history"){let s=t.last,r=s.unit==="g"?"g":s.unit,a=!t.portions_only&&s.unit!=="g"?` \xB7 ${Math.round(t.base_g)} g`:"";return`${t.times_logged>1?`${t.times_logged}\xD7 \xB7 `:""}last ${this._shortDate(t.last_logged)} \xB7 ${Q(s.qty)} ${r}${a}`}if(t.source==="meal"){let s=t.portions_only?"1 serving":`1 serving \xB7 ${Math.round(t.default_g)} g`;return`${t.ingredient_count} ingredient${t.ingredient_count===1?"":"s"} \xB7 ${s}`}let e=(i=t.portions)==null?void 0:i[0];return e?`1 ${e.unit_label.split(" (")[0]} \xB7 ${Math.round(e.per_unit_g)} g`:`${Math.round(t.default_g||t.base_g)} g`}_shortDate(t){var n,o;let[e,i,s]=(t||"").split("-").map(Number);if(!e)return"";let r=new Date(e,i-1,s),a=Math.round((new Date().setHours(0,0,0,0)-r.getTime())/864e5);return a<=0?"today":a===1?"yesterday":r.toLocaleDateString((o=(n=this.hass)==null?void 0:n.locale)==null?void 0:o.language,{month:"short",day:"numeric"})}_renderResult(t,e=null){return u`
      <div class="result">
        <button class="result-pick" @click=${()=>this._select(t)}>
          <div class="result-main">
            <div class="result-name">${t.name}</div>
            <div class="result-meta">
              <span class="chip ${t.source}">${t.source_label}</span>
              ${t.brand?u`<span>${t.brand}</span>`:P}
              <span>${this._resultServing(t)}</span>
            </div>
          </div>
          <div class="result-kcal">${this._resultKcal(t)}<span>kcal</span></div>
        </button>
        ${e?u`<button class="icon-btn edit" title="Edit meal" aria-label="Edit ${e.name}"
              @click=${()=>this._editMeal(e)}><ha-icon icon="mdi:pencil"></ha-icon></button>`:P}
      </div>
    `}_renderSourceToggle(){if(this._view==="ingredient")return P;let t=(e,i,s)=>u`
      <button role="tab" aria-selected=${this._source===e} class=${this._source===e?"on":""}
        @click=${()=>this._setSource(e)}>
        <ha-icon icon=${i}></ha-icon>${s}
      </button>
    `;return u`<div class="segmented" role="tablist" aria-label="Search source">
      ${t("meals","mdi:bookmark-multiple-outline","My meals")}
      ${t("foods","mdi:food-apple-outline","Foods")}
    </div>`}_renderSearch(){let t=this._activeSource,e=t==="meals"?"Search my meals":this._usdaEnabled?"Search your foods, then USDA":"Search foods you've logged";return u`
      ${this._renderSourceToggle()}
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input id="search" type="search" autocomplete="off" placeholder=${e}
          .value=${this._query} @input=${this._onSearchInput} />
      </div>
      ${t==="meals"?this._renderMealResults():this._renderFoodResults()}
    `}_renderFoodResults(){let t=this._query.trim();if(this._selected&&!t)return P;let e=this._history||[],i=this._usdaEnabled&&t.length>=2,s=t.length>=2&&!e.length&&!this._results.length&&!this._searching&&!this._searchErrors.length;return!e.length&&!i?P:u`
      <div class="results">
        ${e.length?u`<div class="section">${t?"Logged before":"Recent"}</div>
              ${e.map(r=>this._renderResult(r))}`:P}
        ${i?u`<div class="section">USDA ${this._searching?u`<span class="spinner small"></span>`:P}</div>
              ${this._searchErrors.map(r=>u`<div class="hint warn pad">${r}
                  <button class="link" @click=${()=>this._search()}>Retry</button></div>`)}
              ${this._results.map(r=>this._renderResult(r))}
              ${!this._searching&&!this._searchErrors.length&&!this._results.length&&e.length?u`<div class="hint pad">No USDA matches.</div>`:P}`:P}
        ${s?u`<div class="hint pad">No matches. Enter it manually below.</div>`:P}
      </div>
    `}_renderMealResults(){if(this._selected&&!this._query.trim())return P;if(this._meals===null)return u`<div class="hint">Loading meals…</div>`;if(this._mealsError)return u`<div class="hint warn">${this._mealsError}</div>`;let t=this._filteredMeals,e=u`<button class="new-meal" @click=${this._newMeal}>
      <ha-icon icon="mdi:plus"></ha-icon>${this._query.trim()?`New meal \u201C${this._query.trim()}\u201D`:"New meal"}
    </button>`;return this._meals.length?u`
      <div class="results">
        ${t.length?t.map(i=>this._renderResult(i.item,i)):u`<div class="hint pad">No meals match “${this._query.trim()}”.</div>`}
        ${e}
      </div>
    `:u`<div class="empty-meals">
        <div>No saved meals yet. Build one from ingredients and it'll show up here.</div>
        ${e}
      </div>`}_renderAmountHint(){var s;if(this._loadingPortions)return u`<div class="hint">Loading serving sizes…</div>`;if((s=this._selected)!=null&&s.portions_only)return u`<div class="hint">${this._selected.source==="meal"?"Some ingredients have no weight, so this meal is logged by serving.":"Logged before without a weight, so it scales by the amount you had last time."}</div>`;let t=this._unit,e=this._grams();if(t.id==="g"||e===null)return t.quality==="unknown"&&nt(this._form.amount)!==null?u`<div class="hint">Pick a food from search to convert ${t.label} to grams.</div>`:P;let i=Math.round(e);return t.quality==="exact"?u`<div class="hint">= ${i} g</div>`:t.quality==="derived"?u`<div class="hint">≈ ${i} g · based on 1 ${t.basis.unit_label} = ${Math.round(t.basis.per_unit_g)} g</div>`:u`<div class="hint warn">≈ ${i} g · rough guess: no volume data for this food, so it assumes the density of water. Weigh it or pick a portion for accuracy.</div>`}_renderUnitSelect(){var e;let t=[["food",((e=this._selected)==null?void 0:e.source)==="meal"?"This meal":"This food"],["volume","Volume"],["mass","Weight"]];return u`
      <select id="unit" @change=${i=>this._onField("unit",i)}>
        ${t.map(([i,s])=>{let r=this._units.filter(a=>a.group===i);return r.length?u`<optgroup label=${s}>
            ${r.map(a=>{var n;return u`<option value=${a.id} ?selected=${a.id===this._form.unit}>
                ${a.group==="food"&&!((n=this._selected)!=null&&n.portions_only)?`${a.label} (${Q(a.g)} g)`:a.label}
              </option>`})}
          </optgroup>`:P})}
      </select>
    `}_renderFoodForm(){let t=this._form,e=!this._caloriesTouched&&t.calories!==""&&!this._selected,i=this._view==="ingredient";return u`
      <form @submit=${this._onSubmit}>
        ${this._selected?u`<div class="selected">
              <span>Nutrition scales with the amount (from ${this._selected.source_label}).</span>
              <button type="button" class="link" @click=${this._clearSelection}>Unlink</button>
            </div>`:P}
        <label class="full">
          <span>${i?"Ingredient":"Food name"}</span>
          <input .value=${t.name} @input=${s=>this._onField("name",s)} required />
        </label>
        <div>
          <div class="row amount-row">
            <label>
              <span>Amount</span>
              <input id="amount" type="text" inputmode="decimal" placeholder="e.g. 1 1/2"
                .value=${String(t.amount)} @input=${s=>this._onField("amount",s)} />
            </label>
            <label>
              <span>Unit</span>
              ${this._renderUnitSelect()}
            </label>
            <label>
              <span>Calories ${e?u`<em>from macros</em>`:P}</span>
              <input type="number" inputmode="numeric" min="0" step="1"
                .value=${String(t.calories)} @input=${s=>this._onField("calories",s)} />
            </label>
          </div>
          ${this._renderAmountHint()}
        </div>
        <div class="row three">
          ${ot.map(s=>u`
              <label>
                <span><span class="dot ${s.key}"></span>${s.label} (g)</span>
                <input type="number" inputmode="decimal" min="0" step="any"
                  .value=${String(t[s.key])} @input=${r=>this._onField(s.key,r)} />
              </label>
            `)}
        </div>
        ${this._error?u`<div class="hint warn">${this._error}</div>`:P}
        <div class="actions">
          <button type="button" class="btn secondary"
            @click=${i?this._backToMeal:this._close}>Cancel</button>
          <button type="submit" class="btn" ?disabled=${this._saving}>
            ${i?"Add to meal":this._saving?"Saving\u2026":"Log food"}
          </button>
        </div>
      </form>
    `}_renderMealBuilder(){let t=this._mealDraft,e=this._mealTotals(),i=s=>u`${ot.map(r=>u`<span><span class="dot ${r.key}"></span>${Q(bt(s[r.key]))}g</span>`)}`;return u`
      <div class="meal-builder">
        <div class="row meal-head">
          <label>
            <span>Meal name</span>
            <input id="meal-name" .value=${t.name} placeholder="e.g. Chicken burrito bowl"
              @input=${s=>this._onMealField("name",s)} />
          </label>
          <label>
            <span>Makes (servings)</span>
            <input type="text" inputmode="decimal" .value=${t.servings}
              @input=${s=>this._onMealField("servings",s)} />
          </label>
        </div>

        <div class="section-label">Ingredients</div>
        <div class="ingredients">
          ${t.ingredients.length?t.ingredients.map((s,r)=>u`
                  <div class="ingredient">
                    <div class="ing-main">
                      <div class="ing-name">${s.name}</div>
                      <div class="ing-meta">
                        ${s.amount?u`<span>${s.amount} ${s.unit}${s.grams&&s.unit!=="g"?` \xB7 ${Math.round(s.grams)} g`:""}</span>`:P}
                        ${i({p:Y(s.protein)||0,c:Y(s.carbs)||0,f:Y(s.fat)||0})}
                      </div>
                    </div>
                    <div class="ing-kcal">${Math.round(s.calories)}<span>kcal</span></div>
                    <button class="icon-btn" aria-label="Remove ${s.name}" @click=${()=>this._removeIngredient(r)}>
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </div>
                `):u`<div class="hint pad">No ingredients yet.</div>`}
          <button class="new-meal" @click=${this._startIngredient}>
            <ha-icon icon="mdi:plus"></ha-icon>Add ingredient
          </button>
        </div>

        ${t.ingredients.length?u`<div class="totals">
              <div>
                <div class="totals-label">Whole recipe${e.grams?` \xB7 ${Math.round(e.grams)} g`:""}</div>
                <div class="totals-kcal">${Math.round(e.total.calories)} kcal</div>
                <div class="ing-meta">${i(e.total)}</div>
              </div>
              <div>
                <div class="totals-label">Per serving${e.grams?` \xB7 ${Math.round(e.grams/e.servings)} g`:""}</div>
                <div class="totals-kcal">${Math.round(e.per.calories)} kcal</div>
                <div class="ing-meta">${i(e.per)}</div>
              </div>
            </div>`:P}

        ${this._mealError?u`<div class="hint warn">${this._mealError}</div>`:P}
        <div class="actions">
          ${t.id?u`<button type="button" class="btn danger ${this._confirmDelete?"confirm":""}" @click=${this._deleteMeal}>
                ${this._confirmDelete?"Tap again to delete":"Delete"}
              </button>`:P}
          <span class="spacer"></span>
          <button type="button" class="btn secondary" @click=${this._backToLog}>Cancel</button>
          <button type="button" class="btn" ?disabled=${this._mealSaving} @click=${this._saveMeal}>
            ${this._mealSaving?"Saving\u2026":"Save meal"}
          </button>
        </div>
      </div>
    `}render(){var i,s;let t={log:"Log food",meal:(i=this._mealDraft)!=null&&i.id?"Edit meal":"New meal",ingredient:"Add ingredient"},e=this._view==="ingredient"?this._backToMeal:this._view==="meal"?this._backToLog:null;return u`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="hf-title">
        <div class="dialog-head">
          ${e?u`<button class="icon-btn" @click=${e} aria-label="Back"><ha-icon icon="mdi:arrow-left"></ha-icon></button>`:P}
          <h2 id="hf-title">${t[this._view]}</h2>
          ${this._view==="ingredient"&&((s=this._mealDraft)!=null&&s.name)?u`<span class="head-sub">to ${this._mealDraft.name}</span>`:P}
          <button class="icon-btn close" @click=${this._close} aria-label="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${this._view==="meal"?this._renderMealBuilder():u`${this._renderSearch()} ${this._renderFoodForm()}`}
      </div>
    `}static get styles(){return[ee,kt`
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
          gap: 4px;
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
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--hf-divider);
        }
        .result-pick {
          flex: 1;
          min-width: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          text-align: left;
          background: none;
          border: none;
          padding: 10px 12px;
          color: inherit;
        }
        .result-pick:hover, .result-pick:focus-visible, .new-meal:hover, .new-meal:focus-visible {
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
          outline: none;
        }
        .icon-btn.edit { margin-right: 6px; }
        .icon-btn ha-icon { --mdc-icon-size: 20px; }
        .segmented {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 4px;
          margin-bottom: 10px;
          border-radius: 12px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
        }
        .segmented button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: var(--hf-muted);
          font-weight: 500;
        }
        .segmented button ha-icon { --mdc-icon-size: 18px; }
        .segmented button.on {
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .new-meal {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: none;
          color: var(--primary-color);
          font-weight: 600;
          text-align: left;
        }
        .new-meal ha-icon { --mdc-icon-size: 18px; }
        .empty-meals {
          margin-top: 8px;
          padding: 14px 12px 4px;
          border: 1px dashed var(--hf-divider);
          border-radius: 12px;
          font-size: 0.85rem;
          color: var(--hf-muted);
        }
        .empty-meals .new-meal { padding-left: 0; }
        .hint.pad { padding: 4px 12px 8px; }
        .head-sub { color: var(--hf-muted); font-size: 0.85rem; margin-left: 6px; }
        .dialog-head .close { margin-left: auto; }
        .meal-builder { display: flex; flex-direction: column; gap: 12px; }
        .row.meal-head { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
        .section-label { font-size: 0.78rem; color: var(--hf-muted); margin-bottom: -6px; }
        .ingredients { border: 1px solid var(--hf-divider); border-radius: 12px; }
        .ingredient {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 8px;
          align-items: center;
          padding: 8px 6px 8px 12px;
          border-bottom: 1px solid var(--hf-divider);
        }
        .ing-name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ing-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--hf-muted);
          margin-top: 2px;
        }
        .ing-meta .dot { width: 6px; height: 6px; margin-right: 3px; }
        .ing-kcal, .totals-kcal { font-weight: 600; text-align: right; }
        .ing-kcal span { display: block; font-size: 0.65rem; font-weight: 400; color: var(--hf-muted); }
        .totals {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
        }
        .totals-label { font-size: 0.75rem; color: var(--hf-muted); }
        .totals-kcal { text-align: left; font-size: 1.1rem; margin: 2px 0; }
        .actions .spacer { flex: 1; }
        .btn.danger { background: transparent; color: var(--hf-over); border: 1px solid var(--hf-divider); }
        .btn.danger.confirm { background: var(--hf-over); color: #fff; border-color: var(--hf-over); }
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
        .chip.meal { background: var(--primary-color); color: var(--text-primary-color, #fff); }
        .chip.history { background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); }
        .section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px 4px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hf-muted);
          border-bottom: 1px solid var(--hf-divider);
        }
        .spinner.small { width: 11px; height: 11px; border-width: 2px; }
        .hint.warn .link { margin-left: 6px; }
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
      `]}};customElements.get("hf-log-dialog")||customElements.define("hf-log-dialog",Nt);customElements.get("health-fitness-card")||customElements.define("health-fitness-card",It);window.customCards=window.customCards||[];window.customCards.push({type:"health-fitness-card",name:"Calorie Tracker: Health & Fitness",description:"Today's calories, macros with 7/30-day averages, last weight, and a scrollable food log with quick logging and USDA search.",preview:!0})});var le=U(()=>{var We=J(Ot()),Oe=J(jt()),je=J(Gt()),Ge=J(Yt()),Ye=J(Bt()),Be=J(Vt()),Ve=J(Xt()),Xe=J(Kt()),Ke=J(Ut()),Ue=J(se())});export default le();
//# sourceMappingURL=cards-impl-2TKMV4R7.js.map
