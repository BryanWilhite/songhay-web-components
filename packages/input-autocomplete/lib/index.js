!function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(i,n,function(t){return e[t]}.bind(null,n));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=4)}([function(e,t){e.exports=lit-element},function(e,t){e.exports=lit-html},function(e,t){e.exports=lit-element/lib/css-tag},function(e,t){e.exports=lit-element/lib/decorators},function(e,t,s){"use strict";s.r(t),s.d(t,"InputAutoComplete",(function(){return y}));var i=s(1),n=s(2),o=s(3),r=s(0);class u{constructor(){this.wrapper="",this.input="",this.suggestions="suggestions",this.suggestion="suggestion",this.active="active"}}class a{}a.ArrowDown="ArrowDown",a.ArrowUp="ArrowUp",a.Backspace="Backspace",a.Enter="Enter",a.Escape="Escape",a.Tab="Tab";var c=function(e,t,s,i){return new(s||(s=Promise))((function(n,o){function r(e){try{a(i.next(e))}catch(e){o(e)}}function u(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?n(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(r,u)}a((i=i.apply(e,t||[])).next())}))};class l{constructor(e=(()=>Promise.resolve([])),t=5,s=0){this.suggestionData=[],this.suggestionGenerator=e,this.maxSuggestions=t,this.minInput=s}clearData(){this.suggestionData=[]}getSuggestionDatum(e){return this.suggestionData[e]}getSuggestionDataCount(){return this.suggestionData.length}hasSuggestionData(){return this.suggestionData.length>0}prepareSuggestions(e){return c(this,void 0,void 0,(function*(){if((()=>this.suggestionGenerator&&e.length>=this.minInput)()){const t=yield this.suggestionGenerator(e);t.splice(this.maxSuggestions),this.suggestionData=t}else this.suggestionData=[]}))}}var g=function(e,t,s,i){var n,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var u=e.length-1;u>=0;u--)(n=e[u])&&(r=(o<3?n(r):o>3?n(t,s,r):n(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r},d=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},p=function(e,t,s,i){return new(s||(s=Promise))((function(n,o){function r(e){try{a(i.next(e))}catch(e){o(e)}}function u(e){try{a(i.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?n(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(r,u)}a((i=i.apply(e,t||[])).next())}))};class h extends r.LitElement{constructor(){super(...arguments),this.activeSuggestionIndex=-1,this.componentActive=!1,this._autoCompleteSuggestions=new l,this.inputId="",this.cssSuggestionAlignment="",this.cssSuggestionSelectedCommand="",this.cssSuggestionSelectedContainer="",this.cssWidth="",this.placeholder="",this.text="",this.value="",this.disabled=!1,this.required=!0,this.maxSuggestions=5,this.minInput=0,this.cssClasses=new u,this.inputMode="none",this.suggestionGenerator=()=>Promise.resolve([])}clearData(){var e;return p(this,void 0,void 0,(function*(){null===(e=this._autoCompleteSuggestions)||void 0===e||e.clearData(),yield this.requestUpdate(),this.activeSuggestionIndex=-1,this.componentActive=!1}))}clearSelection(e=!1){""!==this.value&&(this.dispatchCustomEvent("unselected",{detail:{text:this.text,value:this.value}}),this.value=""),e||(this.text="")}close(){return p(this,void 0,void 0,(function*(){this.clearSelection(),yield this.clearData()}))}dispatchCustomEvent(e,t){switch(e){case"selected":case"unselected":this.dispatchEvent(new CustomEvent(e,t))}}getSuggestionsCssClasses(e){return`${this.cssClasses.suggestion}${this.activeSuggestionIndex===e?" "+this.cssClasses.active:""}`}handleBlur(e){return p(this,void 0,void 0,(function*(){var t;e?(e.preventDefault(),yield(t=250,new Promise(e=>{setTimeout((function(){e()}),t)})),yield this.close()):console.error(`The expected \`${FocusEvent.name}\` is not here.`)}))}handleFocus(e){e?this.componentActive=!0:console.error(`The expected \`${FocusEvent.name}\` is not here.`)}handleKeyDown(e){return p(this,void 0,void 0,(function*(){if(e)switch(e.key){case a.ArrowDown:case a.ArrowUp:this.setActiveSuggestionIndex(e.key),this.handleSuggestionSelection(this.activeSuggestionIndex);break;case a.Enter:case a.Tab:this.handleSuggestionClick(this.activeSuggestionIndex);break;case a.Escape:yield this.close()}else console.error(`The expected \`${KeyboardEvent.name}\` is not here.`)}))}handleKeyUp(e){return p(this,void 0,void 0,(function*(){if(!e)return void console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);if(!e.target)return void console.error("The expected KeyboardEvent EventTarget is not here.");const t=e.target.value;switch(e.key){case a.ArrowDown:case a.ArrowUp:case a.Enter:case a.Tab:case a.Escape:this.clearSelection(!0);break;default:yield this.prepareSuggestions(t)}}))}handleSuggestionClick(e){var t;return p(this,void 0,void 0,(function*(){const s=()=>{var t;const s=null===(t=this._autoCompleteSuggestions)||void 0===t?void 0:t.getSuggestionDatum(e);this.text=s.text,this.value=s.value};(()=>{var t;return e>=0&&e<(null===(t=this._autoCompleteSuggestions)||void 0===t?void 0:t.getSuggestionDataCount())})()&&(s(),this.dispatchCustomEvent("selected",{detail:null===(t=this._autoCompleteSuggestions)||void 0===t?void 0:t.getSuggestionDatum(e)}),yield this.clearData())}))}prepareSuggestions(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this._autoCompleteSuggestions)||void 0===t?void 0:t.prepareSuggestions(e),yield this.requestUpdate()}))}setActiveSuggestionIndex(e){var t;if(!(null===(t=this._autoCompleteSuggestions)||void 0===t?void 0:t.hasSuggestionData()))return;const s=e===a.ArrowDown,i=()=>{var e;s?this.activeSuggestionIndex=0:!s&&this.activeSuggestionIndex>0?this.activeSuggestionIndex-=1:s||(this.activeSuggestionIndex=(null===(e=this._autoCompleteSuggestions)||void 0===e?void 0:e.getSuggestionDataCount())-1)};s&&(()=>{var e;return this.activeSuggestionIndex+1<(null===(e=this._autoCompleteSuggestions)||void 0===e?void 0:e.getSuggestionDataCount())})()?this.activeSuggestionIndex+=1:i()}updated(e){super.updated(e),e.has(h.suggestionGeneratorPropertyName)&&(this._autoCompleteSuggestions.suggestionGenerator=this.suggestionGenerator)}}h.suggestionGeneratorPropertyName="suggestionGenerator",g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"inputId",void 0),g([Object(r.property)({type:String}),d("design:type",String)],h.prototype,"cssSuggestionAlignment",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"cssSuggestionSelectedCommand",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"cssSuggestionSelectedContainer",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"cssWidth",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"placeholder",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"text",void 0),g([Object(r.property)({type:String}),d("design:type",Object)],h.prototype,"value",void 0),g([Object(r.property)({type:Boolean}),d("design:type",Object)],h.prototype,"disabled",void 0),g([Object(r.property)({type:Boolean}),d("design:type",Object)],h.prototype,"required",void 0),g([Object(r.property)({type:Number}),d("design:type",Object)],h.prototype,"maxSuggestions",void 0),g([Object(r.property)({type:Number}),d("design:type",Object)],h.prototype,"minInput",void 0),g([Object(r.property)({type:Object}),d("design:type",Object)],h.prototype,"cssClasses",void 0),g([Object(r.property)({type:Object}),d("design:type",String)],h.prototype,"inputMode",void 0),g([Object(r.property)({type:Object}),d("design:type",Function)],h.prototype,"suggestionGenerator",void 0);var v=function(e,t,s,i){var n,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var u=e.length-1;u>=0;u--)(n=e[u])&&(r=(o<3?n(r):o>3?n(t,s,r):n(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r};let y=class extends h{constructor(){super(...arguments),this.suggestionsContainer=null}static get styles(){return n.css`
            div > ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }

            div > ul > li > button {
                border: none;
                cursor: pointer;
            }
        `}firstUpdated(e){super.firstUpdated(e),this.setSuggestionsContainer()}render(){var e;const t=i.html`
            <style>
                :host div > ul > li > button {
                    text-align: ${this.cssSuggestionAlignment};
                }
            </style>
        `,s=i.html`
            <style>
                :host div {
                    width: ${this.cssWidth};
                }

                :host div > input,
                :host div > ul,
                :host div > ul > li,
                :host div > ul > li > button {
                    width: 100%;
                }
            </style>`,n=i.html`
            <style>
                ${this.cssSuggestionSelectedContainer?i.html`:host div > ul > li.${"selected"} ${this.cssSuggestionSelectedContainer}`:i.html``}
                ${this.cssSuggestionSelectedCommand?i.html`:host div > ul > li.${"selected"} > button ${this.cssSuggestionSelectedCommand}`:i.html``}
            </style>`;return i.html`
        <div .class=${this.cssClasses.wrapper}>
            <input
                autocomplete="off"
                type="text"

                ?disabled="${this.disabled}"
                ?required="${this.required}"

                .class="${this.cssClasses.input}"
                .id="${this.inputId}"
                .inputMode="${this.inputMode}"
                .placeholder="${this.placeholder}"
                .value="${this.text}"

                @blur="${this.handleBlur}"
                @focus="${this.handleFocus}"
                @keydown="${this.handleKeyDown}"
                @keyup="${this.handleKeyUp}"

                />

            <ul class="${this.cssClasses.suggestions}">
                ${null===(e=this._autoCompleteSuggestions)||void 0===e?void 0:e.suggestionData.map((e,t)=>this.renderSuggestion(e,t))}
            </ul>
        </div>

        ${this.cssWidth?s:i.html``}
        ${this.cssSuggestionAlignment?t:i.html``}
        ${this.cssSuggestionSelectedCommand||this.cssSuggestionSelectedContainer?n:i.html``}
        `}renderSuggestion(e,t){return i.html`
        <li>
            <button
                type="button"

                .class="${this.getSuggestionsCssClasses(t)}"
                .data-value="${e.value}"

                @click="${()=>this.handleSuggestionClick(t)}"
                >
                ${e.suggestion?e.suggestion:e.text}
            </button>
        </li>`}setSuggestionsContainer(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.children;if(!t)return void console.error(`The expected \`${HTMLCollection.name}\` is not here.`);const s=Array.from(t).find(e=>"div"===e.tagName.toLowerCase());s?(this.suggestionsContainer=Array.from(s.children).find(e=>"ul"===e.tagName.toLowerCase()),this.suggestionsContainer||console.error(`The expected \`${HTMLUListElement.name}\` is not here.`)):console.error(`The expected \`${HTMLDivElement.name}\` is not here.`)}handleSuggestionSelection(e){this.suggestionsContainer&&Array.from(this.suggestionsContainer.children).forEach((t,s)=>{t.classList.contains("selected")&&t.classList.remove("selected"),e===s&&t.classList.add("selected")})}};y.customElementName="rx-input-autocomplete",y=v([Object(o.customElement)("rx-input-autocomplete")],y)}]);