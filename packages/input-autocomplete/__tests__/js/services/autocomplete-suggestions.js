/**
 * defines routines
 * for @type {AutoCompleteSuggestion} data
 */
export class AutoCompleteSuggestions {
    /**
     * creates an instance of @type {AutoCompleteSuggestions}
     */
    constructor(suggestionGenerator = () => Promise.resolve([]), maxSuggestions = 5, minInput = 0) {
        /**
         * gets/sets the array
         * of @type {AutoCompleteSuggestion} data
         */
        this.suggestionData = [];
        this.suggestionGenerator = suggestionGenerator;
        this.maxSuggestions = maxSuggestions;
        this.minInput = minInput;
    }
    /**
     * clear any @type {AutoCompleteSuggestion} data
     */
    clearData() {
        this.suggestionData = [];
    }
    /**
     * get @type {AutoCompleteSuggestion} datum
     * at the specified index
     */
    getSuggestionDatum(index) {
        const data = this.suggestionData.length > index ? this.suggestionData[index] : null;
        if (data === undefined) {
            return null;
        }
        return data;
    }
    /**
     * get the @type {AutoCompleteSuggestion} data count
     */
    getSuggestionDataCount() {
        return this.suggestionData.length;
    }
    /**
     * return `true` when this instance
     * has @type {AutoCompleteSuggestion} data
     */
    hasSuggestionData() {
        return this.suggestionData.length > 0;
    }
    /**
     * prepare @type {AutoCompleteSuggestion} data
     * based on the specified text input
     */
    async prepareSuggestions(text) {
        const textIsValid = () => (text.length >= this.minInput);
        if (textIsValid()) {
            const suggestions = await this.suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.suggestionData = suggestions;
        }
        else {
            this.suggestionData = [];
        }
    }
}
