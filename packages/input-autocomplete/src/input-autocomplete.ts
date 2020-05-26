import { html, TemplateResult } from 'lit-html';
import { css } from 'lit-element/lib/css-tag';
import { customElement } from 'lit-element/lib/decorators';
import { PropertyValues } from 'lit-element/lib/updating-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';

import { InputAutoCompleteBase } from './input-autocomplete-base';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';

@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends InputAutoCompleteBase {
    static customElementName = CUSTOM_ELEMENT_NAME;

    suggestionsContainer: HTMLUListElement | null = null;

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

    firstUpdated(changedProperties: PropertyValues) {
        super.firstUpdated(changedProperties);
        this.setSuggestionsContainer();
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
                type="button"

                .class="${this.getSuggestionsCssClasses(index)}"
                .data-value="${suggestion.value}"

                @click="${() => this.handleSuggestionClick(index)}"
                >
                ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
            </button>
        </li>`;
    }

    setSuggestionsContainer(): void {
        const collection = this.shadowRoot?.children;

        if (!collection) {
            console.error(`The expected \`${HTMLCollection.name}\` is not here.`);
            return;
        }

        const div = Array.from(collection)
            .find(i => i.tagName.toLowerCase() === 'div') as HTMLDivElement;

        if (!div) {
            console.error(`The expected \`${HTMLDivElement.name}\` is not here.`);
            return;
        }

        this.suggestionsContainer = Array.from(div.children)
            .find(i => i.tagName.toLowerCase() === 'ul') as HTMLUListElement;

        if (!this.suggestionsContainer) {
            console.error(`The expected \`${HTMLUListElement.name}\` is not here.`);
            return;
        }
    }

    handleSuggestionSelection(suggestionIndex: number): void {
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
}
