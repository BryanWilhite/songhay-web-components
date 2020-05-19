import {
    customElement,
    html,
    LitElement,
    property,
    TemplateResult
} from 'lit-element';

import { AutoCompleteSuggestions } from './autocomplete-suggestions';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { ComponentCssClasses } from './models/component-css-classes';
import { Key } from './models/key';

import { InputModes } from './types/input-modes';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';

const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';

const EVENT_HANDLER_DELAY = (timeInMilliseconds: number) => new Promise((resolve: () => void) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});

@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends LitElement {

    static customElementName = CUSTOM_ELEMENT_NAME;

    active = false;
    activeIndex = -1;

    private _autoCompleteSuggestions: AutoCompleteSuggestions;

    @property({ type: String }) inputId = '';
    @property({ type: String }) placeholder = '';
    @property({ type: String }) text = '';
    @property({ type: String }) value = '';

    @property({ type: Boolean }) disabled = false;
    @property({ type: Boolean }) required = true;

    @property({ type: Number }) maxSuggestions = 5;
    @property({ type: Number }) minInput = 0;

    @property({ type: Object }) cssClasses = new ComponentCssClasses();
    @property({ type: Object }) inputMode: InputModes = 'none';

    @property({ type: Object }) suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]> = () => Promise.resolve([]);

    constructor() {
        super();
        this._autoCompleteSuggestions = new AutoCompleteSuggestions(this.suggestionGenerator);
        this._autoCompleteSuggestions.maxSuggestions = this.maxSuggestions;
        this._autoCompleteSuggestions.minInput = this.minInput;
    }

    clearData(): void {
        this._autoCompleteSuggestions.clearData();
        this.activeIndex = -1;
        this.active = false;
    }

    clearSelection(clearOnlyValue = false): void {
        if (this.value !== '') {
            this.dispatchEvent(
                new CustomEvent(
                    CUSTOM_EVENT_NAME_UNSELECTED,
                    {
                        detail: {
                            text: this.text,
                            value: this.value
                        }
                    })
            );
            this.value = '';
        }
        if (!clearOnlyValue) {
            this.text = '';
        }
    }

    getSuggestionsCssClasses(index: number): string {
        return `${this.cssClasses.suggestion}${(this.activeIndex === index) ? ' ' + this.cssClasses.active : ''}`;
    }

    handleActivation(key: string): void {
        if (!this._autoCompleteSuggestions.suggestionData.length) {
            return;
        }

        const isKeyDown = (key === Key.ArrowDown);

        if (isKeyDown && (this.activeIndex + 1) < this._autoCompleteSuggestions.suggestionData.length) {
            this.activeIndex += 1;
        } else if (isKeyDown) {
            this.activeIndex = 0;
        } else if (!isKeyDown && (this.activeIndex) > 0) {
            this.activeIndex -= 1;
        } else if (!isKeyDown) {
            this.activeIndex = this._autoCompleteSuggestions.suggestionData.length - 1;
        }
    }

    handleBlur(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        e.preventDefault();

        EVENT_HANDLER_DELAY(250)
            .then(() => {

                if (!this.active) {
                    return;
                }

                if (this.value) {
                    this.clearData();
                } else {
                    this.handleClose();
                }

            });
    }

    handleClose(): void {
        this.clearSelection();
        this.clearData();
    }

    handleFocus(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        e.preventDefault();
        this.active = true;
    }

    handleKeyDown(e: KeyboardEvent): void {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }

        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
                e.preventDefault();
                this.handleActivation(e.key);
                break;

            case Key.Enter:
            case Key.Tab:
                e.preventDefault();
                this.handleSelection(this.activeIndex);
                break;

            case Key.Escape:
                this.handleClose();
                break;
        }
    }

    handleKeyUp(e: KeyboardEvent): void {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }

        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }

        const text: string = e.target['value'];

        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
            case Key.Enter:
            case Key.Tab:
            case Key.Escape:
                this.clearSelection(true);
                this.render();
                break;

            default:
                this.active = true;
                this._autoCompleteSuggestions.prepareSuggestions(text);
                break;
        }
    }

    handleSelection(suggestionIndex: number): void {
        if (suggestionIndex >= 0 && suggestionIndex < this._autoCompleteSuggestions.suggestionData.length) {
            this.text = this._autoCompleteSuggestions.suggestionData[suggestionIndex].text;
            this.value = this._autoCompleteSuggestions.suggestionData[suggestionIndex].value;
            this.dispatchEvent(
                new CustomEvent(
                    CUSTOM_EVENT_NAME_SELECTED,
                    { detail: this._autoCompleteSuggestions.suggestionData[suggestionIndex] })
            );
            this.clearData();
        }
    }

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

            <div class="${this.cssClasses.suggestions}">
            ${this._autoCompleteSuggestions.suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </div>
        </div>`;
    }

    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number) {
        console.log({suggestion, index});
        return html`
        <button
            @click="${() => this.handleSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }
}
