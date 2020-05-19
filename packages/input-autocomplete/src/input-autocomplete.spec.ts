import { InputAutoComplete } from './input-autocomplete';

class DOMTestingUtility {
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
        ].filter(i => i.text.startsWith(text)));
    });

    it('has a `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot as ShadowRoot;
        chai.expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });

    it('has a `shadowRoot` with container, input element and suggestions element', function () {
        chai.expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
        chai.expect(shadowRoot.children.length).to.be.eq(1);

        divElement = shadowRoot.children[0] as HTMLDivElement;
        chai.expect(divElement).to.be.instanceOf(HTMLDivElement);
        chai.expect(divElement.children.length).to.be.eq(2);

        inputElement = divElement.children[0] as HTMLInputElement;
        chai.expect(inputElement).to.be.instanceOf(HTMLInputElement);
    });

    it('has an `input` element with expected default properties/attributes', function () {
        chai.expect(inputElement.disabled).eq(false);
        chai.expect(inputElement.required).eq(true);

        chai.expect(inputElement.id).eq(customElement.inputId);
        chai.expect(inputElement.inputMode).eq(customElement.inputMode);
        chai.expect(inputElement.placeholder).eq(customElement.placeholder);
    });
});
