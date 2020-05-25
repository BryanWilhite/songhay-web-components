import { html, TemplateResult } from 'lit-html';
import { css } from 'lit-element/lib/css-tag';
import { customElement } from 'lit-element/lib/decorators';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';

import { InputAutoCompleteBase } from './input-autocomplete-base';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';

@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends InputAutoCompleteBase {
    static customElementName = CUSTOM_ELEMENT_NAME;

    static get styles() {
        return css`
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

    render(): TemplateResult {

        const cssSuggestionAlignmentBlock = html`
            <style>
                :host div > ul > li > button {
                    text-align: ${this.cssSuggestionAlignment};
                }
            </style>
        `;

        const cssWidthStyleBlock = html`
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
        </div>

        ${this.cssWidth ? cssWidthStyleBlock : html``}
        ${this.cssSuggestionAlignment ? cssSuggestionAlignmentBlock : html``}
        `;
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
