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
    constructor(suggestionGenerator) {
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.suggestionData = [];
        this._suggestionGenerator = suggestionGenerator;
    }
    clearData() {
        this.suggestionData = [];
    }
    prepareSuggestions(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._suggestionGenerator && (text.length >= this.minInput)) {
                const suggestions = yield this._suggestionGenerator(text);
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