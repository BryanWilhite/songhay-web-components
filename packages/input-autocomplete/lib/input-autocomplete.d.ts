import { PropertyValues, TemplateResult } from 'lit';
import { AutoCompleteSuggestion } from './models/autocomplete-suggestion.js';
import { InputAutoCompleteBase } from './input-autocomplete-base.js';
/**
 * defines rendering methods for @type {InputAutoCompleteBase}
 *
 * @export
 * @extends {InputAutoCompleteBase}
 */
export declare class InputAutoComplete extends InputAutoCompleteBase {
    /**
     * conventional element name of this Web Component
     */
    static customElementName: string;
    /**
     * references the auto-complete DOM container
     * of suggestions
     */
    suggestionsContainer: HTMLUListElement | null;
    /**
     * renders CSS according to LitElement conventions
     */
    static get styles(): import("lit").CSSResult;
    /**
     * conventional LitElement method
     */
    firstUpdated(changedProperties: PropertyValues): void;
    /**
     * conventional LitElement method
     */
    render(): TemplateResult;
    /**
     * renders @type {AutoCompleteSuggestion}
     */
    renderSuggestion(data: AutoCompleteSuggestion, index: number): TemplateResult;
    /**
     * sets `this.suggestionsContainer`
     */
    setSuggestionsContainer(): void;
    /**
     * handles @type {AutoCompleteSuggestion} selection
     */
    handleSuggestionSelection(suggestionIndex: number): void;
}
