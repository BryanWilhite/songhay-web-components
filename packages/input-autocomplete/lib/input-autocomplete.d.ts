import { TemplateResult } from 'lit-html';
import { PropertyValues } from 'lit-element/lib/updating-element';
import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputAutoCompleteBase } from './input-autocomplete-base';
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
    static get styles(): import("lit-element/lib/css-tag").CSSResult;
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
    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number): TemplateResult;
    /**
     * sets `this.suggestionsContainer`
     */
    setSuggestionsContainer(): void;
    /**
     * handles @type {AutoCompleteSuggestion} selection
     */
    handleSuggestionSelection(suggestionIndex: number): void;
}
