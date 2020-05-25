import { InputAutoComplete } from './input-autocomplete';

class DOMTestingUtility {
    static delay = (timeInMilliseconds: number) => new Promise((resolve: () => void) => {
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

    before(async function () {
        const node = await DOMTestingUtility.getDocumentNode('#web-component-container');

        const container = node as HTMLDivElement;
        chai.expect(container).to.be.instanceOf(HTMLDivElement);
        chai.expect(container.children).to.be.instanceOf(HTMLCollection);
        chai.expect(container.children.length).to.be.eq(1);

        customElement = container.children[0] as InputAutoComplete;
    });

    it('is rendered', function () {
        chai.expect(customElement).to.be.instanceOf(InputAutoComplete);
        chai.expect(customElement.localName).to.be.eq(InputAutoComplete.customElementName);

        customElement.suggestionGenerator = (text: string) => Promise.resolve([
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
        ].filter(i => {
            return text ? i.text.startsWith(text) : false;
        }));
    });

    it('has a `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot as ShadowRoot;
        chai.expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });

    it('has a `shadowRoot` with `style` element, container, input element and suggestions element',
        function () {
            const expectedShadowRootElementNames = [
                'div',
                'style',
                'style',
                'style',
            ];
            chai.expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
            chai.expect(shadowRoot.children.length).to.be.eq(expectedShadowRootElementNames.length);

            const expectedContainerElementNames = [
                'input',
                'ul'
            ];
            divElement = shadowRoot.children[0] as HTMLDivElement;
            chai.expect(divElement).to.be.instanceOf(HTMLDivElement);
            chai.expect(divElement.children.length).to.be.eq(expectedContainerElementNames.length);

            inputElement = divElement.children[0] as HTMLInputElement;
            chai.expect(inputElement).to.be.instanceOf(HTMLInputElement);

            unorderedListElement = divElement.children[1] as HTMLUListElement;
            chai.expect(unorderedListElement).to.be.instanceOf(HTMLUListElement);
        });

    it('has an `input` element with expected default properties/attributes',
        function () {
            chai.expect(inputElement.disabled).eq(false);
            chai.expect(inputElement.required).eq(true);

            chai.expect(inputElement.id).eq(customElement.inputId);
            chai.expect(inputElement.inputMode).eq(customElement.inputMode);
            chai.expect(inputElement.placeholder).eq(customElement.placeholder);
        });

    it('has the expected number of suggestions after handling DOM events',
        async function () {
            const spyOn_handleFocus = chai.spy.on(customElement, 'handleFocus');
            const spyOn_handleKeyUp = chai.spy.on(customElement, 'handleKeyUp');

            const expectedNumberOfSuggestions = 5;

            this.timeout(500);

            //#region expected initial state:

            chai.expect(customElement.componentActive).to.eq(false);

            let collection = unorderedListElement.children;
            chai.expect(collection).is.instanceOf(HTMLCollection);
            chai.expect(collection.length).eq(0);

            //#endregion

            await DOMTestingUtility.delay(10);

            //#region expected `focus` state:

            const focusEvent = new FocusEvent('focus');
            inputElement.dispatchEvent(focusEvent);

            await DOMTestingUtility.delay(10);

            chai.expect(spyOn_handleFocus).to.have.been.called();

            inputElement.focus();

            //#endregion

            const keys = ['f', 'i', 'f'];

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

            chai.expect(spyOn_handleKeyUp).to.have.been.called.exactly(keys.length);

            chai.expect(customElement.componentActive).to.eq(true);

            collection = unorderedListElement.children;
            chai.expect(collection).is.instanceOf(HTMLCollection);
            chai.expect(collection.length).eq(expectedNumberOfSuggestions);

            //#endregion

            await DOMTestingUtility.delay(10);

            //#region expected `blur` state:

            const blurEvent = new FocusEvent('blur');
            inputElement.dispatchEvent(blurEvent);

            await DOMTestingUtility.delay(251); // `handleBlur` has a delay of 250ms 🕗

            chai.expect(customElement.componentActive).to.eq(false);

            inputElement.value = '';

            //#endregion
        });
});
