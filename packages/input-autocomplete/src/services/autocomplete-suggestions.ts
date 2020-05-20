import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion';

export class AutoCompleteSuggestions {

    maxSuggestions: number;
    minInput: number;
    suggestionData: AutoCompleteSuggestion[] = [];

    private _suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;

    constructor(
        suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>,
        maxSuggestions: number = 5,
        minInput: number = 0
    ) {
        this._suggestionGenerator = suggestionGenerator;
        this.maxSuggestions = maxSuggestions;
        this.minInput = minInput;
    }

    clearData(): void {
        this.suggestionData = [];
    }

    async prepareSuggestions(text: string): Promise<void> {
        if (this._suggestionGenerator && (text.length >= this.minInput)) {
            const suggestions = await this._suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.suggestionData = suggestions;
        } else {
            this.suggestionData = [];
        }
    }

}
