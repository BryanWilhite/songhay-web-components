import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion';
export declare class AutoCompleteSuggestions {
    maxSuggestions: number;
    minInput: number;
    suggestionData: AutoCompleteSuggestion[];
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;
    constructor(suggestionGenerator?: (text: string) => Promise<AutoCompleteSuggestion[]>, maxSuggestions?: number, minInput?: number);
    clearData(): void;
    getSuggestionDatum(index: number): AutoCompleteSuggestion;
    getSuggestionDataCount(): number;
    hasSuggestionData(): boolean;
    prepareSuggestions(text: string): Promise<void>;
}
