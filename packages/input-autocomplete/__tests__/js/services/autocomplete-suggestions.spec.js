"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const autocomplete_suggestions_1 = require("./autocomplete-suggestions");
const suggestionGenerator = (text) => Promise.resolve([
    { text: 'one', value: '01' },
    { text: 'two', value: '02' },
    { text: 'three', value: '03' },
    { text: 'four', value: '05' },
    { text: 'five', value: '05' },
    { text: 'fifty-one', value: '51' },
    { text: 'fifty-two', value: '52' },
    { text: 'fifty-three', value: '53' },
    { text: 'fifty-four', value: '54' },
    { text: 'fifty-five', value: '55' },
].filter(i => i.text.startsWith(text)));
describe(autocomplete_suggestions_1.AutoCompleteSuggestions.name, function () {
    const suggestions = new autocomplete_suggestions_1.AutoCompleteSuggestions(suggestionGenerator);
    it('is constructed', function () {
        chai_1.expect(suggestions).is.instanceOf(autocomplete_suggestions_1.AutoCompleteSuggestions);
    });
    it('prepares one suggestion', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = 'o';
            yield suggestions.prepareSuggestions(input);
            console.log({ input, output: suggestions.suggestionData });
            chai_1.expect(suggestions).to.have.property('suggestionData').with.lengthOf(1);
        });
    });
    it('prepares two suggestions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = 't';
            yield suggestions.prepareSuggestions(input);
            console.log({ input, output: suggestions.suggestionData });
            chai_1.expect(suggestions).to.have.property('suggestionData').with.lengthOf(2);
        });
    });
    it('prepares five suggestions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = 'fi';
            yield suggestions.prepareSuggestions(input);
            console.log({ input, output: suggestions.suggestionData });
            chai_1.expect(suggestions).to.have.property('suggestionData').with.lengthOf(5);
        });
    });
    it('prepares zero suggestions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = 'z';
            yield suggestions.prepareSuggestions(input);
            console.log({ input, output: suggestions.suggestionData });
            chai_1.expect(suggestions).to.have.property('suggestionData').with.lengthOf(0);
        });
    });
});
//# sourceMappingURL=autocomplete-suggestions.spec.js.map