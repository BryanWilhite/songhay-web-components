import { AutoCompleteSuggestion } from '../models/autocomplete-suggestion.js';
/**
 * defines routines
 * for @type {AutoCompleteSuggestion} data
 */
export declare class AutoCompleteSuggestions {
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
    suggestionData: AutoCompleteSuggestion[];
    /**
     * gets/sets the generation strategy
     * of @type {AutoCompleteSuggestion} elements
     */
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;
    /**
     * creates an instance of @type {AutoCompleteSuggestions}
     */
    constructor(suggestionGenerator?: (text: string) => Promise<AutoCompleteSuggestion[]>, maxSuggestions?: number, minInput?: number);
    /**
     * clear any @type {AutoCompleteSuggestion} data
     */
    clearData(): void;
    /**
     * get @type {AutoCompleteSuggestion} datum
     * at the specified index
     */
    getSuggestionDatum(index: number): AutoCompleteSuggestion | null;
    /**
     * get the @type {AutoCompleteSuggestion} data count
     */
    getSuggestionDataCount(): number;
    /**
     * return `true` when this instance
     * has @type {AutoCompleteSuggestion} data
     */
    hasSuggestionData(): boolean;
    /**
     * prepare @type {AutoCompleteSuggestion} data
     * based on the specified text input
     */
    prepareSuggestions(text: string): Promise<void>;
}
