var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, unsafeCSS, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { InputAutoCompleteBase } from './input-autocomplete-base';
import { TEMPLATE_NORMALIZE_CSS } from './constants/normalize-css';
const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
const SUGGESTION_SELECTED_CSS_CLASS_NAME = 'selected';
/**
 * defines rendering methods for @type {InputAutoCompleteBase}
 *
 * @export
 * @extends {InputAutoCompleteBase}
 */
let InputAutoComplete = class InputAutoComplete extends InputAutoCompleteBase {
    constructor() {
        super(...arguments);
        /**
         * references the auto-complete DOM container
         * of suggestions
         */
        this.suggestionsContainer = null;
    }
    /**
     * renders CSS according to LitElement conventions
     */
    static get styles() {
        return css `
            ${TEMPLATE_NORMALIZE_CSS}

            div {
                position: relative;
                width: var(--input-autocomplete-width, 16em);
                z-index: var(--input-autocomplete-z-index, 0);
            }

            div > ul {
                left: 0;
                list-style: none;
                margin: 0;
                padding: 0;
                position: absolute;
                right: 0;
                z-index: calc(var(--input-autocomplete-z-index) + 1);
            }

            div > ul > li {
                display: inline-block;
                padding: 0;
            }

            div > ul > li > button {
                border: var(--input-autocomplete-suggestion-border, none);
                cursor: pointer;
                font-weight: var(--input-autocomplete-suggestion-font-weight, normal);
                margin: var(--input-autocomplete-suggestion-margin, 0);
                overflow: hidden;
                text-align: var(--input-autocomplete-suggestion-text-align, left);
                text-overflow: var(--input-autocomplete-suggestion-text-overflow, ellipses);
                white-space: nowrap;
            }

            div > ul > li.${unsafeCSS(SUGGESTION_SELECTED_CSS_CLASS_NAME)} > button,
            div > ul > li > button:hover {
                background-color: var(--input-autocomplete-suggestion-selected-background-color, #e2e2e2);
                border: var(--input-autocomplete-suggestion-selected-border, solid #f00);
                font-weight: var(--input-autocomplete-suggestion-selected-font-weight, bold);
            }

            div > input,
            div > ul,
            div > ul > li,
            div > ul > li > button {
                display: inline-block;
                height: 100%;
                margin: 0;
                width: 100%;
            }`;
    }
    /**
     * conventional LitElement method
     */
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.setSuggestionsContainer();
    }
    /**
     * conventional LitElement method
     */
    render() {
        var _a;
        return html `
        <div>
            <input
                autocomplete="off"
                type="text"

                ?disabled="${this.disabled}"
                ?required="${this.required}"

                .id="${this.inputId}"
                .inputMode="${this.inputMode}"
                .placeholder="${this.placeholder}"
                .value="${this.text}"

                @focus="${this.handleFocus}"
                @keydown="${this.handleKeyDown}"
                @keyup="${this.handleKeyUp}"

                />

            <ul>
                ${(_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </ul>
        </div>`;
    }
    /**
     * renders @type {AutoCompleteSuggestion}
     */
    renderSuggestion(data, index) {
        return html `
        <li>
            <button
                type="button"

                .data-value="${data.value}"

                @click="${() => this.handleSuggestionClick(index)}"
                >
                ${data.suggestion ? data.suggestion : data.text}
            </button>
        </li>`;
    }
    /**
     * sets `this.suggestionsContainer`
     */
    setSuggestionsContainer() {
        var _a;
        const collection = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.children;
        if (!collection) {
            console.error(`The expected \`${HTMLCollection.name}\` is not here.`);
            return;
        }
        const div = Array.from(collection)
            .find(i => i.tagName.toLowerCase() === 'div');
        if (!div) {
            console.error(`The expected \`${HTMLDivElement.name}\` is not here.`);
            return;
        }
        this.suggestionsContainer = Array.from(div.children)
            .find(i => i.tagName.toLowerCase() === 'ul');
        if (!this.suggestionsContainer) {
            console.error(`The expected \`${HTMLUListElement.name}\` is not here.`);
            return;
        }
    }
    /**
     * handles @type {AutoCompleteSuggestion} selection
     */
    handleSuggestionSelection(suggestionIndex) {
        if (!this.suggestionsContainer) {
            return;
        }
        Array
            .from(this.suggestionsContainer.children)
            .forEach((li, index) => {
            if (li.classList.contains(SUGGESTION_SELECTED_CSS_CLASS_NAME)) {
                li.classList.remove(SUGGESTION_SELECTED_CSS_CLASS_NAME);
            }
            if (suggestionIndex === index) {
                li.classList.add(SUGGESTION_SELECTED_CSS_CLASS_NAME);
            }
        });
    }
};
/**
 * conventional element name of this Web Component
 */
InputAutoComplete.customElementName = CUSTOM_ELEMENT_NAME;
InputAutoComplete = __decorate([
    customElement(CUSTOM_ELEMENT_NAME)
], InputAutoComplete);
export { InputAutoComplete };
//# sourceMappingURL=input-autocomplete.js.map