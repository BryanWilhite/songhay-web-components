import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion.js';
import { Key } from './models/key.js';

import { InputModes } from './types/input-modes.js';

import { AutoCompleteSuggestions } from './services/autocomplete-suggestions.js';

const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';

const EVENT_HANDLER_DELAY = (timeInMilliseconds: number) => new Promise(resolve => setTimeout(resolve, timeInMilliseconds));

/**
 * defines the base class for this Web Component
 *
 * @extends {LitElement}
 */
export abstract class InputAutoCompleteBase extends LitElement {

    /**
     * the conventional property name of `this.suggestionGenerator`
     */
    static suggestionGeneratorPropertyName = 'suggestionGenerator';

    /**
     * the conventional property name of `this.maxSuggestions`
     */
    static maxSuggestionsPropertyName = 'maxSuggestions';

    /**
     * the conventional property name of `this.minInput`
     */
    static minInputPropertyName = 'minInput';

    /**
     * tracks the active @type {AutoCompleteSuggestion} in the DOM
     */
    activeSuggestionIndex = -1;

    /**
     * when `true` the `input` element has received focus
     */
    componentActive = false;

    /**
     * exposes the @type {AutoCompleteSuggestions} service
     * to subclasses
     */
    protected _autoCompleteSuggestions = new AutoCompleteSuggestions();

    /**
     * LitElement property/attribute
     * for the ID of the `input` element
     */
    @property({ type: String }) inputId = '';

    /**
     * LitElement property/attribute
     * for the placeholder value
     * of the `input` element
     */
    @property({ type: String }) placeholder = '';

    /**
     * LitElement property/attribute
     * for the text displayed in the `input` element
     */
    @property({ type: String }) text = '';

    /**
     * LitElement property/attribute
     * for the value selected by this Web Component
     */
    @property({ type: String }) value = '';

    /**
     * LitElement property/attribute
     * determining whether this Web Component is
     * enabled or disabled in the DOM
     */
    @property({ type: Boolean }) disabled = false;

    /**
     * LitElement property/attribute
     * determining whether this Web Component
     * value is required
     */
    @property({ type: Boolean }) required = false;

    /**
     * LitElement property/attribute
     * setting the maximum number
     * of @type {AutoCompleteSuggestion} elements
     * to display
     */
    @property({ type: Number }) maxSuggestions = 5;

    /**
     * LitElement property/attribute
     * setting the minimum number
     * of text characters entered
     * before @type {AutoCompleteSuggestion} elements
     * are displayed
     */
    @property({ type: Number }) minInput = 0;

    /**
     * LitElement property/attribute
     * for the input mode of the `input` element
     * for OS virtual keyboards
     */
    @property({ type: Object }) override inputMode: InputModes = 'text';

    /**
     * LitElement property/attribute
     * for the generation strategy
     * of @type {AutoCompleteSuggestion} elements
     */
    @property({ type: Object }) suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]> = () => Promise.resolve([]);

    override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {

        const getNumber = (x: string | null) => {
            const s = x as string;
            return (!s) ? 0 : parseInt(s, 10);
        };

        switch (name.toLowerCase()) {
            case InputAutoCompleteBase.maxSuggestionsPropertyName.toLowerCase():
                this._autoCompleteSuggestions.maxSuggestions = getNumber(newVal);
                break;

            case InputAutoCompleteBase.minInputPropertyName.toLowerCase():
                this._autoCompleteSuggestions.minInput = getNumber(newVal);
                break;
        }

        super.attributeChangedCallback(name, oldVal, newVal);
    }

    /**
     * clear the @type {AutoCompleteSuggestion} data
     * and call `.requestUpdate()`
     */
    async clearSuggestionData(): Promise<void> {
        this._autoCompleteSuggestions?.clearData();

        await this.requestUpdate();

        this.activeSuggestionIndex = -1;
        this.componentActive = false;
    }

    /**
     * clear any @type {AutoCompleteSuggestion}
     * previously selected
     */
    clearSuggestionSelection(clearOnlyValue = false): void {

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

    /**
     * clear @type {AutoCompleteSuggestion} data
     * and selection
     */
    async close(): Promise<void> {
        this.clearSuggestionSelection();

        await this.clearSuggestionData();

    }

    /**
     * emit the custom events of this Web Component
     */
    dispatchCustomEvent(eventName: string, data: { detail: any }): void {
        switch (eventName) {
            case CUSTOM_EVENT_NAME_SELECTED:
            case CUSTOM_EVENT_NAME_UNSELECTED:
                this.dispatchEvent(new CustomEvent(eventName, data));
                break;
        }
    }

    /**
     * handle the focus event of the `input` element
     * of this Web Component
     */
    handleFocus(e: FocusEvent): void {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }

        this.componentActive = true;
    }

    /**
     * handle the `keydown` event of the `input` element
     * of this Web Component
     */
    async handleKeyDown(e: KeyboardEvent): Promise<void> {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }

        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
                this.setActiveSuggestionIndex(e.key);
                this.handleSuggestionSelection(this.activeSuggestionIndex);
                break;

            case Key.Enter:
            case Key.Tab:
                e.preventDefault();
                this.handleSuggestionClick(this.activeSuggestionIndex);
                break;

            case Key.Escape:

                await this.close();

                break;
        }
    }

    /**
     * handle the `keyup` event of the `input` element
     * of this Web Component
     */
    async handleKeyUp(e: KeyboardEvent): Promise<void> {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }

        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }

        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
            case Key.Enter:
            case Key.Tab:
            case Key.Escape:
                e.preventDefault();
                this.clearSuggestionSelection(true);
                break;

            default:

                const target = e.target as HTMLInputElement;

                if('value' in target === false)
                {
                    console.error('The expected KeyboardEvent EventTarget value is not here.');

                    break;
                }

                const text: string = target.value;

                await this.prepareSuggestions(text);

                break;
        }
    }

    /**
     * handle the click event
     * of a selected @type {AutoCompleteSuggestion} element
     * of this Web Component
     */
    async handleSuggestionClick(suggestionIndex: number): Promise<void> {
        //#region functional members:

        const suggestionIndexIsValid = () =>
            suggestionIndex >= 0 &&
            suggestionIndex < this._autoCompleteSuggestions?.getSuggestionDataCount();

        const setTextAndValue = async () => {
            const datum = this._autoCompleteSuggestions?.getSuggestionDatum(suggestionIndex);

            // prevent browsers from caching previous values:

            this.text = '';
            this.value = '';

            await EVENT_HANDLER_DELAY(50);

            this.text = datum?.text ?? '';
            this.value = datum?.value ?? '';
        };

        //#endregion

        if (suggestionIndexIsValid()) {
            setTextAndValue();
            this.dispatchCustomEvent(
                CUSTOM_EVENT_NAME_SELECTED,
                {
                    detail: this._autoCompleteSuggestions
                        ?.getSuggestionDatum(suggestionIndex)
                }
            );

            await this.clearSuggestionData();

        }
    }

    /**
     * prepares @type {AutoCompleteSuggestion} element display
     * based on the specified text input
     */
    async prepareSuggestions(text: string): Promise<void> {

        await this._autoCompleteSuggestions?.prepareSuggestions(text);

        await this.requestUpdate();
    }

    /**
     * sets `this.activeSuggestionIndex`
     * based on the specified Arrow-key input
     */
    setActiveSuggestionIndex(key: string): void {
        if (!this._autoCompleteSuggestions?.hasSuggestionData()) {
            return;
        }

        const isArrowDownKey = (key === Key.ArrowDown);

        //#region functional members:

        const activeSuggestionIndexIsValid = () => (
            (this.activeSuggestionIndex + 1) < this._autoCompleteSuggestions?.getSuggestionDataCount());
        const setActiveSuggestionIndexBoundary = () => {
            if (isArrowDownKey) {
                this.activeSuggestionIndex = 0;
            } else if (!isArrowDownKey && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            } else if (!isArrowDownKey) {
                this.activeSuggestionIndex = this._autoCompleteSuggestions?.getSuggestionDataCount() - 1;
            }
        };

        //#endregion

        if (isArrowDownKey && activeSuggestionIndexIsValid()) {
            this.activeSuggestionIndex += 1;
        } else {
            setActiveSuggestionIndexBoundary();
        }
    }

    /**
     * conventional LitElement method
     */
    override updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);

        if (changedProperties.has(InputAutoCompleteBase.suggestionGeneratorPropertyName)) {
            this._autoCompleteSuggestions.suggestionGenerator = this.suggestionGenerator;
        }
    }

    /**
     * requires sub-classes
     * to handle @type {AutoCompleteSuggestion} element selection
     */
    protected abstract handleSuggestionSelection(suggestionIndex: number): void;

}
