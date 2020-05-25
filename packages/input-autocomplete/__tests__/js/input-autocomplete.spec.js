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
DOMTestingUtility.delay = (timeInMilliseconds) => new Promise((resolve) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});
describe(InputAutoComplete.name, function () {
    let customElement;
    let shadowRoot;
    let divElement;
    let inputElement;
    let unorderedListElement;
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
        chai.expect(customElement).to.be.instanceOf(InputAutoComplete);
        chai.expect(customElement.localName).to.be.eq(InputAutoComplete.customElementName);
        customElement.suggestionGenerator = (text) => Promise.resolve([
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
            return i.text.startsWith(text);
        }));
    });
    it('has a `shadowRoot`', function () {
        shadowRoot = customElement.shadowRoot;
        chai.expect(shadowRoot).to.be.instanceOf(ShadowRoot);
    });
    it('has a `shadowRoot` with container, input element and suggestions element', function () {
        chai.expect(shadowRoot.children).to.be.instanceOf(HTMLCollection);
        chai.expect(shadowRoot.children.length).to.be.eq(1);
        divElement = shadowRoot.children[0];
        chai.expect(divElement).to.be.instanceOf(HTMLDivElement);
        chai.expect(divElement.children.length).to.be.eq(2);
        inputElement = divElement.children[0];
        chai.expect(inputElement).to.be.instanceOf(HTMLInputElement);
        unorderedListElement = divElement.children[1];
        chai.expect(unorderedListElement).to.be.instanceOf(HTMLUListElement);
    });
    it('has an `input` element with expected default properties/attributes', function () {
        chai.expect(inputElement.disabled).eq(false);
        chai.expect(inputElement.required).eq(true);
        chai.expect(inputElement.id).eq(customElement.inputId);
        chai.expect(inputElement.inputMode).eq(customElement.inputMode);
        chai.expect(inputElement.placeholder).eq(customElement.placeholder);
    });
    it('has the expected number of suggestions after handling DOM events', function () {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield DOMTestingUtility.delay(10);
            //#region expected `focus` state:
            const focusEvent = new FocusEvent('focus');
            inputElement.dispatchEvent(focusEvent);
            yield DOMTestingUtility.delay(10);
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
                yield DOMTestingUtility.delay(10);
            }
            chai.expect(spyOn_handleKeyUp).to.have.been.called.exactly(keys.length);
            chai.expect(customElement.componentActive).to.eq(true);
            collection = unorderedListElement.children;
            chai.expect(collection).is.instanceOf(HTMLCollection);
            chai.expect(collection.length).eq(expectedNumberOfSuggestions);
            //#endregion
            yield DOMTestingUtility.delay(10);
            //#region expected `blur` state:
            const blurEvent = new FocusEvent('blur');
            inputElement.dispatchEvent(blurEvent);
            yield DOMTestingUtility.delay(251); // `handleBlur` has a delay of 250ms 🕗
            chai.expect(customElement.componentActive).to.eq(false);
            inputElement.value = '';
            //#endregion
        });
    });
});
//# sourceMappingURL=input-autocomplete.spec.js.map