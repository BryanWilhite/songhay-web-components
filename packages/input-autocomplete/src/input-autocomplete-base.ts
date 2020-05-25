import {
    LitElement,
    property,
    PropertyValues
} from 'lit-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { ComponentCssClasses } from './models/component-css-classes';
import { Key } from './models/key';

import { CssTextAlignment } from './types/css-text-alignment';
import { InputModes } from './types/input-modes';

import { AutoCompleteSuggestions } from './services/autocomplete-suggestions';

const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';

const EVENT_HANDLER_DELAY = (timeInMilliseconds: number) => new Promise((resolve: () => void) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});

export abstract class InputAutoCompleteBase extends LitElement {

    static suggestionGeneratorPropertyName = 'suggestionGenerator';

    activeSuggestionIndex = -1;
    componentActive = false;

    protected _autoCompleteSuggestions = new AutoCompleteSuggestions();

    @property({ type: String }) inputId = '';

    @property({ type: String }) cssSuggestionAlignment: CssTextAlignment | '' = '';
    @property({ type: String }) cssWidth = '';
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

    async clearData(): Promise<void> {
        this._autoCompleteSuggestions?.clearData();

        await this.requestUpdate();

        this.activeSuggestionIndex = -1;
        this.componentActive = false;
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

    async close(): Promise<void> {
        this.clearSelection();

        await this.clearData();

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
            (this.activeSuggestionIndex + 1) < this._autoCompleteSuggestions?.getSuggestionDataCount());
        const setActiveSuggestionIndexBoundary = () => {
            if (isKeyDown) {
                this.activeSuggestionIndex = 0;
            } else if (!isKeyDown && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            } else if (!isKeyDown) {
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

    async handleBlur(e: FocusEvent): Promise<void> {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        e.preventDefault();

        await EVENT_HANDLER_DELAY(250);

        await this.close();
    }

    handleFocus(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        this.componentActive = true;
    }

    async handleKeyDown(e: KeyboardEvent): Promise<void> {
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

                await this.close();

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

                await this.prepareSuggestions(text);

                break;
        }
    }

    async handleSuggestionSelection(suggestionIndex: number): Promise<void> {
        //#region functional members:

        const suggestionIndexIsValid = () =>
            suggestionIndex >= 0 &&
            suggestionIndex < this._autoCompleteSuggestions?.getSuggestionDataCount();

        const setTextAndValue = () => {
            const datum = this._autoCompleteSuggestions?.getSuggestionDatum(suggestionIndex);
            this.text = datum.text;
            this.value = datum.value;
        };

        //#endregion

        if (suggestionIndexIsValid()) {
            setTextAndValue();
            this.dispatchCustomEvent(
                CUSTOM_EVENT_NAME_SELECTED,
                { detail: this._autoCompleteSuggestions?.getSuggestionDatum(suggestionIndex) }
            );

            await this.clearData();

        }
    }

    async prepareSuggestions(text: string): Promise<void> {
        await this._autoCompleteSuggestions?.prepareSuggestions(text);

        if (this._autoCompleteSuggestions?.hasSuggestionData()) {
            await this.requestUpdate();
        }
    }

    updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);

        if (changedProperties.has(InputAutoCompleteBase.suggestionGeneratorPropertyName)) {
            this._autoCompleteSuggestions.suggestionGenerator = this.suggestionGenerator;
        }
    }
}
