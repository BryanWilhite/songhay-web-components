import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion.js';

/**
 * defines routines
 * for @type {AutoCompleteSuggestion} data
 */
export class AutoCompleteSuggestions {

    /**
     * gets/sets the maximum number
     * of @type {AutoCompleteSuggestion} elements
     * to display
     */
    maxSuggestions: number;

    /**
     * gets.sets the minimum number
     * of text characters entered
     * before @type {AutoCompleteSuggestion} elements
     * are displayed
     */
    minInput: number;

    /**
     * gets/sets the array
     * of @type {AutoCompleteSuggestion} data
     */
    suggestionData: AutoCompleteSuggestion[] = [];

    /**
     * gets/sets the generation strategy
     * of @type {AutoCompleteSuggestion} elements
     */
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;

    /**
     * creates an instance of @type {AutoCompleteSuggestions}
     */
    constructor(
        suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]> = () => Promise.resolve([]),
        maxSuggestions: number = 5,
        minInput: number = 0
    ) {
        this.suggestionGenerator = suggestionGenerator;
        this.maxSuggestions = maxSuggestions;
        this.minInput = minInput;
    }

    /**
     * clear any @type {AutoCompleteSuggestion} data
     */
    clearData(): void {
        this.suggestionData = [];
    }

    /**
     * get @type {AutoCompleteSuggestion} datum
     * at the specified index
     */
    getSuggestionDatum(index: number): AutoCompleteSuggestion | null {
        const data = this.suggestionData.length > index ? this.suggestionData[index] : null;

        if(data === undefined)
        {
            return null;
        }

        return data;
    }

    /**
     * get the @type {AutoCompleteSuggestion} data count
     */
    getSuggestionDataCount(): number {
        return this.suggestionData.length;
    }

    /**
     * return `true` when this instance
     * has @type {AutoCompleteSuggestion} data
     */
    hasSuggestionData(): boolean {
        return this.suggestionData.length > 0;
    }

    /**
     * prepare @type {AutoCompleteSuggestion} data
     * based on the specified text input
     */
    async prepareSuggestions(text: string): Promise<void> {

        const textIsValid = () => (text.length >= this.minInput);

        if (textIsValid()) {
            const suggestions = await this.suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.suggestionData = suggestions;
        } else {
            this.suggestionData = [];
        }
    }
}
