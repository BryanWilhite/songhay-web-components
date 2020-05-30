import { html, TemplateResult } from 'lit-html';
import { css } from 'lit-element/lib/css-tag';
import { customElement } from 'lit-element/lib/decorators';
import { PropertyValues } from 'lit-element/lib/updating-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';

import { InputAutoCompleteBase } from './input-autocomplete-base';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
const SUGGESTION_SELECTED_CSS_CLASS_NAME = 'selected';

/**
 * defines rendering methods for @type {InputAutoCompleteBase}
 *
 * @export
 * @extends {InputAutoCompleteBase}
 */
@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends InputAutoCompleteBase {

    /**
     * conventional element name of this Web Component
     */
    static customElementName = CUSTOM_ELEMENT_NAME;

    /**
     * references the auto-complete DOM container
     * of suggestions
     */
    suggestionsContainer: HTMLUListElement | null = null;

    /**
     * renders CSS according to LitElement conventions
     */
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

    /**
     * conventional LitElement method
     */
    firstUpdated(changedProperties: PropertyValues) {
        super.firstUpdated(changedProperties);
        this.setSuggestionsContainer();
    }

    /**
     * conventional LitElement method
     */
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

        const cssSuggestionSelectedBlock = html`
            <style>
                ${this.cssSuggestionSelectedContainer ?
                    html`:host div > ul > li.${SUGGESTION_SELECTED_CSS_CLASS_NAME} \{${this.cssSuggestionSelectedContainer}\}`
                    :
                    html``}
                ${this.cssSuggestionSelectedCommand ?
                    html`:host div > ul > li.${SUGGESTION_SELECTED_CSS_CLASS_NAME} > button \{${this.cssSuggestionSelectedCommand}\}`
                    :
                    html``}
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
        ${
            (this.cssSuggestionSelectedCommand || this.cssSuggestionSelectedContainer) ? cssSuggestionSelectedBlock : html``}
        `;
    }

    /**
     * renders @type {AutoCompleteSuggestion}
     */
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

    /**
     * sets `this.suggestionsContainer`
     */
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

    /**
     * handles @type {AutoCompleteSuggestion} selection
     */
    handleSuggestionSelection(suggestionIndex: number): void {
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
}
