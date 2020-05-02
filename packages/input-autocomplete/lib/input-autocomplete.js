import { __decorate } from "tslib";
import { BehaviorSubject } from 'rxjs';
import { customElement, html, LitElement, property } from 'lit-element';
import { AutoCompleteCssClasses } from './models/autocomplete-css-classes';
let InputAutoComplete = class InputAutoComplete extends LitElement {
    constructor() {
        super();
        this._suggestionSubject = new BehaviorSubject([]);
        this._subscriptions = [];
        this.active = false;
        this.activeIndex = -1;
        this.data = [];
        this.disabled = false;
        this.required = true;
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.cssClasses = new AutoCompleteCssClasses();
        this.inputMode = 'none';
        this.suggestionGenerator = this._suggestionSubject.asObservable();
        this.inputId = '';
        this.placeholder = '';
        this.text = '';
        this.value = '';
        const sub = this.suggestionGenerator.subscribe();
        this._subscriptions.push(sub);
        window.addEventListener('unload', this.handleUnload);
    }
    clearData() {
        this.data = [];
        this.activeIndex = -1;
        this.active = false;
    }
    clearSelection(clearOnlyValue = false) {
        if (this.value != '') {
            this.dispatchEvent(new CustomEvent('unselected', {
                detail: {
                    text: this.text,
                    value: this.value
                }
            }));
            this.value = '';
        }
        if (!clearOnlyValue) {
            this.text = '';
        }
    }
    getSuggestionsCssClasses(index) {
        return `${this.cssClasses.suggestion}${(this.activeIndex === index) ? ' ' + this.cssClasses.active : ''}`;
    }
    handleActivation(next = true) {
        if (this.data.length > 0) {
            if (next && (this.activeIndex + 1) < this.data.length) {
                this.activeIndex += 1;
            }
            else if (next) {
                this.activeIndex = 0;
            }
            else if (!next && (this.activeIndex) > 0) {
                this.activeIndex -= 1;
            }
            else if (!next) {
                this.activeIndex = this.data.length - 1;
            }
        }
    }
    handleBlur(e) {
        e.preventDefault();
        setTimeout(() => {
            if (this.active) {
                if (this.value) {
                    this.clearData();
                }
                else {
                    this.handleClose();
                }
            }
        }, 250);
    }
    handleClose() {
        this.clearSelection();
        this.clearData();
    }
    handleFocus(e) {
        e.preventDefault();
        this.active = true;
    }
    handleKeyDown(e) {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }
        const keyCode = e.keyCode;
        if (keyCode == 40 || keyCode == 38) { // up/down arrows
            e.preventDefault();
            this.handleActivation(keyCode == 40);
        }
        else if (keyCode == 13 || keyCode == 9) { // enter/tab
            e.preventDefault();
            this.handleSelection(this.activeIndex);
        }
        else if (keyCode == 27) { // esc
            this.handleClose();
        }
    }
    handleKeyUp(e) {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }
        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }
        const keyCode = e.keyCode;
        const text = e.target['value'];
        if ([40, 38, 13, 9, 27].indexOf(keyCode) < 0) {
            this.clearSelection(true);
            this._suggestionSubject.next(text);
        }
        this.active = true;
        this.text = text;
    }
    handleSelection(index) {
        if (index >= 0 && index < this.data.length) {
            this.text = this.data[index].text;
            this.value = this.data[index].value;
            this.dispatchEvent(new CustomEvent('selected', { detail: this.data[index] }));
            this.clearData();
        }
    }
    handleUnload() {
        this._subscriptions.forEach(i => {
            if (i) {
                i.unsubscribe();
            }
        });
    }
    hasData() {
        return this.data && this.data.length > 0;
    }
    render() {
        return html `
        <div .class=${this.cssClasses.wrapper}>
            <input
                @blur="${this.handleBlur}"
                @focus="${this.handleFocus}"
                @keyDown="${this.handleKeyDown}"
                @keyUp="${this.handleKeyUp}"

                ?disabled="${this.disabled}"

                .class="${this.cssClasses.input}"
                .id="${this.inputId}"
                .inputMode="${this.inputMode}"
                .placeholder="${this.placeholder}"
                .required="${this.required}"
                .value="${this.text}"

                autocomplete="off"
                type="text"

                />

            ${this.hasData() ? this.renderSuggestions() : ''}
        </div>`;
    }
    renderSuggestion(suggestion, index) {
        return html `
        <button
            @click="${() => this.handleSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }
    renderSuggestions() {
        return html `
        <div class="${this.cssClasses.suggestions}">
            ${this.data.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
        </div>`;
    }
};
__decorate([
    property({ type: Boolean })
], InputAutoComplete.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], InputAutoComplete.prototype, "required", void 0);
__decorate([
    property({ type: Number })
], InputAutoComplete.prototype, "maxSuggestions", void 0);
__decorate([
    property({ type: Number })
], InputAutoComplete.prototype, "minInput", void 0);
__decorate([
    property({ type: Object })
], InputAutoComplete.prototype, "cssClasses", void 0);
__decorate([
    property({ type: Object })
], InputAutoComplete.prototype, "inputMode", void 0);
__decorate([
    property({ type: Object })
], InputAutoComplete.prototype, "suggestionGenerator", void 0);
__decorate([
    property({ type: String })
], InputAutoComplete.prototype, "inputId", void 0);
__decorate([
    property({ type: String })
], InputAutoComplete.prototype, "placeholder", void 0);
__decorate([
    property({ type: String })
], InputAutoComplete.prototype, "text", void 0);
__decorate([
    property({ type: String })
], InputAutoComplete.prototype, "value", void 0);
InputAutoComplete = __decorate([
    customElement('rx-input-autocomplete')
], InputAutoComplete);
export { InputAutoComplete };
//# sourceMappingURL=input-autocomplete.js.map