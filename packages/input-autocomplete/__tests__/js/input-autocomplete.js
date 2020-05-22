var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit-html';
import { customElement } from 'lit-element/lib/decorators';
import { InputAutoCompleteBase } from './input-autocomplete-base';
const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
let InputAutoComplete = class InputAutoComplete extends InputAutoCompleteBase {
    render() {
        var _a;
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
        </div>`;
    }
    renderSuggestion(suggestion, index) {
        return html `
        <li>
            <button
                @click="${() => this.handleSuggestionSelection(index)}"

                .class="${this.getSuggestionsCssClasses(index)}"
                .data-value="${suggestion.value}"

                type="button">
                ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
            </button>
        </li>`;
    }
};
InputAutoComplete.customElementName = CUSTOM_ELEMENT_NAME;
InputAutoComplete = __decorate([
    customElement(CUSTOM_ELEMENT_NAME)
], InputAutoComplete);
export { InputAutoComplete };
//# sourceMappingURL=input-autocomplete.js.map