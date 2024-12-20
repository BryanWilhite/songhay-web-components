import { expect } from 'chai';
import { InputAutoComplete } from './input-autocomplete.js';

class DOMTestingUtility {
    static delay = (timeInMilliseconds: number) => new Promise((resolve: (value?: unknown) => void) => {
        setTimeout(function () { resolve(); }, timeInMilliseconds);
    })

    static async getDocumentNode(selector: string): Promise<Node> {
        return new Promise(resolve => {
            function requestComponent() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else {
                    window.requestAnimationFrame(requestComponent);
                }
            }
            requestComponent();
        });
    }
}

describe(InputAutoComplete.name, function () {
    let customElement: InputAutoComplete;
    let shadowRoot: ShadowRoot;
    let divElement: HTMLDivElement;
    let inputElement: HTMLInputElement;
    let unorderedListElement: HTMLUListElement;

    let countForInputElementFocus = 0;
    let countForInputElementKeyUp = 0;

    before(async function () {
        const node = await DOMTestingUtility.getDocumentNode('#web-component-container');

        const container = node as HTMLDivElement;
        expect(container).to.be.instanceOf(HTMLDivElement);
        expect(container.children).to.be.instanceOf(HTMLCollection);
        expect(container.children.length).to.be.eq(1);

        customElement = container.children[0] as InputAutoComplete;
});

    it('is rendered', function () {
        expect(customElement).to.be.instanceOf(InputAutoComplete);
        expect(customElement.localName).to.be.eq(InputAutoComplete.customElementName);

        customElement.suggestionGenerator = (text: string) => Promise.resolve([
            { text: 'one', value: '01' },
            { text: 'two', value: '02' },
            { text: 'three', value: '03' },
            { text: 'four', value: '05' },
            { text: 'five', value: '05' },
            { text: 'fifty', value: '50' },
            { text: 'fifty-one', value: '51' },
            { text: 'fifty-two', value: '52' },
            { text: 'fifty-three', value: '53' },
            { text: 'fifty-four', value: '54' },
            { text: 'fifty-five', value: '55' },
            { text: 'fifty-six', value: '56' },
            { text: 'fifty-seven', value: '57' },
            { text: 'fifty-eight', value: '58' },
            { text: 'fifty-nine', value: '59' },
        ].filter(i => {
            return (text !== '') ? i.text.startsWith(text) : false;
        }));
    });

    it('has a `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot as ShadowRoot;
        expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });

    it('has a `shadowRoot` with `style` element(s) and container',
        function () {
            const expectedShadowRootElementNames = [
                'div',
                'style',
            ];
            expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
            expect(shadowRoot.children.length).to.be.lessThanOrEqual(expectedShadowRootElementNames.length);

            const expectedContainerElementNames = [
                'input',
                'ul'
            ];
            divElement = shadowRoot.children[0] as HTMLDivElement;
            expect(divElement).to.be.instanceOf(HTMLDivElement);
            expect(divElement.children.length).to.be.eq(expectedContainerElementNames.length);
        });

    it('has an input element and suggestions element',
        function () {
            inputElement = divElement.children[0] as HTMLInputElement;
            expect(inputElement).to.be.instanceOf(HTMLInputElement);

            unorderedListElement = divElement.children[1] as HTMLUListElement;
            expect(unorderedListElement).to.be.instanceOf(HTMLUListElement);
        });

    it('has an `input` element with expected default properties/attributes',
        function () {
            expect(inputElement.disabled).eq(false);
            expect(inputElement.required).eq(customElement.required);

            expect(inputElement.id).eq(customElement.inputId);
            expect(inputElement.inputMode).eq(customElement.inputMode);
            expect(inputElement.placeholder).eq(customElement.placeholder);
        });

    it('has the expected number of suggestions after handling DOM events',
        async function () {
            expect(inputElement).to.be.instanceOf(HTMLInputElement);

            inputElement.addEventListener('focus', _ => ++countForInputElementFocus);
            inputElement.addEventListener('keyup', _ => ++countForInputElementKeyUp);
    
            const expectedNumberOfSuggestions = customElement.maxSuggestions;

            this.timeout(500);

            //#region expected initial state:

            expect(customElement.componentActive).to.eq(false);

            let collection = unorderedListElement.children;
            expect(collection).is.instanceOf(HTMLCollection);
            expect(collection.length).eq(0);

            //#endregion

            await DOMTestingUtility.delay(10);

            //#region expected `focus` state:

            const focusEvent = new FocusEvent('focus');
            inputElement.dispatchEvent(focusEvent);

            await DOMTestingUtility.delay(10);

            expect(countForInputElementFocus).to.be.greaterThan(0);

            inputElement.focus();

            //#endregion

            const keys = ['f', 'i', 'f', 't'];

            //#region expected `keyup` states:

            for (const key of keys) {
                const keyboardEvent = new KeyboardEvent('keyup', {
                    key: key,
                    shiftKey: true
                });

                inputElement.dispatchEvent(keyboardEvent);
                inputElement.value += key;

                await DOMTestingUtility.delay(10);
            }

            expect(countForInputElementKeyUp).eq(keys.length);

            expect(customElement.componentActive).to.eq(true);

            collection = unorderedListElement.children;
            expect(collection).is.instanceOf(HTMLCollection);
            expect(collection.length).eq(expectedNumberOfSuggestions);

            //#endregion

            await DOMTestingUtility.delay(10);

            inputElement.value = '';

            customElement.close();

        });
});
