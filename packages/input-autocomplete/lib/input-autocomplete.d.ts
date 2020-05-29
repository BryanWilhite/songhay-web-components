import { TemplateResult } from 'lit-html';
import { PropertyValues } from 'lit-element/lib/updating-element';
import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputAutoCompleteBase } from './input-autocomplete-base';
export declare class InputAutoComplete extends InputAutoCompleteBase {
    static customElementName: string;
    suggestionsContainer: HTMLUListElement | null;
    static get styles(): import("lit-element/lib/css-tag").CSSResult;
    firstUpdated(changedProperties: PropertyValues): void;
    render(): TemplateResult;
    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number): TemplateResult;
    setSuggestionsContainer(): void;
    handleSuggestionSelection(suggestionIndex: number): void;
}
