import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion';

export class AutoCompleteSuggestions {

    maxSuggestions: number;
    minInput: number;
    suggestionData: AutoCompleteSuggestion[] = [];
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;

    constructor(
        suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>,
        maxSuggestions: number = 5,
        minInput: number = 0
    ) {
        this.suggestionGenerator = suggestionGenerator;
        this.maxSuggestions = maxSuggestions;
        this.minInput = minInput;
    }

    clearData(): void {
        console.log('AutoCompleteSuggestions.clearData');
        this.suggestionData = [];
    }

    getSuggestionDatum(index: number): AutoCompleteSuggestion {
        return this.suggestionData[index];
    }

    getSuggestionDataCount(): number {
        return this.suggestionData.length;
    }

    hasSuggestionData(): boolean {
        return this.suggestionData.length > 0;
    }

    async prepareSuggestions(text: string): Promise<void> {

        //#region functional members:

        const textIsValid = () => (this.suggestionGenerator && (text.length >= this.minInput));

        //#endregion

        if (textIsValid()) {
            const suggestions = await this.suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.suggestionData = suggestions;
        } else {
            this.suggestionData = [];
        }
    }

}
