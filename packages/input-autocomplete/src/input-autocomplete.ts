import {
    customElement,
    html,
    LitElement,
    property,
    TemplateResult
} from 'lit-element';

import Timeout from 'await-timeout';

import {
    KEY_DOWN,
    KEY_ESCAPE,
    KEY_TAB,
    KEY_RETURN,
    KEY_UP
} from 'keycode-js';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputModes } from './types/input-modes';
import { AutoCompleteCssClasses } from './models/autocomplete-css-classes';

const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';

@customElement('rx-input-autocomplete')
export class InputAutoComplete extends LitElement {

    active = false;
    activeIndex = -1;
    data: AutoCompleteSuggestion[] = [];

    @property({ type: Boolean }) disabled = false;
    @property({ type: Boolean }) required = true;

    @property({ type: Number }) maxSuggestions = 5;
    @property({ type: Number }) minInput = 0;

    @property({ type: Object }) cssClasses = new AutoCompleteCssClasses();
    @property({ type: Object }) inputMode: InputModes = 'none';

    @property({ type: String }) inputId = '';
    @property({ type: String }) placeholder = '';
    @property({ type: String }) text = '';
    @property({ type: String }) value = '';

    @property({ type: Object }) suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]> = () => Promise.resolve([]);

    clearData(): void {
        this.data = [];
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

    handleActivation(keyCode: number): void {
        if (!this.data.length) {
            return;
        }

        const isKeyDown = keyCode === KEY_DOWN;

        if (isKeyDown && (this.activeIndex + 1) < this.data.length) {
            this.activeIndex += 1;
        } else if (isKeyDown) {
            this.activeIndex = 0;
        } else if (!isKeyDown && (this.activeIndex) > 0) {
            this.activeIndex -= 1;
        } else if (!isKeyDown) {
            this.activeIndex = this.data.length - 1;
        }
    }

    handleBlur(e: FocusEvent): void {
        e.preventDefault();

        const timer = new Timeout();
        timer
            .set(250)
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
        e.preventDefault();
        this.active = true;
    }

    handleKeyDown(e: KeyboardEvent): void {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }

        const keyCode = e.keyCode;
        switch (keyCode) {
            case KEY_DOWN:
            case KEY_UP:
                e.preventDefault();
                this.handleActivation(keyCode);
                break;

            case KEY_RETURN:
            case KEY_TAB:
                e.preventDefault();
                this.handleSelection(this.activeIndex);
                break;

            case KEY_ESCAPE:
                this.handleClose();
                break;
        }
    }

    handleKeyUp(e: KeyboardEvent): void {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }

        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }

        const text: string = e.target['value'];

        switch (e.keyCode) {
            case KEY_DOWN:
            case KEY_UP:
            case KEY_RETURN:
            case KEY_TAB:
            case KEY_ESCAPE:
                this.clearSelection(true);
                this.prepareSuggestions(text);
                break;
        }

        this.active = true;
        this.text = text;
    }

    handleSelection(index: number): void {
        if (index >= 0 && index < this.data.length) {
            this.text = this.data[index].text;
            this.value = this.data[index].value;
            this.dispatchEvent(
                new CustomEvent(
                    CUSTOM_EVENT_NAME_SELECTED,
                    { detail: this.data[index] })
            );
            this.clearData();
        }
    }

    hasData(): boolean {
        return this.data && this.data.length > 0;
    }

    async prepareSuggestions(text: string): Promise<void> {
        if (this.suggestionGenerator && text.length >= this.minInput) {
            const suggestions = await this.suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.data = suggestions;
        } else {
            this.data = [];
        }
    }

    render(): TemplateResult {
        return html`
        <div .class=${this.cssClasses.wrapper}>
            <input
                @blur="${this.handleBlur}"
                @focus="${this.handleFocus}"
                @keyDown="${this.handleKeyDown}"
                @keyUp="${this.handleKeyUp}"

                ?disabled="${this.disabled}"

                .class="${this.cssClasses.input}"
                .id="${this.inputId}"
                .inputMode="${this.inputMode}"
                .placeholder="${this.placeholder}"
                .required="${this.required}"
                .value="${this.text}"

                autocomplete="off"
                type="text"

                />

            ${this.hasData() ? this.renderSuggestions() : ''}
        </div>`;
    }

    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number) {
        return html`
        <button
            @click="${() => this.handleSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }

    renderSuggestions(): TemplateResult {
        return html`
        <div class="${this.cssClasses.suggestions}">
            ${this.data.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
        </div>`;
    }
}
