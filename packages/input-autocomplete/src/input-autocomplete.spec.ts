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
    let customElement: HTMLElement;
    let shadowRoot: ShadowRoot;
    let divElement: HTMLDivElement;
    let inputElement: HTMLInputElement;

    before(async function () {
        const node = await DOMTestingUtility.getDocumentNode('#web-component-container');

        const container = node as HTMLDivElement;
        chai.expect(container).to.be.instanceOf(HTMLDivElement);
        chai.expect(container.children).to.be.instanceOf(HTMLCollection);
        chai.expect(container.children.length).to.be.eq(1);

        customElement = container.children[0] as HTMLElement;
    });

    it('is rendered', function () {
        chai.expect(customElement).to.be.instanceOf(HTMLElement);
        chai.expect(customElement.localName).to.be.eq(InputAutoComplete.customElementName);
    });

    it('has `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot as ShadowRoot;
        chai.expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });

    it('has a `shadowRoot` with container and input element', function () {
        chai.expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
        chai.expect(shadowRoot.children.length).to.be.eq(1);

        divElement = shadowRoot.children[0] as HTMLDivElement;
        chai.expect(divElement).to.be.instanceOf(HTMLDivElement);
        chai.expect(divElement.children.length).to.be.eq(1);

        inputElement = divElement.children[0] as HTMLInputElement;
        chai.expect(inputElement).to.be.instanceOf(HTMLInputElement);
    });
});
