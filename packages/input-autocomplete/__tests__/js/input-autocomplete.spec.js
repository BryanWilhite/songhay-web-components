var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InputAutoComplete } from './input-autocomplete';
class DOMTestingUtility {
    static getDocumentNode(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                function requestComponent() {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                    }
                    else {
                        window.requestAnimationFrame(requestComponent);
                    }
                }
                requestComponent();
            });
        });
    }
}
describe(InputAutoComplete.name, function () {
    let customElement;
    let shadowRoot;
    let divElement;
    let inputElement;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield DOMTestingUtility.getDocumentNode('#web-component-container');
            const container = node;
            chai.expect(container).to.be.instanceOf(HTMLDivElement);
            chai.expect(container.children).to.be.instanceOf(HTMLCollection);
            chai.expect(container.children.length).to.be.eq(1);
            customElement = container.children[0];
        });
    });
    it('is rendered', function () {
        chai.expect(customElement).to.be.instanceOf(HTMLElement);
        chai.expect(customElement.localName).to.be.eq(InputAutoComplete.customElementName);
    });
    it('has `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot;
        chai.expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });
    it('has a `shadowRoot` with container and input element', function () {
        chai.expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
        chai.expect(shadowRoot.children.length).to.be.eq(1);
        divElement = shadowRoot.children[0];
        chai.expect(divElement).to.be.instanceOf(HTMLDivElement);
        chai.expect(divElement.children.length).to.be.eq(1);
        inputElement = divElement.children[0];
        chai.expect(inputElement).to.be.instanceOf(HTMLInputElement);
    });
});
//# sourceMappingURL=input-autocomplete.spec.js.map