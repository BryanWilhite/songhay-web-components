import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion';

export class AutoCompleteSuggestions {

    maxSuggestions = 5;
    minInput = 0;
    suggestionData: AutoCompleteSuggestion[] = [];

    private _suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;

    constructor(
        suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>
    ) {
        this._suggestionGenerator = suggestionGenerator;
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
