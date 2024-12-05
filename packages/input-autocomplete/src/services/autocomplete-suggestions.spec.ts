import { expect } from 'chai';

import { AutoCompleteSuggestions } from './autocomplete-suggestions.js';

const suggestionGenerator = (text: string) => Promise.resolve([
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

describe(AutoCompleteSuggestions.name, function () {
    const suggestions = new AutoCompleteSuggestions(suggestionGenerator);

    it('is constructed', function () {
        expect(suggestions).is.instanceOf(AutoCompleteSuggestions);
    });

    it('prepares one suggestion', async function() {
        const input = 'o';

        await suggestions.prepareSuggestions(input);

        console.log({input, output: suggestions.suggestionData});

        expect(suggestions).to.have.property('suggestionData').with.lengthOf(1);
    });

    it('prepares two suggestions', async function() {
        const input = 't';

        await suggestions.prepareSuggestions(input);

        console.log({input, output: suggestions.suggestionData});

        expect(suggestions).to.have.property('suggestionData').with.lengthOf(2);
    });

    it('prepares five suggestions', async function() {
        const input = 'fi';

        await suggestions.prepareSuggestions(input);

        console.log({input, output: suggestions.suggestionData});

        expect(suggestions).to.have.property('suggestionData').with.lengthOf(5);
    });

    it('prepares zero suggestions', async function() {
        const input = 'z';

        await suggestions.prepareSuggestions(input);

        console.log({input, output: suggestions.suggestionData});

        expect(suggestions).to.have.property('suggestionData').with.lengthOf(0);
    });
});
