import { html, TemplateResult } from 'lit-html';
import { css, unsafeCSS } from 'lit-element/lib/css-tag';
import { customElement } from 'lit-element/lib/decorators';
import { PropertyValues } from 'lit-element/lib/updating-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';

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
    firstUpdated(changedProperties: PropertyValues) {
        super.firstUpdated(changedProperties);
        this.setSuggestionsContainer();
    }

    /**
     * conventional LitElement method
     */
    render(): TemplateResult {

        return html`
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
                ${this._autoCompleteSuggestions
                ?.suggestionData.map((suggestion, index) =>
                    this.renderSuggestion(suggestion, index))}
            </ul>
        </div>`;
    }

    /**
     * renders @type {AutoCompleteSuggestion}
     */
    renderSuggestion(data: AutoCompleteSuggestion, index: number): TemplateResult {
        return html`
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
