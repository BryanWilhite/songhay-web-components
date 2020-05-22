import { TemplateResult, html } from 'lit-html';
import { customElement } from 'lit-element/lib/decorators';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';

import { InputAutoCompleteBase } from './input-autocomplete-base';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';

@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends InputAutoCompleteBase {

    static customElementName = CUSTOM_ELEMENT_NAME;

    render(): TemplateResult {
        return html`
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
                ${this._autoCompleteSuggestions
                ?.suggestionData.map((suggestion, index) =>
                    this.renderSuggestion(suggestion, index))}
            </ul>
        </div>`;
    }

    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number): TemplateResult {
        return html`
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
}
