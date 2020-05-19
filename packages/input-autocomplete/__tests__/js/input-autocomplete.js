var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, html, LitElement, property } from 'lit-element';
import { AutoCompleteSuggestions } from './autocomplete-suggestions';
import { ComponentCssClasses } from './models/component-css-classes';
import { Key } from './models/key';
const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';
const EVENT_HANDLER_DELAY = (timeInMilliseconds) => new Promise((resolve) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});
let InputAutoComplete = class InputAutoComplete extends LitElement {
    constructor() {
        super();
        this.active = false;
        this.activeIndex = -1;
        this.inputId = '';
        this.placeholder = '';
        this.text = '';
        this.value = '';
        this.disabled = false;
        this.required = true;
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.cssClasses = new ComponentCssClasses();
        this.inputMode = 'none';
        this.suggestionGenerator = () => Promise.resolve([]);
        this._autoCompleteSuggestions = new AutoCompleteSuggestions(this.suggestionGenerator);
        this._autoCompleteSuggestions.maxSuggestions = this.maxSuggestions;
        this._autoCompleteSuggestions.minInput = this.minInput;
    }
    clearData() {
        this._autoCompleteSuggestions.clearData();
        this.activeIndex = -1;
        this.active = false;
    }
    clearSelection(clearOnlyValue = false) {
        if (this.value !== '') {
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
    handleActivation(key) {
        if (!this._autoCompleteSuggestions.suggestionData.length) {
            return;
        }
        const isKeyDown = (key === Key.ArrowDown);
        if (isKeyDown && (this.activeIndex + 1) < this._autoCompleteSuggestions.suggestionData.length) {
            this.activeIndex += 1;
        }
        else if (isKeyDown) {
            this.activeIndex = 0;
        }
        else if (!isKeyDown && (this.activeIndex) > 0) {
            this.activeIndex -= 1;
        }
        else if (!isKeyDown) {
            this.activeIndex = this._autoCompleteSuggestions.suggestionData.length - 1;
        }
    }
    handleBlur(e) {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        e.preventDefault();
        EVENT_HANDLER_DELAY(250)
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
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        e.preventDefault();
        this.active = true;
    }
    handleKeyDown(e) {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }
        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
                e.preventDefault();
                this.handleActivation(e.key);
                break;
            case Key.Enter:
            case Key.Tab:
                e.preventDefault();
                this.handleSelection(this.activeIndex);
                break;
            case Key.Escape:
                this.handleClose();
                break;
        }
    }
    handleKeyUp(e) {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }
        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }
        const text = e.target['value'];
        switch (e.key) {
            case Key.ArrowDown:
            case Key.ArrowUp:
            case Key.Enter:
            case Key.Tab:
            case Key.Escape:
                this.clearSelection(true);
                this.render();
                break;
            default:
                this.active = true;
                this._autoCompleteSuggestions.prepareSuggestions(text);
                break;
        }
    }
    handleSelection(suggestionIndex) {
        if (suggestionIndex >= 0 && suggestionIndex < this._autoCompleteSuggestions.suggestionData.length) {
            this.text = this._autoCompleteSuggestions.suggestionData[suggestionIndex].text;
            this.value = this._autoCompleteSuggestions.suggestionData[suggestionIndex].value;
            this.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME_SELECTED, { detail: this._autoCompleteSuggestions.suggestionData[suggestionIndex] }));
            this.clearData();
        }
    }
    render() {
        return html `
        <div .class=${this.cssClasses.wrapper}>
            <input
                autocomplete="off"
                type="text"

                ?disabled="${this.disabled}"
                ?required="${this.required}"

                .class="${this.cssClasses.input}"
                .id="${this.inputId}"
                .inputMode="${this.inputMode}"
                .placeholder="${this.placeholder}"
                .value="${this.text}"

                @blur="${this.handleBlur}"
                @focus="${this.handleFocus}"
                @keydown="${this.handleKeyDown}"
                @keyup="${this.handleKeyUp}"

                />

            <div class="${this.cssClasses.suggestions}">
            ${this._autoCompleteSuggestions.suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </div>
        </div>`;
    }
    renderSuggestion(suggestion, index) {
        console.log({ suggestion, index });
        return html `
        <button
            @click="${() => this.handleSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }
};
InputAutoComplete.customElementName = CUSTOM_ELEMENT_NAME;
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "inputId", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "placeholder", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "text", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "value", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "required", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "maxSuggestions", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "minInput", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "cssClasses", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", String)
], InputAutoComplete.prototype, "inputMode", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Function)
], InputAutoComplete.prototype, "suggestionGenerator", void 0);
InputAutoComplete = __decorate([
    customElement(CUSTOM_ELEMENT_NAME),
    __metadata("design:paramtypes", [])
], InputAutoComplete);
export { InputAutoComplete };
//# sourceMappingURL=input-autocomplete.js.map