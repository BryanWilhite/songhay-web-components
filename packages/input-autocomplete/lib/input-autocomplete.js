import { __decorate } from "tslib";
import { customElement, html, LitElement, property } from 'lit-element';
import Timeout from 'await-timeout';
import { KEY_DOWN, KEY_ESCAPE, KEY_TAB, KEY_RETURN, KEY_UP } from 'keycode-js';
import { AutoCompleteCssClasses } from './models/autocomplete-css-classes';
const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';
let InputAutoComplete = class InputAutoComplete extends LitElement {
    constructor() {
        super(...arguments);
        this.active = false;
        this.activeIndex = -1;
        this.data = [];
        this.disabled = false;
        this.required = true;
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.cssClasses = new AutoCompleteCssClasses();
        this.inputMode = 'none';
        this.suggestionGenerator = () => Promise.resolve([]);
        this.inputId = '';
        this.placeholder = '';
        this.text = '';
        this.value = '';
    }
    clearData() {
        this.data = [];
        this.activeIndex = -1;
        this.active = false;
    }
    clearSelection(clearOnlyValue = false) {
        if (this.value != '') {
            this.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME_UNSELECTED, {
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
        if (!this.data.length) {
            return;
        }
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
    handleBlur(e) {
        e.preventDefault();
        const timer = new Timeout();
        timer
            .set(250)
            .then(() => {
            if (!this.active) {
                return;
            }
            if (this.value) {
                this.clearData();
            }
            else {
                this.handleClose();
            }
        });
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
        switch (keyCode) {
            case KEY_DOWN:
            case KEY_UP:
                e.preventDefault();
                this.handleActivation(keyCode === 40);
                break;
            case KEY_RETURN:
            case KEY_TAB:
                e.preventDefault();
                this.handleSelection(this.activeIndex);
                break;
            case KEY_ESCAPE:
                this.handleClose();
                break;
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
        const text = e.target['value'];
        switch (e.keyCode) {
            case KEY_DOWN:
            case KEY_UP:
            case KEY_RETURN:
            case KEY_TAB:
            case KEY_ESCAPE:
                this.clearSelection(true);
                this.prepareSuggestions(text);
                break;
        }
        this.active = true;
        this.text = text;
    }
    handleSelection(index) {
        if (index >= 0 && index < this.data.length) {
            this.text = this.data[index].text;
            this.value = this.data[index].value;
            this.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME_SELECTED, { detail: this.data[index] }));
            this.clearData();
        }
    }
    hasData() {
        return this.data && this.data.length > 0;
    }
    async prepareSuggestions(text) {
        if (this.suggestionGenerator && text.length >= this.minInput) {
            let suggestions = await this.suggestionGenerator(text);
            suggestions.splice(this.maxSuggestions);
            this.data = suggestions;
        }
        else {
            this.data = [];
        }
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