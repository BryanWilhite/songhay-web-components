var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit-html';
import { css } from 'lit-element/lib/css-tag';
import { customElement } from 'lit-element/lib/decorators';
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
            }

            div > ul {
                left: 0;
                list-style: none;
                margin: 0;
                padding: 0;
                position: absolute;
                right: 0;
            }

            div > ul > li {
                display: inline-block;
                padding: 0;
            }

            div > ul > li > button {
                border: none;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
            }

            div > input,
            div > ul,
            div > ul > li,
            div > ul > li > button {
                display: inline-block;
                height: 100%;
                margin: 0;
                width: 100%;
            }
    `;
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
        const cssSuggestionAlignmentAndTextOverflowBlock = html `
            <style>
                :host div > ul > li > button {
                    text-align: ${this.cssSuggestionAlignment};
                    text-overflow: ${this.cssSuggestionTextOverflow};
                }
            </style>
        `;
        const cssWidthAndZIndexStyleBlock = html `
            <style>
                :host div {
                    width: ${this.cssWidth};
                    z-index: ${this.cssZIndexBase + 1};
                }

                :host div > ul {
                    z-index: ${this.cssZIndexBase + 2};
                }
            </style>`;
        const cssSuggestionSelectedBlock = html `
            <style>
                ${this.cssSuggestionSelectedContainer ?
            html `:host div > ul > li.${SUGGESTION_SELECTED_CSS_CLASS_NAME} \{${this.cssSuggestionSelectedContainer}\}`
            :
                html ``}
                ${this.cssSuggestionSelectedCommand ?
            html `:host div > ul > li.${SUGGESTION_SELECTED_CSS_CLASS_NAME} > button \{${this.cssSuggestionSelectedCommand}\}`
            :
                html ``}
            </style>`;
        return html `
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
                ${(_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </ul>
        </div>

        ${this.cssWidth ? cssWidthAndZIndexStyleBlock : html ``}
        ${this.cssSuggestionAlignment ? cssSuggestionAlignmentAndTextOverflowBlock : html ``}
        ${(this.cssSuggestionSelectedCommand || this.cssSuggestionSelectedContainer) ? cssSuggestionSelectedBlock : html ``}
        `;
    }
    /**
     * renders @type {AutoCompleteSuggestion}
     */
    renderSuggestion(suggestion, index) {
        return html `
        <li>
            <button
                type="button"

                .class="${this.getSuggestionsCssClasses(index)}"
                .data-value="${suggestion.value}"

                @click="${() => this.handleSuggestionClick(index)}"
                >
                ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
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