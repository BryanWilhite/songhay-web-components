"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("lit-element");
const component_css_classes_1 = require("./models/component-css-classes");
const key_1 = require("./models/key");
const autocomplete_suggestions_1 = require("./services/autocomplete-suggestions");
const CUSTOM_ELEMENT_NAME = 'rx-input-autocomplete';
const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';
const EVENT_HANDLER_DELAY = (timeInMilliseconds) => new Promise((resolve) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});
let InputAutoComplete = class InputAutoComplete extends lit_element_1.LitElement {
    constructor() {
        super();
        this.activeSuggestionIndex = -1;
        this.componentActive = false;
        this.inputId = '';
        this.placeholder = '';
        this.text = '';
        this.value = '';
        this.disabled = false;
        this.required = true;
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.cssClasses = new component_css_classes_1.ComponentCssClasses();
        this.inputMode = 'none';
        this.suggestionGenerator = () => Promise.resolve([]);
        this._autoCompleteSuggestions = new autocomplete_suggestions_1.AutoCompleteSuggestions(this.suggestionGenerator, this.maxSuggestions, this.minInput);
    }
    clearData() {
        this._autoCompleteSuggestions.clearData();
        this.activeSuggestionIndex = -1;
        this.componentActive = false;
    }
    clearOrClose() {
        if (!this.componentActive) {
            return;
        }
        if (this.value) {
            this.clearData();
        }
        else {
            this.close();
        }
    }
    clearSelection(clearOnlyValue = false) {
        if (this.value !== '') {
            this.dispatchCustomEvent(CUSTOM_EVENT_NAME_UNSELECTED, { detail: { text: this.text, value: this.value } });
            this.value = '';
        }
        if (!clearOnlyValue) {
            this.text = '';
        }
    }
    close() {
        this.clearSelection();
        this.clearData();
    }
    dispatchCustomEvent(eventName, data) {
        switch (eventName) {
            case CUSTOM_EVENT_NAME_SELECTED:
            case CUSTOM_EVENT_NAME_UNSELECTED:
                this.dispatchEvent(new CustomEvent(eventName, data));
                break;
        }
    }
    getSuggestionsCssClasses(index) {
        return `${this.cssClasses.suggestion}${(this.activeSuggestionIndex === index) ? ' ' + this.cssClasses.active : ''}`;
    }
    handleActivation(key) {
        if (!this._autoCompleteSuggestions.suggestionData.length) {
            return;
        }
        const isKeyDown = (key === key_1.Key.ArrowDown);
        //#region functional members:
        const activeSuggestionIndexIsValid = () => ((this.activeSuggestionIndex + 1) < this._autoCompleteSuggestions.suggestionData.length);
        const setActiveSuggestionIndexBoundary = () => {
            if (isKeyDown) {
                this.activeSuggestionIndex = 0;
            }
            else if (!isKeyDown && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            }
            else if (!isKeyDown) {
                this.activeSuggestionIndex = this._autoCompleteSuggestions.suggestionData.length - 1;
            }
        };
        //#endregion
        if (isKeyDown && activeSuggestionIndexIsValid()) {
            this.activeSuggestionIndex += 1;
        }
        else {
            setActiveSuggestionIndexBoundary();
        }
    }
    handleBlur(e) {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        e.preventDefault();
        EVENT_HANDLER_DELAY(250).then(this.clearOrClose);
    }
    handleFocus(e) {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        e.preventDefault();
        this.componentActive = true;
    }
    handleKeyDown(e) {
        if (!e) {
            console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
            return;
        }
        switch (e.key) {
            case key_1.Key.ArrowDown:
            case key_1.Key.ArrowUp:
                e.preventDefault();
                this.handleActivation(e.key);
                break;
            case key_1.Key.Enter:
            case key_1.Key.Tab:
                e.preventDefault();
                this.handleSuggestionSelection(this.activeSuggestionIndex);
                break;
            case key_1.Key.Escape:
                this.close();
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
            case key_1.Key.ArrowDown:
            case key_1.Key.ArrowUp:
            case key_1.Key.Enter:
            case key_1.Key.Tab:
            case key_1.Key.Escape:
                this.clearSelection(true);
                this.render();
                break;
            default:
                this.componentActive = true;
                this._autoCompleteSuggestions.prepareSuggestions(text);
                break;
        }
    }
    handleSuggestionSelection(suggestionIndex) {
        //#region functional members:
        const suggestionIndexIsValid = () => suggestionIndex >= 0 &&
            suggestionIndex < this._autoCompleteSuggestions.suggestionData.length;
        const setTextAndValue = () => {
            this.text = this._autoCompleteSuggestions.suggestionData[suggestionIndex].text;
            this.value = this._autoCompleteSuggestions.suggestionData[suggestionIndex].value;
        };
        //#endregion
        if (suggestionIndexIsValid()) {
            setTextAndValue();
            this.dispatchCustomEvent(CUSTOM_EVENT_NAME_SELECTED, { detail: this._autoCompleteSuggestions.suggestionData[suggestionIndex] });
            this.clearData();
        }
    }
    render() {
        return lit_element_1.html `
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
                ${this._autoCompleteSuggestions
            .suggestionData.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
            </div>
        </div>`;
    }
    renderSuggestion(suggestion, index) {
        console.log({ suggestion, index });
        return lit_element_1.html `
        <button
            @click="${() => this.handleSuggestionSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${suggestion.suggestion ? suggestion.suggestion : suggestion.text}
        </button>`;
    }
};
InputAutoComplete.customElementName = CUSTOM_ELEMENT_NAME;
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "inputId", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "placeholder", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "text", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "value", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "disabled", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "required", void 0);
__decorate([
    lit_element_1.property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "maxSuggestions", void 0);
__decorate([
    lit_element_1.property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "minInput", void 0);
__decorate([
    lit_element_1.property({ type: Object }),
    __metadata("design:type", Object)
], InputAutoComplete.prototype, "cssClasses", void 0);
__decorate([
    lit_element_1.property({ type: Object }),
    __metadata("design:type", String)
], InputAutoComplete.prototype, "inputMode", void 0);
__decorate([
    lit_element_1.property({ type: Object }),
    __metadata("design:type", Function)
], InputAutoComplete.prototype, "suggestionGenerator", void 0);
InputAutoComplete = __decorate([
    lit_element_1.customElement(CUSTOM_ELEMENT_NAME),
    __metadata("design:paramtypes", [])
], InputAutoComplete);
exports.InputAutoComplete = InputAutoComplete;
//# sourceMappingURL=input-autocomplete.js.map