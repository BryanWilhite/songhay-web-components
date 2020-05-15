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
    it('is rendered', async function () {
        const container = await DOMTestingUtility.getDocumentNode('#web-component-container');
        chai.assert.isDefined(container);
        chai.assert.isNotNull(container);
    });
});
