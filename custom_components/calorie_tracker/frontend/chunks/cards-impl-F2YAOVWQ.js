import{a as $t,b,c as Wt,e as B,g as St,h as ie}from"./chunk-EMR7U3YA.js";import{a as T,b as st,e as K,f as U}from"./chunk-5HHMTMB7.js";var Ot=K(()=>{var pt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._summaryLoaded=!1,this._styleObserver=null,this._translations=null,this._translationsLang=null}async _ensureSummaryLoaded(){if(!this._summaryLoaded&&!customElements.get("calorie-summary"))try{await import("./summary-T45HUWTR.js"),this._summaryLoaded=!0}catch(t){console.error("Failed to load summary component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <calorie-summary></calorie-summary>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var r,s,n,l,d,h;await this._ensureSummaryLoaded(),await customElements.whenDefined("calorie-summary");let t=this.querySelector("calorie-summary");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(c=>c.startsWith("sensor.calorie_tracker_profile"))),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.weekStartDay=((r=i==null?void 0:i.attributes)==null?void 0:r.week_start_day)||"sunday",t.selectedDate=this.selectedDate||this._getLocalDateString(),this._applyWrapperStyles(t),!this._styleObserver&&t.renderRoot&&(this._styleObserver=new MutationObserver(()=>{this._applyWrapperStyles(t)}),this._styleObserver.observe(t.renderRoot,{childList:!0,subtree:!0}));let a=((n=(s=this.hass)==null?void 0:s.locale)==null?void 0:n.language)||((l=this.hass)==null?void 0:l.language)||"en";if(!this._translations||this._translationsLang!==a)try{let c=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:a,namespace:"frontend.summary"});this._translations=(c==null?void 0:c.translations)||{},this._translationsLang=a}catch(c){console.warn("Failed to fetch summary translations:",c),this._translations={},this._translationsLang=a}t.translations=this._translations||{};try{let[c,F]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_weekly_summary",entity_id:e,date:t.selectedDate}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate})]);t.weeklySummary=(d=c==null?void 0:c.weekly_summary)!=null?d:{},t.weight=(h=F==null?void 0:F.weight)!=null?h:null}catch(c){console.error("Failed to fetch calorie data:",c)}this._eventsAttached||(t.addEventListener("select-summary-date",c=>{this.selectedDate=c.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyWrapperStyles(t){if(!(t!=null&&t.renderRoot))return;let e=t.renderRoot.querySelector(".gauge-container");if(e){e.style.width="120px",e.style.height="120px",e.style.maxWidth="120px";let i=e.querySelector("svg");i&&(i.style.maxWidth="120px",i.style.maxHeight="120px")}}disconnectedCallback(){this._styleObserver&&(this._styleObserver.disconnect(),this._styleObserver=null)}};customElements.get("calorie-summary-card")||customElements.define("calorie-summary-card",pt);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-summary-card",name:"Calorie Tracker: Summary",description:"Full weekly summary card for the Calorie Tracker integration",editor:"calorie-summary-editor",preview:!0});var Ct=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),a=()=>{let r=T({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",a),e&&e.addEventListener("value-changed",a)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-summary-editor")||customElements.define("calorie-summary-editor",Ct);pt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};pt.getStubConfig=function(){return{profile_entity_id:""}}});var jt=K(()=>{var ft=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._dailyDataLoaded=!1}async _ensureDailyDataLoaded(){if(!this._dailyDataLoaded&&!customElements.get("daily-data-card"))try{await import("./daily-data-5E2NVXPT.js"),this._dailyDataLoaded=!0}catch(t){console.error("Failed to load daily-data component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <daily-data-card></daily-data-card>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a,r,s,n;await this._ensureDailyDataLoaded(),await customElements.whenDefined("daily-data-card");let t=this.querySelector("daily-data-card");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(l=>l.startsWith("sensor.calorie_tracker_")&&l.includes("_profile")&&this.hass.states[l])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.selectedDate=this.selectedDate||this._getLocalDateString();try{let l=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate});t.log={food_entries:(l==null?void 0:l.food_entries)||[],exercise_entries:(l==null?void 0:l.exercise_entries)||[],weight:(a=l==null?void 0:l.weight)!=null?a:null,body_fat_pct:(r=l==null?void 0:l.body_fat_pct)!=null?r:null,bmr_and_neat:(s=l==null?void 0:l.bmr_and_neat)!=null?s:null,macros:(l==null?void 0:l.macros)||null,config_entry_id:(n=l==null?void 0:l.config_entry_id)!=null?n:null}}catch(l){console.error("Failed to fetch daily data:",l),t.log={food_entries:[],exercise_entries:[],weight:null,body_fat_pct:null,bmr_and_neat:null}}this._eventsAttached||(t.addEventListener("select-daily-date",l=>{this.selectedDate=l.detail.date,this._updateCard()}),t.addEventListener("refresh-daily-data",()=>{this._updateCard()}),t.addEventListener("add-daily-entry",async l=>{try{await this.hass.connection.sendMessagePromise(T({type:"calorie_tracker/add_entry",entity_id:e},l.detail)),this._updateCard()}catch(d){console.error("Failed to add entry:",d)}}),t.addEventListener("edit-daily-entry",async l=>{try{await this.hass.connection.sendMessagePromise(T({type:"calorie_tracker/update_entry",entity_id:e},l.detail)),this._updateCard()}catch(d){console.error("Failed to edit entry:",d)}}),t.addEventListener("delete-daily-entry",async l=>{try{await this.hass.connection.sendMessagePromise(T({type:"calorie_tracker/delete_entry",entity_id:e},l.detail)),this._updateCard()}catch(d){console.error("Failed to delete entry:",d)}}),this._eventsAttached=!0)}};customElements.get("calorie-daily-log-card")||customElements.define("calorie-daily-log-card",ft);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-daily-log-card",name:"Calorie Tracker: Daily Log",description:"Daily food/exercise log UI for the Calorie Tracker integration",editor:"calorie-daily-log-editor",preview:!0});var Lt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),a=()=>{let r=T({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",a),e&&e.addEventListener("value-changed",a)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-daily-log-editor")||customElements.define("calorie-daily-log-editor",Lt);ft.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};ft.getStubConfig=function(){return{profile_entity_id:""}}});var Gt=K(()=>{var mt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._profileLoaded=!1}async _ensureProfileLoaded(){if(!this._profileLoaded&&!customElements.get("profile-card"))try{await import("./profile-card-Q5HMXRPY.js"),this._profileLoaded=!0}catch(t){console.error("Failed to load profile component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header" id="ct-header">${this.title}</div>`:""}
        <profile-card></profile-card>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}async _updateCard(){var s,n,l,d,h,c,F,I,M;await this._ensureProfileLoaded(),await customElements.whenDefined("profile-card");let t=this.querySelector("profile-card");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find($=>$.startsWith("sensor.calorie_tracker_")&&$.includes("_profile")&&this.hass.states[$])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i;let a=i.attributes||{};t.goalType=(s=a.goal_type)!=null?s:"Not Set",t.dailyGoal=(n=a.daily_goal_calories)!=null?n:null,t.goalValue=(l=a.goal_value)!=null?l:null,t.currentWeight=(d=a.current_weight)!=null?d:null;let r=this.querySelector("#ct-header");if(r)if(this.title)r.textContent=this.title;else{let $=((h=i.attributes)==null?void 0:h.spoken_name)||e||"Calorie Tracker";r.textContent=`${$} Calorie Tracker Profile`}try{let[$,_]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_user_profile",user_id:((c=this.hass.user)==null?void 0:c.id)||"unknown"}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_linked_components",entity_id:e})]);t.allProfiles=(F=$==null?void 0:$.all_profiles)!=null?F:[],t.defaultProfile=(I=$==null?void 0:$.default_profile)!=null?I:null,t.linkedDevices=(M=_==null?void 0:_.linked_components)!=null?M:[]}catch($){console.error("Failed to fetch profile data:",$);let _=Object.keys(this.hass.states).filter(S=>S.startsWith("sensor.calorie_tracker_profile")).map(S=>{var v;let L=this.hass.states[S];return{entity_id:S,spoken_name:((v=L.attributes)==null?void 0:v.spoken_name)||S}}).filter(S=>S);t.allProfiles=_,t.linkedDevices=[]}this._eventsAttached||(t.addEventListener("refresh-profile",()=>{this._updateCard()}),t.addEventListener("profile-selected",$=>{this.profileEntityId=$.detail.entityId,this._updateCard()}),t.addEventListener("profiles-updated",$=>{this._updateCard()}),this._eventsAttached=!0)}};customElements.get("calorie-profile-card")||customElements.define("calorie-profile-card",mt);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-profile-card",name:"Calorie Tracker: Profile",description:"Profile card for Calorie Tracker (shows user profile and settings)",editor:"calorie-profile-editor",preview:!0});var Et=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelector(".error"),a=()=>{let r=T({},this._config);t&&t.value?r.title=t.value.trim():delete r.title,e&&e.value?r.profile_entity_id=e.value:delete r.profile_entity_id,r.profile_entity_id?i&&(i.style.display="none"):i&&(i.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))};t&&t.addEventListener("value-changed",a),e&&e.addEventListener("value-changed",a)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-profile-editor")||customElements.define("calorie-profile-editor",Et);mt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}}]}};mt.getStubConfig=function(){return{profile_entity_id:""}}});var Yt=K(()=>{var _t=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._summaryLoaded=!1,this._styleObserver=null}async _ensureSummaryLoaded(){if(!this._summaryLoaded&&!customElements.get("calorie-summary"))try{await import("./summary-T45HUWTR.js"),this._summaryLoaded=!0}catch(t){console.error("Failed to load summary component:",t)}}setConfig(t){this.config=t,this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <calorie-summary></calorie-summary>
      </ha-card>
    `}set hass(t){this._hass=t,this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a,r;await this._ensureSummaryLoaded(),await customElements.whenDefined("calorie-summary");let t=this.querySelector("calorie-summary");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(s=>s.startsWith("sensor.calorie_tracker_")&&s.includes("_profile")&&this.hass.states[s])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];t.hass=this.hass,t.profile=i,t.selectedDate=this.selectedDate||this._getLocalDateString(),this._applyGaugeOnlyStyles(t),!this._styleObserver&&t.renderRoot&&(this._styleObserver=new MutationObserver(()=>{this._applyGaugeOnlyStyles(t)}),this._styleObserver.observe(t.renderRoot,{childList:!0,subtree:!0}));try{let[s,n]=await Promise.all([this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_weekly_summary",entity_id:e,date:t.selectedDate}),this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:t.selectedDate})]);t.weeklySummary=(a=s==null?void 0:s.weekly_summary)!=null?a:{},t.weight=(r=n==null?void 0:n.weight)!=null?r:null}catch(s){console.error("Failed to fetch calorie data:",s)}this._eventsAttached||(t.addEventListener("select-summary-date",s=>{this.selectedDate=s.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyGaugeOnlyStyles(t){if(!(t!=null&&t.renderRoot))return;let e=t.renderRoot.querySelector(".bar-graph-section");e&&(e.style.display="none");let i=t.renderRoot.querySelector(".gauge-labels");i&&(i.style.display="none");let a=t.renderRoot.querySelector(".summary-container");a&&(a.style.justifyContent="center",a.style.alignItems="center",a.style.height="100%",a.style.maxWidth="none");let r=t.renderRoot.querySelector(".gauge-section");r&&(r.style.width="100%",r.style.flex="1",r.style.maxWidth="none");let s=t.renderRoot.querySelector(".gauge-container");s&&(s.style.width="100%",s.style.height="auto",s.style.aspectRatio="1 / 1",s.style.maxWidth=this.maxHeight,s.style.maxHeight=this.maxHeight);let n=t.renderRoot.querySelector(".gauge-container svg");n&&(n.style.width="100%",n.style.height="100%",n.style.maxWidth="none",n.style.maxHeight="none"),t.style&&(t.style.height="100%",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center")}disconnectedCallback(){this._styleObserver&&(this._styleObserver.disconnect(),this._styleObserver=null)}};customElements.get("calorie-gauge-card")||customElements.define("calorie-gauge-card",_t);window.customCards=window.customCards||[];window.customCards.push({type:"calorie-gauge-card",name:"Calorie Gauge",description:"A compact gauge-only view for the Calorie Tracker summary",editor:"calorie-gauge-editor",preview:!0});var At=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelectorAll("paper-input")[1],a=this.querySelector(".error"),r=()=>{let s=T({},this._config);t&&t.value?s.title=t.value.trim():delete s.title,e&&e.value?s.profile_entity_id=e.value:delete s.profile_entity_id,i&&i.value?s.max_height=i.value.trim():delete s.max_height,s.profile_entity_id?a&&(a.style.display="none"):a&&(a.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s}}))};t&&t.addEventListener("value-changed",r),e&&e.addEventListener("value-changed",r),i&&i.addEventListener("value-changed",r)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("calorie-gauge-editor")||customElements.define("calorie-gauge-editor",At);_t.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}}]}};_t.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}}});var Bt=K(()=>{var nt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var a;let i=(a=this.translations)==null?void 0:a[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,s)=>Object.prototype.hasOwnProperty.call(i,s)?String(i[s]):`{${s}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="protein-gauge-wrapper">
          <div class="protein-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="protein-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a,r,s;let t=this.querySelector(".protein-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyProteinStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),l=(a=n==null?void 0:n.weight)!=null?a:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(s=n==null?void 0:n.macros)!=null?s:{},c=Math.round(h.p||h.protein||0),F=this._profile&&this._profile.attributes||{},I=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(y,f,k)=>Number.isFinite(y)?!f||!k||f===k?y:f==="kg"&&k==="lbs"?y*2.20462:f==="lbs"&&k==="kg"?y/2.20462:y:null,_=Number.isFinite(I)?I:null;!Number.isFinite(_)&&Number.isFinite(l)&&(_=$(Number(l),d||M,M));let S=Number.isFinite(_)?_:null,L=Number.isFinite(_)?M==="kg"?_*2.20462:_:null,v=y=>y==null?null:y<5&&S!==null?Math.round(y*S):y,g=v(this.min),q=v(this.max),D=L!=null?L:150,E=Math.ceil(D/10)*10;(!Number.isFinite(E)||E<=0)&&(E=150),q!==null&&(E=q),this._gaugeMax=E,this._gaugeMin=g!==null?g:0,this._proteinValue=c,this._proteinWeight=L||0,this._proteinMin=g,this._proteinMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch protein data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyProteinStyles(t){if(!t)return;let e=t.querySelector(".protein-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("protein-gauge-card")||customElements.define("protein-gauge-card",nt);window.customCards=window.customCards||[];window.customCards.push({type:"protein-gauge-card",name:"Calorie Tracker: Protein Gauge",description:"Displays a protein gauge for the Calorie Tracker integration",editor:"protein-gauge-editor",preview:!0});var Tt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],a=t[2],r=t[3],s=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),l=()=>{let c=T({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,s&&s.value?c.profile_entity_id=s.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,a&&a.value?c.min=Number(a.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",l)),s&&s.addEventListener("value-changed",l)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("protein-gauge-editor")||customElements.define("protein-gauge-editor",Tt);nt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};nt.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};nt.prototype._renderGauge=function(){let p=this.querySelector(".protein-svg");if(!p)return;let t=Math.max(0,this._proteinValue||0),e=this._proteinMin,i=this._proteinMax,a=this._gaugeMax||100,r=i!==null?i*1.1:a*1.1,s={x:70,y:70},n=40,l=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),I=d+F*c,M=o=>o*Math.PI/180,$=(o,m,x)=>{let w=M(o),H=M(m),N=s.x+x*Math.cos(w),R=s.y+x*Math.sin(w),W=s.x+x*Math.cos(H),j=s.y+x*Math.sin(H),G=Math.abs(m-o)>180?1:0;return`M ${N} ${R} A ${x} ${x} 0 ${G} 1 ${W} ${j}`},_=8,S=[5,10,25,50,100,200],L=S[0];for(let o of S)if(r/o<=_){L=o;break}let v=[];for(let o=0;o<=r;o+=L){let m=o/r,x=d+m*c,w=M(x),H=n+5,N=n+12,R=n+20,W=s.x+H*Math.cos(w),j=s.y+H*Math.sin(w),G=s.x+N*Math.cos(w),Y=s.y+N*Math.sin(w),Z=s.x+R*Math.cos(w),z=s.y+R*Math.sin(w);v.push({line:`M ${W} ${j} L ${G} ${Y}`,label:{x:Z,y:z,value:o}})}let g=[];if(e===null&&i===null)g.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let o=e/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#ffeb3b"}),g.push({startAngle:m,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let o=i/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#4caf50"}),g.push({startAngle:m,endAngle:h,color:"#f44336"})}else{let o=e/r,m=i/r,x=d+o*c,w=d+m*c;g.push({startAngle:d,endAngle:x,color:"#ffeb3b"}),g.push({startAngle:x,endAngle:w,color:"#4caf50"}),g.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(I),D=n-5,E=s.x+D*Math.cos(q),y=s.y+D*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${l}"
        stroke-linecap="round"
      />
  `;g.forEach(o=>{k+=`
      <path
        d="${$(o.startAngle,o.endAngle,n)}"
        fill="none"
        stroke="${o.color}"
        stroke-width="${l}"
        stroke-linecap="round"
      />
    `}),v.forEach(o=>{k+=`
      <path
        d="${o.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),v.forEach(o=>{k+=`
      <text
        x="${o.label.x}"
        y="${o.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${o.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${s.x}"
        y1="${s.y}"
        x2="${E}"
        y2="${y}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${s.x}"
        cy="${s.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${s.x}"
        y="${s.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("protein","Protein")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Vt=K(()=>{var ot=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var a;let i=(a=this.translations)==null?void 0:a[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,s)=>Object.prototype.hasOwnProperty.call(i,s)?String(i[s]):`{${s}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="fat-gauge-wrapper">
          <div class="fat-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="fat-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a,r,s;let t=this.querySelector(".fat-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyFatStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),l=(a=n==null?void 0:n.weight)!=null?a:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(s=n==null?void 0:n.macros)!=null?s:{},c=Math.round(h.f||h.fat||0),F=this._profile&&this._profile.attributes||{},I=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(y,f,k)=>Number.isFinite(y)?!f||!k||f===k?y:f==="kg"&&k==="lbs"?y*2.20462:f==="lbs"&&k==="kg"?y/2.20462:y:null,_=Number.isFinite(I)?I:null;!Number.isFinite(_)&&Number.isFinite(l)&&(_=$(Number(l),d||M,M));let S=Number.isFinite(_)?_:null,L=Number.isFinite(_)?M==="kg"?_*2.20462:_:null,v=y=>y==null?null:y<5&&S!==null?Math.round(y*S):y,g=v(this.min),q=v(this.max),D=L!=null?L:150,E=Math.ceil(D*.36/10)*10;(!Number.isFinite(E)||E<=0)&&(E=80),q!==null&&(E=q),this._gaugeMax=E,this._gaugeMin=g!==null?g:0,this._fatValue=c,this._fatWeight=L||0,this._fatMin=g,this._fatMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch fat data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyFatStyles(t){if(!t)return;let e=t.querySelector(".fat-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("fat-gauge-card")||customElements.define("fat-gauge-card",ot);window.customCards=window.customCards||[];window.customCards.push({type:"fat-gauge-card",name:"Calorie Tracker: Fat Gauge",description:"Displays a fat gauge for the Calorie Tracker integration",editor:"fat-gauge-editor",preview:!0});var qt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],a=t[2],r=t[3],s=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),l=()=>{let c=T({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,s&&s.value?c.profile_entity_id=s.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,a&&a.value?c.min=Number(a.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",l)),s&&s.addEventListener("value-changed",l)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("fat-gauge-editor")||customElements.define("fat-gauge-editor",qt);ot.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};ot.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};ot.prototype._renderGauge=function(){let p=this.querySelector(".fat-svg");if(!p)return;let t=Math.max(0,this._fatValue||0),e=this._fatMin,i=this._fatMax,a=this._gaugeMax||100,r=i!==null?i*1.1:a*1.1,s={x:70,y:70},n=40,l=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),I=d+F*c,M=o=>o*Math.PI/180,$=(o,m,x)=>{let w=M(o),H=M(m),N=s.x+x*Math.cos(w),R=s.y+x*Math.sin(w),W=s.x+x*Math.cos(H),j=s.y+x*Math.sin(H),G=Math.abs(m-o)>180?1:0;return`M ${N} ${R} A ${x} ${x} 0 ${G} 1 ${W} ${j}`},_=8,S=[5,10,25,50,100,200],L=S[0];for(let o of S)if(r/o<=_){L=o;break}let v=[];for(let o=0;o<=r;o+=L){let m=o/r,x=d+m*c,w=M(x),H=n+5,N=n+12,R=n+20,W=s.x+H*Math.cos(w),j=s.y+H*Math.sin(w),G=s.x+N*Math.cos(w),Y=s.y+N*Math.sin(w),Z=s.x+R*Math.cos(w),z=s.y+R*Math.sin(w);v.push({line:`M ${W} ${j} L ${G} ${Y}`,label:{x:Z,y:z,value:o}})}let g=[];if(e===null&&i===null)g.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let o=e/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#ffeb3b"}),g.push({startAngle:m,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let o=i/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#4caf50"}),g.push({startAngle:m,endAngle:h,color:"#f44336"})}else{let o=e/r,m=i/r,x=d+o*c,w=d+m*c;g.push({startAngle:d,endAngle:x,color:"#ffeb3b"}),g.push({startAngle:x,endAngle:w,color:"#4caf50"}),g.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(I),D=n-5,E=s.x+D*Math.cos(q),y=s.y+D*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${l}"
        stroke-linecap="round"
      />
  `;g.forEach(o=>{k+=`
      <path
        d="${$(o.startAngle,o.endAngle,n)}"
        fill="none"
        stroke="${o.color}"
        stroke-width="${l}"
        stroke-linecap="round"
      />
    `}),v.forEach(o=>{k+=`
      <path
        d="${o.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),v.forEach(o=>{k+=`
      <text
        x="${o.label.x}"
        y="${o.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${o.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${s.x}"
        y1="${s.y}"
        x2="${E}"
        y2="${y}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${s.x}"
        cy="${s.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${s.x}"
        y="${s.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("fat","Fat")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Xt=K(()=>{var lt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var a;let i=(a=this.translations)==null?void 0:a[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,s)=>Object.prototype.hasOwnProperty.call(i,s)?String(i[s]):`{${s}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._renderGauge()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px",this.min=typeof t.min=="number"?t.min:null,this.max=typeof t.max=="number"?t.max:null,this.innerHTML=`
      <ha-card>
        ${this.title&&this.title.trim()?`<div class="card-header">${this.title}</div>`:""}
        <div class="carbs-gauge-wrapper">
          <div class="carbs-gauge" style="display:flex;flex-direction:column;align-items:center;">
            <svg class="carbs-svg" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;max-width:${this.maxHeight};max-height:${this.maxHeight};"></svg>
          </div>
        </div>
      </ha-card>
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a,r,s;let t=this.querySelector(".carbs-gauge");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(n=>n.startsWith("sensor.calorie_tracker_")&&this.hass.states[n])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyCarbsStyles(t);try{let n=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),l=(a=n==null?void 0:n.weight)!=null?a:null,d=(r=n==null?void 0:n.weight_unit)!=null?r:null,h=(s=n==null?void 0:n.macros)!=null?s:{},c=Math.round(h.c||h.carbs||0),F=this._profile&&this._profile.attributes||{},I=Number(F.current_weight),M=F.weight_unit||d||"lbs",$=(y,f,k)=>Number.isFinite(y)?!f||!k||f===k?y:f==="kg"&&k==="lbs"?y*2.20462:f==="lbs"&&k==="kg"?y/2.20462:y:null,_=Number.isFinite(I)?I:null;!Number.isFinite(_)&&Number.isFinite(l)&&(_=$(Number(l),d||M,M));let S=Number.isFinite(_)?_:null,L=Number.isFinite(_)?M==="kg"?_*2.20462:_:null,v=y=>y==null?null:y<5&&S!==null?Math.round(y*S):y,g=v(this.min),q=v(this.max),D=L!=null?L:150,E=Math.ceil(D*1.36/10)*10;(!Number.isFinite(E)||E<=0)&&(E=200),q!==null&&(E=q),this._gaugeMax=E,this._gaugeMin=g!==null?g:0,this._carbsValue=c,this._carbsWeight=L||0,this._carbsMin=g,this._carbsMax=q,this._renderGauge()}catch(n){console.error("Failed to fetch carbs data:",n)}this._eventsAttached||(t.addEventListener("select-summary-date",n=>{this.selectedDate=n.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyCarbsStyles(t){if(!t)return;let e=t.querySelector(".carbs-svg");e&&(e.style.width="100%",e.style.height="auto",e.style.maxWidth=this.maxHeight,e.style.maxHeight=this.maxHeight)}};customElements.get("carbs-gauge-card")||customElements.define("carbs-gauge-card",lt);window.customCards=window.customCards||[];window.customCards.push({type:"carbs-gauge-card",name:"Calorie Tracker: Carbs Gauge",description:"Displays a carbs gauge for the Calorie Tracker integration",editor:"carbs-gauge-editor",preview:!0});var Dt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){var d,h;this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (e.g. 400px)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <paper-input label="Min (optional, grams or fraction)" value="${this._escape((d=this._config.min)!=null?d:"")}"></paper-input>
        <paper-input label="Max (optional, grams or fraction)" value="${this._escape((h=this._config.max)!=null?h:"")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelectorAll("paper-input"),e=t[0],i=t[1],a=t[2],r=t[3],s=this.querySelector("ha-entity-picker"),n=this.querySelector(".error"),l=()=>{let c=T({},this._config);e&&e.value?c.title=e.value.trim():delete c.title,s&&s.value?c.profile_entity_id=s.value:delete c.profile_entity_id,i&&i.value?c.max_height=i.value.trim():delete c.max_height,a&&a.value?c.min=Number(a.value):delete c.min,r&&r.value?c.max=Number(r.value):delete c.max,c.profile_entity_id?n&&(n.style.display="none"):n&&(n.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}}))};t.forEach(c=>c.addEventListener("value-changed",l)),s&&s.addEventListener("value-changed",l)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("carbs-gauge-editor")||customElements.define("carbs-gauge-editor",Dt);lt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}},{name:"min",selector:{number:{}}},{name:"max",selector:{number:{}}}]}};lt.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};lt.prototype._renderGauge=function(){let p=this.querySelector(".carbs-svg");if(!p)return;let t=Math.max(0,this._carbsValue||0),e=this._carbsMin,i=this._carbsMax,a=this._gaugeMax||100,r=i!==null?i*1.1:a*1.1,s={x:70,y:70},n=40,l=8,d=-180,h=0,c=h-d,F=Math.max(Math.min(t/r,1),0),I=d+F*c,M=o=>o*Math.PI/180,$=(o,m,x)=>{let w=M(o),H=M(m),N=s.x+x*Math.cos(w),R=s.y+x*Math.sin(w),W=s.x+x*Math.cos(H),j=s.y+x*Math.sin(H),G=Math.abs(m-o)>180?1:0;return`M ${N} ${R} A ${x} ${x} 0 ${G} 1 ${W} ${j}`},_=8,S=[5,10,25,50,100,200],L=S[0];for(let o of S)if(r/o<=_){L=o;break}let v=[];for(let o=0;o<=r;o+=L){let m=o/r,x=d+m*c,w=M(x),H=n+5,N=n+12,R=n+20,W=s.x+H*Math.cos(w),j=s.y+H*Math.sin(w),G=s.x+N*Math.cos(w),Y=s.y+N*Math.sin(w),Z=s.x+R*Math.cos(w),z=s.y+R*Math.sin(w);v.push({line:`M ${W} ${j} L ${G} ${Y}`,label:{x:Z,y:z,value:o}})}let g=[];if(e===null&&i===null)g.push({startAngle:d,endAngle:h,color:"#4caf50"});else if(e!==null&&i===null){let o=e/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#ffeb3b"}),g.push({startAngle:m,endAngle:h,color:"#4caf50"})}else if(e===null&&i!==null){let o=i/r,m=d+o*c;g.push({startAngle:d,endAngle:m,color:"#4caf50"}),g.push({startAngle:m,endAngle:h,color:"#f44336"})}else{let o=e/r,m=i/r,x=d+o*c,w=d+m*c;g.push({startAngle:d,endAngle:x,color:"#ffeb3b"}),g.push({startAngle:x,endAngle:w,color:"#4caf50"}),g.push({startAngle:w,endAngle:h,color:"#f44336"})}let q=M(I),D=n-5,E=s.x+D*Math.cos(q),y=s.y+D*Math.sin(q),f="#4caf50";e!==null&&i!==null?t<e?f="#ffeb3b":t>=e&&t<=i?f="#4caf50":f="#f44336":e!==null&&i===null?t<e?f="#ffeb3b":f="#4caf50":e===null&&i!==null&&(t<=i?f="#4caf50":f="#f44336");let k=`
    <svg viewBox="0 0 140 140" style="width: 100%; height: 100%;">
      <!-- Background arc -->
      <path
        d="${$(d,h,n)}"
        fill="none"
        stroke="#eee"
        stroke-width="${l}"
        stroke-linecap="round"
      />
  `;g.forEach(o=>{k+=`
      <path
        d="${$(o.startAngle,o.endAngle,n)}"
        fill="none"
        stroke="${o.color}"
        stroke-width="${l}"
        stroke-linecap="round"
      />
    `}),v.forEach(o=>{k+=`
      <path
        d="${o.line}"
        stroke="var(--secondary-text-color, #666)"
        stroke-width="1"
      />
    `}),v.forEach(o=>{k+=`
      <text
        x="${o.label.x}"
        y="${o.label.y}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="9"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        fill="var(--secondary-text-color, #666)"
      >
        ${o.label.value}
      </text>
    `}),k+=`
      <!-- Needle -->
      <line
        x1="${s.x}"
        y1="${s.y}"
        x2="${E}"
        y2="${y}"
        stroke="var(--primary-text-color, #333)"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle
        cx="${s.x}"
        cy="${s.y}"
        r="3"
        fill="var(--primary-text-color, #333)"
      />

      <!-- Current value label -->
      <text
        x="${s.x}"
        y="${s.y+n-5}"
        text-anchor="middle"
        font-size="12"
        font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
        font-weight="600"
        fill="${f}"
      >
        ${this._tf("macro_value_label","{value} g {macro}",{value:Math.round(t),macro:this._t("carbs","Carbs")})}
      </text>

    </svg>
  `,p.innerHTML=k}});var Kt=K(()=>{var ct=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this.maxHeight="400px",this.translations={},this._translationsRequestedLang=null}_t(t,e){var a;let i=(a=this.translations)==null?void 0:a[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,s)=>Object.prototype.hasOwnProperty.call(i,s)?String(i[s]):`{${s}}`)}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._applyStaticText(),this._renderPieChart()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}_applyStaticText(){let t=this.querySelector(".protein-text"),e=this.querySelector(".carbs-text"),i=this.querySelector(".fat-text"),a=this.querySelector(".alcohol-text"),r=this.querySelector(".chart-label");if(t&&(t.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("protein","Protein")})),e&&(e.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("carbs","Carbs")})),i&&(i.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("fat","Fat")})),a&&(a.textContent=this._tf("macro_legend_value","{macro}: --g (--)",{macro:this._t("alcohol","Alcohol")})),r&&(r.textContent=this._t("percent_of_total_calories","Percent of Total Calories")),!this.title||!this.title.trim()){let s=this.querySelector(".card-header");s&&(s.textContent=this._t("percent_of_total_calories","Percent of Total Calories"))}}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.maxHeight=t.max_height||"400px";let e=this.title&&this.title.trim()?this.title:this._t("percent_of_total_calories","Percent of Total Calories");this.innerHTML=`
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
    `}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}_getLocalDateString(t=new Date){let e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}async _updateCard(){var a;let t=this.querySelector(".macro-percentages");if(!t||!this.hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this.hass.states).find(r=>r.startsWith("sensor.calorie_tracker_")&&this.hass.states[r])),!e){console.warn("No calorie tracker profile entity found");return}if(!this.hass.states[e]){console.error(`Entity not found: ${e}`);return}let i=this.hass.states[e];this._profile=i,this._selectedDate=this.selectedDate||this._getLocalDateString(),this._applyMacroStyles(t);try{let r=await this.hass.connection.sendMessagePromise({type:"calorie_tracker/get_daily_data",entity_id:e,date:this._selectedDate}),s=(a=r==null?void 0:r.macros)!=null?a:{},n=Math.round(s.p||s.protein||0),l=Math.round(s.c||s.carbs||0),d=Math.round(s.f||s.fat||0),h=Math.round(s.a||s.alcohol||0),c=n*4,F=l*4,I=d*9,M=h*7,$=c+F+I+M;this._proteinGrams=n,this._carbsGrams=l,this._fatGrams=d,this._alcoholGrams=h,this._proteinCals=c,this._carbsCals=F,this._fatCals=I,this._alcoholCals=M,this._totalCals=$,this._renderPieChart()}catch(r){console.error("Failed to fetch macro data:",r)}this._eventsAttached||(t.addEventListener("select-summary-date",r=>{this.selectedDate=r.detail.date,this._updateCard()}),t.addEventListener("refresh-summary",()=>{this._updateCard()}),this._eventsAttached=!0)}_applyMacroStyles(t){if(!t)return;let e=t.querySelector(".pie-svg");e&&(e.style.width="150px",e.style.height="150px")}};customElements.get("macro-percentages-card")||customElements.define("macro-percentages-card",ct);window.customCards=window.customCards||[];window.customCards.push({type:"macro-percentages-card",name:"Calorie Tracker Macro Pie Chart",description:"Shows macro percentage breakdown (protein/carbs/fat) for Calorie Tracker",editor:"macro-percentages-editor",preview:!0});var Ft=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={}),this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"Percent of Total Calories")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <paper-input label="Max height (optional)" value="${this._escape(this._config.max_height||"400px")}"></paper-input>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let t=this.querySelector("paper-input"),e=this.querySelector("ha-entity-picker"),i=this.querySelectorAll("paper-input")[1],a=this.querySelector(".error"),r=()=>{let s=T({},this._config);t&&t.value?s.title=t.value.trim():delete s.title,e&&e.value?s.profile_entity_id=e.value:delete s.profile_entity_id,i&&i.value?s.max_height=i.value.trim():delete s.max_height,s.profile_entity_id?a&&(a.style.display="none"):a&&(a.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s}}))};t&&t.addEventListener("value-changed",r),e&&e.addEventListener("value-changed",r),i&&i.addEventListener("value-changed",r)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("macro-percentages-editor")||customElements.define("macro-percentages-editor",Ft);ct.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"max_height",selector:{text:{}}}]}};ct.getStubConfig=function(){return{profile_entity_id:"",max_height:"400px"}};ct.prototype._renderPieChart=function(){let p=this.querySelector(".pie-svg");if(!p)return;let t=this._proteinCals||0,e=this._carbsCals||0,i=this._fatCals||0,a=this._alcoholCals||0,r=this._totalCals||1,s=this._proteinGrams||0,n=this._carbsGrams||0,l=this._fatGrams||0,d=this._alcoholGrams||0,h=r>0?Math.round(t/r*100):0,c=r>0?Math.round(e/r*100):0,F=r>0?Math.round(i/r*100):0,I=r>0?Math.round(a/r*100):0,M=this.querySelector(".protein-text"),$=this.querySelector(".carbs-text"),_=this.querySelector(".fat-text"),S=this.querySelector(".alcohol-text");M&&(M.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("protein","Protein"),grams:s,percent:h})),$&&($.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("carbs","Carbs"),grams:n,percent:c})),_&&(_.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("fat","Fat"),grams:l,percent:F})),S&&(S.textContent=this._tf("macro_legend_detail","{macro}: {grams}g ({percent}%)",{macro:this._t("alcohol","Alcohol"),grams:d,percent:I}));let L=100,v=100,g=70,q={protein:"#4CAF50",carbs:"#2196F3",fat:"#FF9800",alcohol:"#9C27B0"},D=-90,E=[];if(r>0){if(t>0){let o=t/r*360;E.push({startAngle:D,endAngle:D+o,color:q.protein,label:"Protein"}),D+=o}if(e>0){let o=e/r*360;E.push({startAngle:D,endAngle:D+o,color:q.carbs,label:"Carbs"}),D+=o}if(i>0){let o=i/r*360;E.push({startAngle:D,endAngle:D+o,color:q.fat,label:"Fat"}),D+=o}if(a>0){let o=a/r*360;E.push({startAngle:D,endAngle:D+o,color:q.alcohol,label:"Alcohol"})}}let y=o=>o*Math.PI/180,f=(o,m)=>{let x=y(o),w=y(m),H=L+g*Math.cos(x),N=v+g*Math.sin(x),R=L+g*Math.cos(w),W=v+g*Math.sin(w),j=Math.abs(m-o)>180?1:0;return`M ${L} ${v} L ${H} ${N} A ${g} ${g} 0 ${j} 1 ${R} ${W} Z`},k='<svg viewBox="0 0 200 200" style="width: 100%; height: 100%;">';r===0||E.length===0?k+=`
      <circle cx="${L}" cy="${v}" r="${g}"
              fill="none" stroke="#eee" stroke-width="2"/>
      <text x="${L}" y="${v}" text-anchor="middle"
            font-family="var(--mdc-typography-font-family, 'Roboto', 'Noto', sans-serif)"
            font-size="14" fill="var(--secondary-text-color, #666)">${this._t("no_data","No Data")}</text>
    `:E.forEach(o=>{k+=`
        <path d="${f(o.startAngle,o.endAngle)}"
              fill="${o.color}"
              stroke="#fff"
              stroke-width="1"/>
      `}),k+="</svg>",p.innerHTML=k}});var Ut=K(()=>{var yt=class extends HTMLElement{constructor(){super(),this._eventsAttached=!1,this._range="1m",this._weightData=[],this._lastGoalStartDate=null,this._resizeObserver=null,this.ranges=["2w","1m","2m","4m","6m","1y","goal","all"],this.translations={},this._translationsRequestedLang=null}_t(t,e){var a;let i=(a=this.translations)==null?void 0:a[t];return typeof i=="string"&&i.length>0?i:e}_tf(t,e,i={}){return this._t(t,e).replace(/\{(\w+)\}/g,(r,s)=>Object.prototype.hasOwnProperty.call(i,s)?String(i[s]):`{${s}}`)}_getLocale(){var t,e,i;return((e=(t=this._hass)==null?void 0:t.locale)==null?void 0:e.language)||((i=this._hass)==null?void 0:i.language)||void 0}_getRangeLabel(t){return{"2w":this._t("range_last_2_weeks","Last 2 weeks"),"1m":this._t("range_last_month","Last month"),"2m":this._t("range_last_2_months","Last 2 months"),"4m":this._t("range_last_4_months","Last 4 months"),"6m":this._t("range_last_6_months","Last 6 months"),"1y":this._t("range_last_year","Last year"),goal:this._t("range_since_last_goal","Since last goal"),all:this._t("range_all","All")}[t]||t}_getRangeOptions(){return this.ranges.map(t=>({value:t,label:this._getRangeLabel(t)}))}async _loadTranslationsForLanguage(t){var e;if((e=this._hass)!=null&&e.connection)try{let i=await this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_translations",language:t,namespace:"frontend.cards"});this.translations=(i==null?void 0:i.translations)||{},this._translationsRequestedLang=t,this._refreshRangeSelectOptions(),this._renderChart()}catch(i){this.translations=this.translations||{},this._translationsRequestedLang=t}}_refreshRangeSelectOptions(){let t=this.querySelector(".weight-range-select");if(!t)return;let e=t.value||this._range;t.innerHTML=this._getRangeOptions().map(i=>`<option value='${i.value}'>${i.label}</option>`).join(""),t.value=e}setConfig(t){this.config=t||{},this.profileEntityId=t.profile_entity_id||null,this.title=typeof t.title=="string"?t.title:"",this.innerHTML=`
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
    `,this._syncLastGoalRangeAvailability()}set hass(t){var i;this._hass=t;let e=((i=t==null?void 0:t.locale)==null?void 0:i.language)||(t==null?void 0:t.language)||"en";this._translationsRequestedLang!==e&&this._loadTranslationsForLanguage(e),this._updateCard()}get hass(){return this._hass}async _updateCard(){let t=this.querySelector(".weight-chart");if(!t||!this._hass)return;let e=this.profileEntityId;if(e||(e=Object.keys(this._hass.states).find(i=>i.startsWith("sensor.calorie_tracker_")&&this._hass.states[i])),!e){t.innerHTML=`<div>${this._t("no_profile_entity_found","No calorie tracker profile entity found")}</div>`;return}try{let i=this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_weight_history",entity_id:e}),a=this._hass.connection.sendMessagePromise({type:"calorie_tracker/get_goals",entity_id:e}).catch(()=>null),[r,s]=await Promise.all([i,a]);this._weightData=r.weight_history||[],this._lastGoalStartDate=this._extractLastGoalStartDate(s&&Array.isArray(s.goals)?s.goals:null),this._syncLastGoalRangeAvailability(),this._renderChart()}catch(i){this._lastGoalStartDate=null,this._syncLastGoalRangeAvailability(),t.innerHTML=`<div>${this._t("failed_fetch_weight_data","Failed to fetch weight data")}</div>`}if(!this._eventsAttached){let i=this.querySelector(".weight-range-select");i&&(i.value=this._range,i.addEventListener("change",r=>{if(this._range=r.target.value,this._range==="goal"&&!this._lastGoalStartDate){this._range="1m",i.value=this._range;return}this._renderChart()}));let a=this.querySelector(".weight-chart");a&&window.ResizeObserver&&(this._resizeObserver=new ResizeObserver(()=>{this._renderChart()}),this._resizeObserver.observe(a)),this._eventsAttached=!0}}disconnectedCallback(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null)}_filterDataByRange(t,e){if(!t||!Array.isArray(t)||t.length===0)return[];if(e==="all")return t;if(e==="goal"){if(!this._lastGoalStartDate)return[];let r=this._lastGoalStartDate;return t.filter(s=>!s||typeof s.date!="string"?!1:s.date.slice(0,10)>=r)}let i=new Date,a;switch(e){case"2w":a=new Date(i),a.setDate(i.getDate()-13);break;case"1m":a=new Date(i),a.setMonth(i.getMonth()-1);break;case"2m":a=new Date(i),a.setMonth(i.getMonth()-2);break;case"4m":a=new Date(i),a.setMonth(i.getMonth()-4);break;case"6m":a=new Date(i),a.setMonth(i.getMonth()-6);break;case"1y":a=new Date(i),a.setFullYear(i.getFullYear()-1);break;default:return t}return t.filter(r=>new Date(r.date)>=a)}_renderChart(){let t=this.querySelector(".weight-chart"),e=this.querySelector(".legend-items");t&&requestAnimationFrame(()=>{this._doRenderChart(t,e)})}_doRenderChart(t,e){if(!t)return;let i=this._filterDataByRange(this._weightData,this._range);if(!i.length||i.length<2){let u=this._t("no_weight_data_for_range","No weight data available for this range.");this._range==="goal"&&(u=this._lastGoalStartDate?this._t("need_more_weight_entries_since_goal","Need more weight entries since your last goal to display progress."):this._t("set_goal_to_track_progress","Set a goal to track progress from your most recent goal start date.")),t.innerHTML=`<div>${u}</div>`,e&&(e.innerHTML="");return}let a=this.profileEntityId||this._hass&&Object.keys(this._hass.states).find(u=>u.startsWith("sensor.calorie_tracker_")),r=null,s=null,n="kg";if(a&&this._hass&&this._hass.states[a]){let u=this._hass.states[a].attributes||{},A=C=>{if(C==null)return null;let P=Number(C);return Number.isFinite(P)?P:null};r=A(u.starting_weight),s=A(u.goal_weight),n=u.weight_unit||"kg"}let l=400,d=260,h=40,c=i.map(u=>new Date(u.date)),F=i.map(u=>u.weight),I=Math.min(...F),M=Math.max(...F),$=c[0],_=c[c.length-1],S=1440*60*1e3,L=Math.max((_-$)/S,1),v=(()=>{if(c.length<2)return null;let u=c.map(V=>(V.getTime()-$.getTime())/S),A=F,C=u.length,P=0,O=0,X=0,J=0;for(let V=0;V<C;V++){let tt=u[V],gt=A[V];P+=tt,O+=gt,X+=tt*gt,J+=tt*tt}let ut=C*J-P*P;if(Math.abs(ut)<1e-9)return null;let Q=(C*X-P*O)/ut,et=(O-Q*P)/C,Mt=O/C,it=0,rt=0;for(let V=0;V<C;V++){let tt=et+Q*u[V],gt=A[V];it+=(gt-Mt)**2,rt+=(gt-tt)**2}let wt=it>0?1-rt/it:1;return{slope:Q,intercept:et,weightAt:V=>{let tt=(V.getTime()-$.getTime())/S;return et+Q*tt},rSquared:wt}})(),g=0,q=_,D=null,E=!1;if(v){let u=v.slope,A=L,C=v.weightAt(_),P=A;if(s!==null&&Math.abs(u)>1e-6){let O=(s-C)/u;O>=0&&(E=!0,D=O,P=Math.min(P,O))}Math.abs(u)>1e-6&&(g=Math.max(0,P),g>0&&(q=new Date(_.getTime()+g*S)))}let y=g>0?q:_,f=$.getTime(),k=y.getTime(),o=u=>h+(u.getTime()-f)/Math.max(k-f,1)*(l-2*h),m=I,x=M;if(s!==null&&(m=Math.min(m,s),x=Math.max(x,s)),v&&g>0){let u=v.weightAt(q);m=Math.min(m,u),x=Math.max(x,u)}let w=x-m||1,H=.15,N=m-w*H,R=x+w*H,W=r!==null&&r>=N&&r<=R,j=s!==null&&s>=N&&s<=R;if(e){let u="";if(r!==null){let A=W?"":r>R?" \u2191":" \u2193";u+=`<div style="display:flex;align-items:center;"><div style="width:12px;height:2px;background:#ff9800;margin-right:4px;border-style:dashed;border-width:1px 0;border-color:#ff9800;"></div><span style="font-size:12px;">${this._t("start","Start")}: ${r}${A}</span></div>`}if(s!==null){let A=j?"":s>R?" \u2191":" \u2193";u+=`<div style="display:flex;align-items:center;"><div style="width:12px;height:2px;background:#8bc34a;margin-right:4px;border-style:dashed;border-width:1px 0;border-color:#8bc34a;"></div><span style="font-size:12px;">${this._t("goal","Goal")}: ${s}${A}</span></div>`}e.innerHTML=u}let G=this.querySelector(".weight-prediction");if(G)if(!v)G.style.display="none";else{let u=v.slope*7,A=u>=0?`+${u.toFixed(2)}`:u.toFixed(2),C=v.rSquared>.8?"high":v.rSquared>.5?"medium":"low",P=C==="high"?this._t("confidence_high","high"):C==="medium"?this._t("confidence_medium","medium"):this._t("confidence_low","low"),O=C==="high"?"var(--success-color, #4caf50)":C==="medium"?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)",X=`<strong>${this._t("trend","Trend")}:</strong> ${A} ${n}/${this._t("week","week")} <span style="color:${O};font-weight:bold;">(${P} ${this._t("confidence","confidence")})</span>`;if(s===null)X+=`<br/><em>${this._t("set_goal_weight_to_predict","Set a goal weight to see a predicted goal date.")}</em>`;else if(Math.abs(v.slope)<1e-6)X+=`<br/><em>${this._t("trend_flat_unable_project","Trend is flat, unable to project goal date.")}</em>`;else if(!E)X+=`<br/><em>${this._t("trend_moving_away_goal","Trend is moving away from the goal weight.")}</em>`;else if(D!==null&&Number.isFinite(D)){let J=new Date(_.getTime()+D*S),Q=Math.round((J-new Date)/S),et=J.toLocaleDateString(this._getLocale(),{month:"short",day:"numeric",year:"numeric"});X+=`<br/><strong>${this._t("goal_projection","Goal projection")}:</strong> ${et} (${this._tf("days_remaining","{days} days",{days:Q})})`}else X+=`<br/><em>${this._t("unable_calculate_goal_projection","Unable to calculate goal projection.")}</em>`;G.innerHTML=X,G.style.display="block"}let Y=u=>d-h-(u-N)/(R-N)*(d-2*h),Z=i.map(u=>[o(new Date(u.date)),Y(u.weight)]),z=`<svg viewBox='0 0 ${l} ${d}' preserveAspectRatio='xMidYMid meet' style='width:100%;height:auto;'>`,Ht=u=>{let A=u.getDate().toString().padStart(2,"0"),C=new Intl.DateTimeFormat(this._getLocale(),{month:"short"}).format(u);return`${A} ${C}`};for(let u=0;u<5;u++){let A=u/4,C=f+A*(k-f),P=new Date(C),O=o(P);z+=`<line x1='${O}' y1='${h}' x2='${O}' y2='${d-h}' stroke='#d0d0d0' stroke-width='0.5' stroke-dasharray='3,3' />`,z+=`<text x='${O}' y='${d-h+18}' font-size='11' fill='#888' text-anchor='middle'>${Ht(P)}</text>`}for(let u=0;u<5;u++){let A=u/4,C=N+A*(R-N),P=Y(C);z+=`<line x1='${h}' y1='${P}' x2='${l-h}' y2='${P}' stroke='#d0d0d0' stroke-width='0.5' stroke-dasharray='3,3' />`,z+=`<text x='${h-12}' y='${P+4}' font-size='11' fill='#888' text-anchor='end'>${C.toFixed(1)}</text>`}if(z+=`<polyline fill='none' stroke='#03a9f4' stroke-width='2' points='${Z.map(u=>u.join(",")).join(" ")}' />`,v){let u=$,A=_,C=o(u),P=Y(v.weightAt(u)),O=o(A),X=Y(v.weightAt(A));if(z+=`<line x1='${C}' y1='${P}' x2='${O}' y2='${X}' stroke='#9c27b0' stroke-width='2' opacity='0.9' />`,g>0){let J=_,ut=v.weightAt(J),Q=v.weightAt(q),et=o(J),Mt=Y(ut),it=o(q),rt=Y(Q);z+=`<line x1='${et}' y1='${Mt}' x2='${it}' y2='${rt}' stroke='#9c27b0' stroke-width='1.75' stroke-dasharray='8,6' opacity='0.6' />`,z+=`<circle cx='${it}' cy='${rt}' r='3.5' fill='#9c27b0' opacity='0.6' />`;let wt=q,zt=`${wt.getDate()} ${new Intl.DateTimeFormat(this._getLocale(),{month:"short"}).format(wt)}`;z+=`<text x='${it}' y='${rt-12}' font-size='10' fill='#9c27b0' text-anchor='middle' opacity='0.7'>${zt}</text>`}}if(Z.forEach((u,A)=>{z+=`<circle class='weight-point' data-index='${A}' cx='${u[0]}' cy='${u[1]}' r='4' fill='#03a9f4' stroke='#fff' stroke-width='1.5' style='cursor:pointer;' />`}),W){let u=Y(r);z+=`<line x1='${h}' y1='${u}' x2='${l-h}' y2='${u}' stroke='#ff9800' stroke-dasharray='4,2' stroke-width='1.5' />`}if(j){let u=Y(s);z+=`<line x1='${h}' y1='${u}' x2='${l-h}' y2='${u}' stroke='#8bc34a' stroke-dasharray='4,2' stroke-width='1.5' />`}if(r!==null&&!W){let u=r>R,A=u?h+5:d-h-5,C=u?"\u2191":"\u2193";z+=`<text x='${l-h-40}' y='${A}' font-size='12' fill='#ff9800' text-anchor='start'>${this._t("start","Start")} ${C}</text>`}if(s!==null&&!j){let u=s>R,A=u?h+5:d-h-5,C=u?"\u2191":"\u2193",P=r!==null&&!W&&s>R==r>R?80:40;z+=`<text x='${l-h-P}' y='${A}' font-size='12' fill='#8bc34a' text-anchor='start'>${this._t("goal","Goal")} ${C}</text>`}z+="</svg>",t.innerHTML=`<div style="position:relative;width:100%;">${z}<div class="weight-tooltip" style="position:absolute;display:none;background:rgba(0,0,0,0.8);color:white;padding:8px 12px;border-radius:4px;font-size:12px;pointer-events:none;z-index:1000;white-space:nowrap;"></div></div>`;let ht=t.querySelector(".weight-tooltip");t.querySelectorAll(".weight-point").forEach(u=>{u.addEventListener("mouseenter",A=>{let C=parseInt(A.target.getAttribute("data-index")),P=i[C],O=new Date(P.date);ht.innerHTML=`<div><strong>${Ht(O)}</strong></div><div>${P.weight} ${n}</div>`,ht.style.display="block"}),u.addEventListener("mousemove",A=>{let C=t.getBoundingClientRect();ht.style.left=A.clientX-C.left+10+"px",ht.style.top=A.clientY-C.top-10+"px"}),u.addEventListener("mouseleave",()=>{ht.style.display="none"})})}_extractLastGoalStartDate(t){if(!Array.isArray(t)||t.length===0)return null;let e=t.map(i=>{if(!i||typeof i.start_date!="string")return null;let a=i.start_date.trim();return a?a.slice(0,10):null}).filter(Boolean);return e.length?e.reduce((i,a)=>i&&i>a?i:a,null):null}_syncLastGoalRangeAvailability(){let t=this.querySelector(".weight-range-select");if(!t)return;let e=[...t.options].find(a=>a.value==="goal");if(!e)return;let i=!!this._lastGoalStartDate;if(e.disabled=!i,e.hidden=!i,i){let a=new Date(this._lastGoalStartDate);if(Number.isNaN(a.getTime()))e.textContent=this._t("range_since_last_goal","Since last goal");else{let r=a.toLocaleDateString(this._getLocale(),{month:"short",day:"numeric",year:"numeric"});e.textContent=this._tf("range_since_last_goal_with_date","Since last goal ({date})",{date:r})}}else e.textContent=this._t("range_since_last_goal","Since last goal"),this._range==="goal"&&(this._range="1m",t.value=this._range)}};customElements.get("weight-progress-card")||customElements.define("weight-progress-card",yt);window.customCards=window.customCards||[];window.customCards.push({type:"weight-progress-card",name:"Calorie Tracker: Weight Progress",description:"Displays weight history and progress for Calorie Tracker",editor:"weight-progress-editor",preview:!0});var Pt=class extends HTMLElement{setConfig(t){this._config=t||{},this._render()}set hass(t){this._hass=t,this._render()}_render(){this._config||(this._config={});let t=[["2w","Last 2 weeks"],["1m","Last month"],["2m","Last 2 months"],["4m","Last 4 months"],["6m","Last 6 months"],["1y","Last year"],["goal","Since last goal"],["all","All"]],e=this._config.default_range||"1m";this.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:8px;">
        <paper-input label="Title (optional)" value="${this._escape(this._config.title||"")}"></paper-input>
        <label style="font-size:12px;color:var(--secondary-text-color);">Profile entity (required)</label>
        <ha-entity-picker dialog-opp="right" include-domains="sensor" allow-custom-entity value="${this._escape(this._config.profile_entity_id||"")}"></ha-entity-picker>
        <label style="font-size:12px;color:var(--secondary-text-color);">Default range</label>
        <select>${t.map(l=>`<option value="${l[0]}" ${l[0]===e?"selected":""}>${l[1]}</option>`).join("")}</select>
        <div class="error" style="color:var(--error-color);display:none;">Profile entity is required</div>
      </div>
    `;let i=this.querySelector("paper-input"),a=this.querySelector("ha-entity-picker"),r=this.querySelector("select"),s=this.querySelector(".error"),n=()=>{let l=T({},this._config);i&&i.value?l.title=i.value.trim():delete l.title,a&&a.value?l.profile_entity_id=a.value:delete l.profile_entity_id,r&&r.value?l.default_range=r.value:delete l.default_range,l.profile_entity_id?s&&(s.style.display="none"):s&&(s.style.display="block"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:l}}))};i&&i.addEventListener("value-changed",n),a&&a.addEventListener("value-changed",n),r&&r.addEventListener("change",n)}_escape(t){return String(t).replace(/"/g,"&quot;")}};customElements.get("weight-progress-editor")||customElements.define("weight-progress-editor",Pt);yt.getConfigForm=function(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",required:!0,selector:{entity:{domain:"sensor",allow_custom_entity:!0}}},{name:"default_range",selector:{select:{options:[{value:"2w",label:"Last 2 weeks"},{value:"1m",label:"Last month"},{value:"2m",label:"Last 2 months"},{value:"4m",label:"Last 4 months"},{value:"6m",label:"Last 6 months"},{value:"1y",label:"Last year"},{value:"goal",label:"Since last goal"},{value:"all",label:"All"}]}}}]}};yt.getStubConfig=function(){return{profile_entity_id:"",default_range:"1m"}}});var ee=K(()=>{ie();var dt=[{key:"p",label:"Protein",short:"P"},{key:"c",label:"Carbs",short:"C"},{key:"f",label:"Fat",short:"F"}],Zt=/\s*\(([^()]*\d[^()]*)\)\s*$/,te=$t`
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
`;function at(p){if(p==null||p==="")return null;let t=Number(p);return Number.isFinite(t)?t:null}function Rt(p){return Math.round(p*10)/10}function Jt(p=new Date){let t=e=>String(e).padStart(2,"0");return`${p.getFullYear()}-${t(p.getMonth()+1)}-${t(p.getDate())}`}var kt={ml:1,l:1e3,tsp:4.92892,tbsp:14.7868,floz:29.5735,cup:236.588},Qt=[["cup","cup"],["tbsp","tbsp"],["tsp","tsp"],["floz","fl oz"],["ml","ml"]],se=[["g","g",1],["oz","oz",28.3495],["lb","lb",453.592],["kg","kg",1e3]];function vt(p){let t=String(p!=null?p:"").trim().replace(",",".");if(!t)return null;let e=t.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(e)return Number(e[3])?Number(e[1])+Number(e[2])/Number(e[3]):null;if(e=t.match(/^(\d+)\/(\d+)$/),e)return Number(e[2])?Number(e[1])/Number(e[2]):null;let i=Number(t);return Number.isFinite(i)&&i>0?i:null}function xt(p){return String(Math.round(p*100)/100)}function bt(p){let t=[],e=(p==null?void 0:p.portions)||[],i=e.find(r=>r.volume_unit==="cup")||e.find(r=>r.volume_unit),a=i?i.per_unit_g/kt[i.volume_unit]:null;e.forEach((r,s)=>{if(Qt.some(([d,h])=>r.volume_unit===d&&r.unit_label.toLowerCase()===h))return;let l=r.unit_label;l=l.replace(/^([a-z]{3,}[^s])s\b/i,"$1"),t.push({id:`p${s}`,label:l,group:"food",g:r.per_unit_g,quality:"exact"})});for(let[r,s]of Qt){if(!p){t.push({id:r,label:s,group:"volume",g:null,quality:"unknown"});continue}let n=i&&i.volume_unit===r&&i.unit_label.toLowerCase()===s;t.push({id:r,label:s,group:"volume",g:kt[r]*(a!=null?a:1),quality:n?"exact":a?"derived":"rough",basis:i})}for(let[r,s,n]of se)t.push({id:r,label:s,group:"mass",g:n,quality:"exact"});return t}var It=class extends St{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_stats:{state:!0},_error:{state:!0},_entityId:{state:!0}}}constructor(){super(),this._stats=null,this._error=null,this._entityId=null,this._lastStamp=null,this._fetching=!1,this._refetch=!1,this._resolvingDefault=!1,this._onLogged=()=>this._fetch()}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=T({title:"Health & Fitness",show_exercise:!0,search_usda:!0,list_height:360},t),t.profile_entity_id&&(this._entityId=t.profile_entity_id)}static getStubConfig(){return{title:"Health & Fitness"}}static getConfigForm(){return{schema:[{name:"title",selector:{text:{}}},{name:"profile_entity_id",selector:{entity:{filter:{integration:"calorie_tracker",domain:"sensor"}}}},{name:"usda_api_key",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"search_usda",selector:{boolean:{}}},{name:"show_exercise",selector:{boolean:{}}}]},{name:"list_height",selector:{number:{min:150,max:1e3,step:10,unit_of_measurement:"px"}}}],computeLabel:t=>({title:"Title",profile_entity_id:"Calorie Tracker profile (defaults to your own)",usda_api_key:"USDA FoodData Central API key (optional)",search_usda:"Search USDA database",show_exercise:"Show exercise in activity list",list_height:"Activity list height on narrow screens"})[t.name]}}getCardSize(){return 7}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._debounce)}updated(t){t.has("hass")&&this.hass&&this._maybeFetch()}async _resolveEntity(){var t,e,i,a;if(this._entityId)return this._entityId;if(this._resolvingDefault)return null;this._resolvingDefault=!0;try{let r=await this.hass.callWS({type:"calorie_tracker/get_user_profile",user_id:(t=this.hass.user)==null?void 0:t.id});this._entityId=((e=r==null?void 0:r.default_profile)==null?void 0:e.entity_id)||((a=(i=r==null?void 0:r.all_profiles)==null?void 0:i[0])==null?void 0:a.entity_id)||null,this._entityId||(this._error="No Calorie Tracker profile found.")}catch(r){this._error=`Couldn't find a Calorie Tracker profile: ${r.message||r}`}finally{this._resolvingDefault=!1}return this._entityId}async _maybeFetch(){let t=await this._resolveEntity();if(!t)return;let e=this.hass.states[t],i=`${e==null?void 0:e.last_updated}|${Jt()}`;i!==this._lastStamp&&(this._lastStamp=i,clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._fetch(),150))}async _fetch(){if(!(!this.hass||!this._entityId)){if(this._fetching){this._refetch=!0;return}this._fetching=!0;try{this._stats=await this.hass.callWS({type:"calorie_tracker/get_dashboard_stats",entity_id:this._entityId,date:Jt()}),this._error=null}catch(t){this._error=(t==null?void 0:t.code)==="unknown_command"?"This card needs the updated Calorie Tracker integration. Restart Home Assistant after updating.":`Couldn't load data: ${t.message||t}`}finally{this._fetching=!1,this._refetch&&(this._refetch=!1,this._fetch())}}}_openLog(){let t=document.createElement("hf-log-dialog");t.hass=this.hass,t.entityId=this._entityId,t.usdaApiKey=this._config.usda_api_key||"",t.searchUsda=this._config.search_usda!==!1,t.addEventListener("hf-logged",this._onLogged),document.body.appendChild(t)}get _lang(){var t,e,i;return((e=(t=this.hass)==null?void 0:t.locale)==null?void 0:e.language)||((i=this.hass)==null?void 0:i.language)||void 0}_fmt(t,e=0){return t==null?"\u2014":new Intl.NumberFormat(this._lang,{maximumFractionDigits:e}).format(t)}_time(t){let e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleTimeString(this._lang,{hour:"numeric",minute:"2-digit"})}_shortDate(t){let[e,i,a]=(t||"").split("-").map(Number);if(!e)return"";let r=new Date(e,i-1,a),s=new Date,n=new Date;return n.setDate(s.getDate()-1),r.toDateString()===s.toDateString()?"today":r.toDateString()===n.toDateString()?"yesterday":r.toLocaleDateString(this._lang,{month:"short",day:"numeric"})}render(){return this._config?b`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title}</div>
          <button class="btn" @click=${this._openLog} ?disabled=${!this._entityId}>
            <ha-icon icon="mdi:plus"></ha-icon>Log
          </button>
        </div>
        ${this._error?b`<div class="error">${this._error}</div>`:this._stats?b`
                <div class="layout">
                  <div class="left">
                    ${this._renderRing()} ${this._renderMacroTable()} ${this._renderWeight()}
                  </div>
                  <div class="right" style="--hf-list-height:${Number(this._config.list_height)||360}px">
                    ${this._renderActivity()}
                  </div>
                </div>
              `:b`<div class="loading">Loading…</div>`}
      </ha-card>
    `:B}_renderRing(){let{consumed:t,budget:e,remaining:i,exercise:a}=this._stats.calories,r=e!==null&&e>0,s=r?t/e:0,n=r&&i<0,l=52,d=2*Math.PI*l,h=Math.min(s,1)*d;return b`
      <div class="ring-block">
        <svg class="ring" viewBox="0 0 128 128" role="img"
          aria-label=${r?`${Math.round(s*100)}% of daily calories`:"Calories today"}>
          ${Wt`
            <circle cx="64" cy="64" r=${l} class="ring-track"></circle>
            <circle cx="64" cy="64" r=${l} class="ring-value ${n?"over":""}"
              stroke-dasharray="${h} ${d}" transform="rotate(-90 64 64)"></circle>
          `}
        </svg>
        <div class="ring-text">
          <div class="ring-big">${this._fmt(t)}</div>
          <div class="ring-small">${r?b`of ${this._fmt(e)} kcal`:"kcal eaten"}</div>
        </div>
        <div class="ring-side">
          ${r?b`
                <div class="stat ${n?"over":"good"}">
                  <span class="stat-num">${this._fmt(Math.abs(i))}</span>
                  <span class="stat-label">${n?"kcal over":"kcal left"}</span>
                </div>
                <div class="stat">
                  <span class="stat-num">${Math.round(s*100)}%</span>
                  <span class="stat-label">of daily goal</span>
                </div>
              `:b`<div class="stat"><span class="stat-label">No calorie goal set</span></div>`}
          ${a>0?b`<div class="stat">
                <span class="stat-num">${this._fmt(a)}</span>
                <span class="stat-label">kcal exercise</span>
              </div>`:B}
        </div>
      </div>
    `}_renderMacroTable(){let{today:t,avg_7:e,avg_30:i}=this._stats.macros,a=(s,n,l)=>b`
      <tr title=${l||""}>
        <th scope="row">${s}</th>
        ${dt.map(d=>b`<td>${(n==null?void 0:n[d.key])===null||(n==null?void 0:n[d.key])===void 0?"\u2014":`${this._fmt(n[d.key])}g`}</td>`)}
        <td class="kcal">${this._fmt(n==null?void 0:n.calories)}</td>
      </tr>
    `,r=(s,n)=>`Average of ${s.days_logged} logged day${s.days_logged===1?"":"s"} in the last ${n} (excludes today)`;return b`
      <table class="macros">
        <thead>
          <tr>
            <th></th>
            ${dt.map(s=>b`<th><span class="dot ${s.key}"></span>${s.label}</th>`)}
            <th class="kcal">kcal</th>
          </tr>
        </thead>
        <tbody>
          ${a("Today",t)} ${a("7-day avg",e,r(e,7))}
          ${a("30-day avg",i,r(i,30))}
        </tbody>
      </table>
      ${this._renderMacroBar(t)}
    `}_renderMacroBar(t){let e={p:(t.p||0)*4,c:(t.c||0)*4,f:(t.f||0)*9},i=e.p+e.c+e.f;return i?b`
      <div class="macro-bar" title="Today's calories by macro">
        ${dt.map(a=>b`<span class="seg ${a.key}" style="flex-grow:${e[a.key]}"
            >${e[a.key]/i>=.12?`${Math.round(e[a.key]/i*100)}%`:""}</span>`)}
      </div>
    `:B}_renderWeight(){let t=this._stats.last_weight;return b`
      <div class="weight">
        <ha-icon icon="mdi:scale-bathroom"></ha-icon>
        <span class="weight-label">Last weight</span>
        ${t?b`<span class="weight-value">${this._fmt(t.weight,1)} ${t.unit}</span>
              <span class="weight-date">${this._shortDate(t.date)}</span>`:b`<span class="weight-date">None logged yet</span>`}
      </div>
    `}_renderActivity(){let t=(this._stats.food_entries||[]).map(a=>st(T({},a),{kind:"food"})),e=this._config.show_exercise?(this._stats.exercise_entries||[]).map(a=>st(T({},a),{kind:"exercise"})):[],i=[...t,...e].sort((a,r)=>(r.timestamp||"").localeCompare(a.timestamp||""));return b`
      <div class="activity-head">
        <span>Today</span>
        <span class="muted">${t.length} item${t.length===1?"":"s"}</span>
      </div>
      <div class="activity">
        ${i.length===0?b`<div class="empty">
              <ha-icon icon="mdi:silverware-fork-knife"></ha-icon>
              <div>Nothing logged yet today.</div>
            </div>`:i.map(a=>a.kind==="food"?this._renderFood(a):this._renderExercise(a))}
      </div>
    `}_renderFood(t){let e=t.food_item||"Food",i=null,a=e.match(Zt);a&&(i=a[1],e=e.replace(Zt,""));let r=dt.some(s=>at(t[s.key]));return b`
      <div class="item">
        <div class="item-main">
          <div class="item-name" title=${e}>${e}</div>
          <div class="item-meta">${this._time(t.timestamp)}${i?b` · ${i}`:B}</div>
          ${r?b`<div class="item-macros">
                ${dt.map(s=>b`<span><span class="dot ${s.key}"></span>${this._fmt(at(t[s.key])||0)}g</span>`)}
              </div>`:B}
        </div>
        <div class="item-cal">${this._fmt(t.calories)}<span>kcal</span></div>
      </div>
    `}_renderExercise(t){let e=[this._time(t.timestamp)];return t.duration_minutes&&e.push(`${t.duration_minutes} min`),b`
      <div class="item exercise">
        <div class="item-main">
          <div class="item-name">
            <ha-icon icon="mdi:run"></ha-icon>${t.exercise_type||"Exercise"}
          </div>
          <div class="item-meta">${e.join(" \xB7 ")}</div>
        </div>
        <div class="item-cal">−${this._fmt(t.calories_burned||0)}<span>kcal</span></div>
      </div>
    `}static get styles(){return[te,$t`
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
      `]}},Nt=class extends St{static get properties(){return{hass:{attribute:!1},entityId:{attribute:!1},usdaApiKey:{attribute:!1},searchUsda:{attribute:!1},_query:{state:!0},_results:{state:!0},_searching:{state:!0},_searchErrors:{state:!0},_selected:{state:!0},_units:{state:!0},_loadingPortions:{state:!0},_form:{state:!0},_caloriesTouched:{state:!0},_saving:{state:!0},_error:{state:!0}}}constructor(){super(),this._query="",this._results=[],this._searching=!1,this._searchErrors=[],this._selected=null,this._units=bt(null),this._loadingPortions=!1,this._form={name:"",amount:"",unit:"g",calories:"",p:"",c:"",f:""},this._unitTouched=!1,this._caloriesTouched=!1,this._saving=!1,this._error=null,this._searchSeq=0,this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),clearTimeout(this._searchTimer)}firstUpdated(){var t;(t=this.renderRoot.querySelector("#search"))==null||t.focus()}_close(){this.remove()}_onSearchInput(t){if(this._query=t.target.value,clearTimeout(this._searchTimer),this._query.trim().length<2){this._results=[],this._searchErrors=[],this._searching=!1;return}this._searching=!0,this._searchTimer=setTimeout(()=>this._search(),400)}async _search(){let t=++this._searchSeq,e={type:"calorie_tracker/search_foods",query:this._query.trim(),include_usda:this.searchUsda!==!1,limit:20};this.usdaApiKey&&(e.usda_api_key=this.usdaApiKey);try{let i=await this.hass.callWS(e);if(t!==this._searchSeq)return;this._results=i.results||[],this._searchErrors=i.errors||[]}catch(i){if(t!==this._searchSeq)return;this._results=[],this._searchErrors=[`Search failed: ${i.message||i}`]}finally{t===this._searchSeq&&(this._searching=!1)}}get _unit(){return this._units.find(t=>t.id===this._form.unit)||this._units.find(t=>t.id==="g")}_grams(t=this._form){let e=this._units.find(a=>a.id===t.unit),i=vt(t.amount);return!e||i===null||e.g===null?null:i*e.g}_scaled(t,e){let i=e/t.base_g,a=r=>r==null?"":Rt(r*i);return{calories:t.calories===null?"":Math.round(t.calories*i),p:a(t.protein),c:a(t.carbs),f:a(t.fat)}}_defaultAmount(t,e){var r;let i=(r=t.portions)==null?void 0:r[0];if(i!=null&&i.volume_unit&&!e.some(s=>s.group==="food"&&s.g===i.per_unit_g)){let s=t.default_g!==t.base_g?t.default_g/i.per_unit_g:1;return{unit:i.volume_unit,amount:xt(s)}}let a=e.find(s=>s.group==="food");return a?{unit:a.id,amount:"1"}:{unit:"g",amount:String(Rt(t.default_g||t.base_g||100))}}_applyScaling(t){let e=this._grams(t);if(this._selected&&e&&e>0){let i=t.calories;Object.assign(t,this._scaled(this._selected,e)),this._caloriesTouched&&(t.calories=i)}return t}_select(t){let e=t.brand&&!t.name.toLowerCase().includes(t.brand.toLowerCase())?`${t.brand} ${t.name}`:t.name;this._selected=t,this._units=bt(t),this._unitTouched=!1,this._caloriesTouched=!1,this._form=this._applyScaling(T(st(T({},this._form),{name:e}),this._defaultAmount(t,this._units))),this._results=[],this._query="",this.updateComplete.then(()=>{var i;return(i=this.renderRoot.querySelector("#amount"))==null?void 0:i.select()}),t.portions_pending&&t.fdc_id&&this._loadPortions(t)}async _loadPortions(t){var e;this._loadingPortions=!0;try{let i={type:"calorie_tracker/get_food_portions",fdc_id:t.fdc_id};this.usdaApiKey&&(i.usda_api_key=this.usdaApiKey);let a=await this.hass.callWS(i);if(this._selected!==t||!((e=a==null?void 0:a.portions)!=null&&e.length))return;let r=st(T({},t),{portions:a.portions,portions_pending:!1});this._selected=r,this._units=bt(r),this._unitTouched?this._form=this._applyScaling(T({},this._form)):this._form=this._applyScaling(T(T({},this._form),this._defaultAmount(r,this._units)))}catch(i){}finally{this._loadingPortions=!1}}_clearSelection(){this._selected=null,this._units=bt(null),this._units.some(t=>t.id===this._form.unit)||(this._form=st(T({},this._form),{unit:"g"}))}_caloriesFromMacros(t){let e=at(t.p)||0,i=at(t.c)||0,a=at(t.f)||0;return e||i||a?Math.round(e*4+i*4+a*9):""}_onField(t,e){let i=e.target.value,a=st(T({},this._form),{[t]:i});t==="amount"||t==="unit"?(t==="unit"&&(this._unitTouched=!0,a.amount=this._convertAmount(this._form,i)),a=this._applyScaling(a)):t==="calories"?(this._caloriesTouched=i!=="",this._caloriesTouched||(a.calories=this._caloriesFromMacros(a))):["p","c","f"].includes(t)&&(this._selected=null,this._units=bt(null),this._units.some(r=>r.id===a.unit)||(a.unit="g"),this._caloriesTouched||(a.calories=this._caloriesFromMacros(a))),this._form=a}_convertAmount(t,e){let i=this._units.find(n=>n.id===t.unit),a=this._units.find(n=>n.id===e),r=vt(t.amount);if(!i||!a||r===null)return t.amount;let s=this._grams(t);if(a.group==="mass"&&s!==null)return a.id==="g"?String(Math.round(s)):xt(s/a.g);if(i.group===a.group&&i.group!=="food"){let n=i.group==="mass"?i.g/a.g:kt[i.id]/kt[a.id],l=r*n;return a.id==="g"?String(Math.round(l)):xt(l)}return"1"}_amountSuffix(){let t=vt(this._form.amount);if(t===null)return"";let e=this._unit,i=this._grams(),a=xt(t);if(e.id==="g")return` (${a} g)`;let r=e.label.split(" (")[0];if(i===null)return` (${a} ${r})`;let s=e.quality==="rough"||e.quality==="derived"?"~":"";return` (${a} ${r} \xB7 ${s}${Math.round(i)} g)`}async _save(t){t==null||t.preventDefault();let e=this._form.name.trim(),i=at(this._form.calories);if(!e){this._error="Give the food a name.";return}if(i===null||i<0){this._error="Enter calories, or macros to calculate them.";return}if(this._form.amount.trim()&&vt(this._form.amount)===null){this._error="Amount should be a number like 1.5 or 1 1/2.";return}let a={food_item:`${e}${this._amountSuffix()}`,calories:Math.round(i)};for(let r of["p","c","f"]){let s=at(this._form[r]);s&&(a[r]=Rt(s))}this._saving=!0,this._error=null;try{await this.hass.callWS({type:"calorie_tracker/add_entry",entity_id:this.entityId,entry_type:"food",entry:a}),this.dispatchEvent(new CustomEvent("hf-logged",{detail:a})),this._close()}catch(r){this._error=`Couldn't save: ${r.message||r}`}finally{this._saving=!1}}_resultKcal(t){let e=t.default_g||t.base_g;return Math.round(t.calories*e/t.base_g)}_resultServing(t){var i;let e=(i=t.portions)==null?void 0:i[0];return e?`1 ${e.unit_label.split(" (")[0]} \xB7 ${Math.round(e.per_unit_g)} g`:`${Math.round(t.default_g||t.base_g)} g`}_renderAmountHint(){if(this._loadingPortions)return b`<div class="hint">Loading serving sizes…</div>`;let t=this._unit,e=this._grams();if(t.id==="g"||e===null)return t.quality==="unknown"&&vt(this._form.amount)!==null?b`<div class="hint">Pick a food from search to convert ${t.label} to grams.</div>`:B;let i=Math.round(e);return t.quality==="exact"?b`<div class="hint">= ${i} g</div>`:t.quality==="derived"?b`<div class="hint">≈ ${i} g · based on 1 ${t.basis.unit_label} = ${Math.round(t.basis.per_unit_g)} g</div>`:b`<div class="hint warn">≈ ${i} g · rough guess: no volume data for this food, so it assumes the density of water. Weigh it or pick a portion for accuracy.</div>`}_renderUnitSelect(){return b`
      <select id="unit" @change=${e=>this._onField("unit",e)}>
        ${[["food","This food"],["volume","Volume"],["mass","Weight"]].map(([e,i])=>{let a=this._units.filter(r=>r.group===e);return a.length?b`<optgroup label=${i}>
            ${a.map(r=>b`<option value=${r.id} ?selected=${r.id===this._form.unit}>
                ${r.group==="food"?`${r.label} (${xt(r.g)} g)`:r.label}
              </option>`)}
          </optgroup>`:B})}
      </select>
    `}render(){let t=this._form,e=!this._caloriesTouched&&t.calories!==""&&!this._selected;return b`
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
            placeholder=${this.searchUsda===!1?"Search your foods database":"Search foods or brands (USDA + your foods database)"}
            .value=${this._query} @input=${this._onSearchInput} />
          ${this._searching?b`<span class="spinner"></span>`:B}
        </div>
        ${this._searchErrors.map(i=>b`<div class="hint warn">${i}</div>`)}
        ${this._results.length?b`<div class="results">
              ${this._results.map(i=>b`
                  <button class="result" @click=${()=>this._select(i)}>
                    <div class="result-main">
                      <div class="result-name">${i.name}</div>
                      <div class="result-meta">
                        <span class="chip ${i.source}">${i.source_label}</span>
                        ${i.brand&&i.source!=="local"?b`<span>${i.brand}</span>`:B}
                        <span>${this._resultServing(i)}</span>
                      </div>
                    </div>
                    <div class="result-kcal">${this._resultKcal(i)}<span>kcal</span></div>
                  </button>
                `)}
            </div>`:!this._searching&&this._query.trim().length>=2&&!this._searchErrors.length?b`<div class="hint">No matches. Enter it manually below.</div>`:B}

        <form @submit=${this._save}>
          ${this._selected?b`<div class="selected">
                <span>Nutrition scales with the amount (from ${this._selected.source_label}).</span>
                <button type="button" class="link" @click=${this._clearSelection}>Unlink</button>
              </div>`:B}
          <label class="full">
            <span>Food name</span>
            <input .value=${t.name} @input=${i=>this._onField("name",i)} required />
          </label>
          <div>
            <div class="row amount-row">
              <label>
                <span>Amount</span>
                <input id="amount" type="text" inputmode="decimal" placeholder="e.g. 1 1/2"
                  .value=${String(t.amount)} @input=${i=>this._onField("amount",i)} />
              </label>
              <label>
                <span>Unit</span>
                ${this._renderUnitSelect()}
              </label>
              <label>
                <span>Calories ${e?b`<em>from macros</em>`:B}</span>
                <input type="number" inputmode="numeric" min="0" step="1"
                  .value=${String(t.calories)} @input=${i=>this._onField("calories",i)} />
              </label>
            </div>
            ${this._renderAmountHint()}
          </div>
          <div class="row three">
            ${dt.map(i=>b`
                <label>
                  <span><span class="dot ${i.key}"></span>${i.label} (g)</span>
                  <input type="number" inputmode="decimal" min="0" step="any"
                    .value=${String(t[i.key])} @input=${a=>this._onField(i.key,a)} />
                </label>
              `)}
          </div>
          ${this._error?b`<div class="hint warn">${this._error}</div>`:B}
          <div class="actions">
            <button type="button" class="btn secondary" @click=${this._close}>Cancel</button>
            <button type="submit" class="btn" ?disabled=${this._saving}>
              ${this._saving?"Saving\u2026":"Log food"}
            </button>
          </div>
        </form>
      </div>
    `}static get styles(){return[te,$t`
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
      `]}};customElements.get("hf-log-dialog")||customElements.define("hf-log-dialog",Nt);customElements.get("health-fitness-card")||customElements.define("health-fitness-card",It);window.customCards=window.customCards||[];window.customCards.push({type:"health-fitness-card",name:"Calorie Tracker: Health & Fitness",description:"Today's calories, macros with 7/30-day averages, last weight, and a scrollable food log with quick logging and USDA search.",preview:!0})});var ae=K(()=>{var Ie=U(Ot()),Ne=U(jt()),He=U(Gt()),ze=U(Yt()),We=U(Bt()),Oe=U(Vt()),je=U(Xt()),Ge=U(Kt()),Ye=U(Ut()),Be=U(ee())});export default ae();
//# sourceMappingURL=cards-impl-F2YAOVWQ.js.map
