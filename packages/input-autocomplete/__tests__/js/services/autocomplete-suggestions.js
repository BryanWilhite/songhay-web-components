var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AutoCompleteSuggestions {
    constructor(suggestionGenerator = () => Promise.resolve([]), maxSuggestions = 5, minInput = 0) {
        this.suggestionData = [];
        this.suggestionGenerator = suggestionGenerator;
        this.maxSuggestions = maxSuggestions;
        this.minInput = minInput;
    }
    clearData() {
        this.suggestionData = [];
    }
    getSuggestionDatum(index) {
        return this.suggestionData[index];
    }
    getSuggestionDataCount() {
        return this.suggestionData.length;
    }
    hasSuggestionData() {
        return this.suggestionData.length > 0;
    }
    prepareSuggestions(text) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region functional members:
            const textIsValid = () => (this.suggestionGenerator && (text.length >= this.minInput));
            //#endregion
            if (textIsValid()) {
                const suggestions = yield this.suggestionGenerator(text);
                suggestions.splice(this.maxSuggestions);
                this.suggestionData = suggestions;
            }
            else {
                this.suggestionData = [];
            }
        });
    }
}
//# sourceMappingURL=autocomplete-suggestions.js.map