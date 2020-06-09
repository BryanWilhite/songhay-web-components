import { LitElement, PropertyValues } from 'lit-element';
import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputModes } from './types/input-modes';
import { AutoCompleteSuggestions } from './services/autocomplete-suggestions';
/**
 * defines the base class for this Web Component
 *
 * @extends {LitElement}
 */
export declare abstract class InputAutoCompleteBase extends LitElement {
    /**
     * the conventional property name of `this.suggestionGenerator`
     */
    static suggestionGeneratorPropertyName: string;
    /**
     * the conventional property name of `this.maxSuggestions`
     */
    static maxSuggestionsPropertyName: string;
    /**
     * the conventional property name of `this.minInput`
     */
    static minInputPropertyName: string;
    /**
     * tracks the active @type {AutoCompleteSuggestion} in the DOM
     */
    activeSuggestionIndex: number;
    /**
     * when `true` the `input` element has received focus
     */
    componentActive: boolean;
    /**
     * exposes the @type {AutoCompleteSuggestions} service
     * to subclasses
     */
    protected _autoCompleteSuggestions: AutoCompleteSuggestions;
    /**
     * LitElement property/attribute
     * for the ID of the `input` element
     */
    inputId: string;
    /**
     * LitElement property/attribute
     * for the placeholder value
     * of the `input` element
     */
    placeholder: string;
    /**
     * LitElement property/attribute
     * for the text displayed in the `input` element
     */
    text: string;
    /**
     * LitElement property/attribute
     * for the value selected by this Web Component
     */
    value: string;
    /**
     * LitElement property/attribute
     * determining whether this Web Component is
     * enabled or disabled in the DOM
     */
    disabled: boolean;
    /**
     * LitElement property/attribute
     * determining whether this Web Component
     * value is required
     */
    required: boolean;
    /**
     * LitElement property/attribute
     * setting the maximum number
     * of @type {AutoCompleteSuggestion} elements
     * to display
     */
    maxSuggestions: number;
    /**
     * LitElement property/attribute
     * setting the minimum number
     * of text characters entered
     * before @type {AutoCompleteSuggestion} elements
     * are displayed
     */
    minInput: number;
    /**
     * LitElement property/attribute
     * for the input mode of the `input` element
     * for OS virtual keyboards
     */
    inputMode: InputModes;
    /**
     * LitElement property/attribute
     * for the generation strategy
     * of @type {AutoCompleteSuggestion} elements
     */
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;
    /**
     * clear the @type {AutoCompleteSuggestion} data
     * and call `.requestUpdate()`
     */
    clearSuggestionData(): Promise<void>;
    /**
     * clear any @type {AutoCompleteSuggestion}
     * previously selected
     */
    clearSuggestionSelection(clearOnlyValue?: boolean): void;
    /**
     * clear @type {AutoCompleteSuggestion} data
     * and selection
     */
    close(): Promise<void>;
    /**
     * emit the custom events of this Web Component
     */
    dispatchCustomEvent(eventName: string, data: {
        detail: any;
    }): void;
    /**
     * handle the focus event of the `input` element
     * of this Web Component
     */
    handleFocus(e: FocusEvent): void;
    /**
     * handle the `keydown` event of the `input` element
     * of this Web Component
     */
    handleKeyDown(e: KeyboardEvent): Promise<void>;
    /**
     * handle the `keyup` event of the `input` element
     * of this Web Component
     */
    handleKeyUp(e: KeyboardEvent): Promise<void>;
    /**
     * handle the click event
     * of a selected @type {AutoCompleteSuggestion} element
     * of this Web Component
     */
    handleSuggestionClick(suggestionIndex: number): Promise<void>;
    /**
     * prepares @type {AutoCompleteSuggestion} element display
     * based on the specified text input
     */
    prepareSuggestions(text: string): Promise<void>;
    /**
     * sets `this.activeSuggestionIndex`
     * based on the specified Arrow-key input
     */
    setActiveSuggestionIndex(key: string): void;
    /**
     * conventional LitElement method
     */
    updated(changedProperties: PropertyValues): void;
    /**
     * requires sub-classes
     * to handle @type {AutoCompleteSuggestion} element selection
     */
    protected abstract handleSuggestionSelection(suggestionIndex: number): void;
}
