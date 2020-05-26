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
const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
let InputAutoComplete = class InputAutoComplete extends InputAutoCompleteBase {
    constructor() {
        super(...arguments);
        this.suggestionsContainer = null;
    }
    static get styles() {
        return css `
            div > ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }

            div > ul > li > button {
                border: none;
                cursor: pointer;
            }
        `;
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.setSuggestionsContainer();
    }
    render() {
        var _a;
        const cssSuggestionAlignmentBlock = html `
            <style>
                :host div > ul > li > button {
                    text-align: ${this.cssSuggestionAlignment};
                }
            </style>
        `;
        const cssWidthStyleBlock = html `
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

        ${this.cssWidth ? cssWidthStyleBlock : html ``}
        ${this.cssSuggestionAlignment ? cssSuggestionAlignmentBlock : html ``}
        `;
    }
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
    handleSuggestionSelection(suggestionIndex) {
        if (!this.suggestionsContainer) {
            return;
        }
        const className = 'selected';
        Array
            .from(this.suggestionsContainer.children)
            .forEach((li, index) => {
            if (li.classList.contains(className)) {
                li.classList.remove(className);
            }
            if (suggestionIndex === index) {
                li.classList.add(className);
            }
        });
    }
};
InputAutoComplete.customElementName = CUSTOM_ELEMENT_NAME;
InputAutoComplete = __decorate([
    customElement(CUSTOM_ELEMENT_NAME)
], InputAutoComplete);
export { InputAutoComplete };
//# sourceMappingURL=input-autocomplete.js.map