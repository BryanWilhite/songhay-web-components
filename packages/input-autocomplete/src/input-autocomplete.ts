import {
    customElement,
    html,
    LitElement,
    property,
    TemplateResult,
    PropertyValues
} from 'lit-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { ComponentCssClasses } from './models/component-css-classes';
import { Key } from './models/key';

import { InputModes } from './types/input-modes';

import { AutoCompleteSuggestions } from './services/autocomplete-suggestions';

const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';

const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';

const EVENT_HANDLER_DELAY = (timeInMilliseconds: number) => new Promise((resolve: () => void) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});

@customElement(CUSTOM_ELEMENT_NAME)
export class InputAutoComplete extends LitElement {

    static customElementName = CUSTOM_ELEMENT_NAME;

    activeSuggestionIndex = -1;
    componentActive = false;

    private _autoCompleteSuggestions: AutoCompleteSuggestions | null = null;

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

        const suggestionGenerator = (text: string) => Promise.resolve([
            { text: 'one', value: '01' },
            { text: 'two', value: '02' },
            { text: 'three', value: '03' },
            { text: 'four', value: '05' },
            { text: 'five', value: '05' },
            { text: 'fifty-one', value: '51' },
            { text: 'fifty-two', value: '52' },
            { text: 'fifty-three', value: '53' },
            { text: 'fifty-four', value: '54' },
            { text: 'fifty-five', value: '55' },
        ].filter(i => {
            // console.log('constructor', { text });
            return i.text.startsWith(text);
        }));

        this._autoCompleteSuggestions = new AutoCompleteSuggestions(suggestionGenerator);

    }

    clearData(): void {
        this._autoCompleteSuggestions?.clearData();
        this.activeSuggestionIndex = -1;
        this.componentActive = false;
    }

    clearOrClose(): void {

        if (!this.componentActive) {
            return;
        }

        if (this.value) {
            this.clearData();
        } else {
            this.close();
        }

    }

    clearSelection(clearOnlyValue = false): void {
        if (this.value !== '') {
            this.dispatchCustomEvent(
                CUSTOM_EVENT_NAME_UNSELECTED,
                { detail: { text: this.text, value: this.value } }
            );
            this.value = '';
        }

        if (!clearOnlyValue) {
            this.text = '';
        }
    }

    close(): void {
        this.clearSelection();
        this.clearData();
    }

    dispatchCustomEvent(eventName: string, data: { detail: any }): void {
        switch (eventName) {
            case CUSTOM_EVENT_NAME_SELECTED:
            case CUSTOM_EVENT_NAME_UNSELECTED:
                this.dispatchEvent(new CustomEvent(eventName, data));
                break;
        }
    }

    getSuggestionsCssClasses(index: number): string {
        return `${this.cssClasses.suggestion}${(this.activeSuggestionIndex === index) ? ' ' + this.cssClasses.active : ''}`;
    }

    handleActivation(key: string): void {
        if (!this._autoCompleteSuggestions?.hasSuggestionData()) {
            return;
        }

        const isKeyDown = (key === Key.ArrowDown);

        //#region functional members:

        const activeSuggestionIndexIsValid = () => (
            this._autoCompleteSuggestions &&
            (this.activeSuggestionIndex + 1) < this._autoCompleteSuggestions?.getSuggestionDataCount());
        const setActiveSuggestionIndexBoundary = () => {
            if (isKeyDown) {
                this.activeSuggestionIndex = 0;
            } else if (!isKeyDown && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            } else if (!isKeyDown && this._autoCompleteSuggestions) {
                this.activeSuggestionIndex = this._autoCompleteSuggestions?.getSuggestionDataCount() - 1;
            }
        };

        //#endregion

        if (isKeyDown && activeSuggestionIndexIsValid()) {
            this.activeSuggestionIndex += 1;
        } else {
            setActiveSuggestionIndexBoundary();
        }
    }

    handleBlur(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        e.preventDefault();
        EVENT_HANDLER_DELAY(250).then(this.clearOrClose);
    }

    handleFocus(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        e.preventDefault();
        this.componentActive = true;
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
                this.handleSuggestionSelection(this.activeSuggestionIndex);
                break;

            case Key.Escape:
                this.close();
                break;
        }
    }

    async handleKeyUp(e: KeyboardEvent): Promise<void> {
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
                break;

            default:
                this.componentActive = true;

                await this._autoCompleteSuggestions?.prepareSuggestions(text);

                await this.requestUpdate();

                break;
        }
    }

    handleSuggestionSelection(suggestionIndex: number): void {
        //#region functional members:

        const suggestionIndexIsValid = () =>
            suggestionIndex >= 0 &&
            this._autoCompleteSuggestions &&
            suggestionIndex < this._autoCompleteSuggestions?.getSuggestionDataCount();

        const setTextAndValue = () => {
            if (this._autoCompleteSuggestions) {
                const datum = this._autoCompleteSuggestions?.getSuggestionDatum(suggestionIndex);
                this.text = datum.text;
                this.value = datum.value;
            }
        };

        //#endregion

        if (suggestionIndexIsValid()) {
            setTextAndValue();
            this.dispatchCustomEvent(
                CUSTOM_EVENT_NAME_SELECTED,
                { detail: this._autoCompleteSuggestions?.getSuggestionDatum(suggestionIndex) }
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
                ${this._autoCompleteSuggestions?.suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </div>
        </div>`;
    }

    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number): TemplateResult {
        return html`
        <button
            @click="${() => this.handleSuggestionSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }

    update(changedProperties: PropertyValues) {
        super.update(changedProperties);

        // console.log({ changedProperties });
    }
}
