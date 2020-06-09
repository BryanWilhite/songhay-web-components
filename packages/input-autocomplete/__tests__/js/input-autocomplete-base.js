var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, property } from 'lit-element';
import { Key } from './models/key';
import { AutoCompleteSuggestions } from './services/autocomplete-suggestions';
const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';
const EVENT_HANDLER_DELAY = (timeInMilliseconds) => new Promise((resolve) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});
/**
 * defines the base class for this Web Component
 *
 * @extends {LitElement}
 */
export class InputAutoCompleteBase extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * tracks the active @type {AutoCompleteSuggestion} in the DOM
         */
        this.activeSuggestionIndex = -1;
        /**
         * when `true` the `input` element has received focus
         */
        this.componentActive = false;
        /**
         * exposes the @type {AutoCompleteSuggestions} service
         * to subclasses
         */
        this._autoCompleteSuggestions = new AutoCompleteSuggestions();
        /**
         * LitElement property/attribute
         * for the ID of the `input` element
         */
        this.inputId = '';
        /**
         * LitElement property/attribute
         * for the placeholder value
         * of the `input` element
         */
        this.placeholder = '';
        /**
         * LitElement property/attribute
         * for the text displayed in the `input` element
         */
        this.text = '';
        /**
         * LitElement property/attribute
         * for the value selected by this Web Component
         */
        this.value = '';
        /**
         * LitElement property/attribute
         * determining whether this Web Component is
         * enabled or disabled in the DOM
         */
        this.disabled = false;
        /**
         * LitElement property/attribute
         * determining whether this Web Component
         * value is required
         */
        this.required = false;
        /**
         * LitElement property/attribute
         * setting the maximum number
         * of @type {AutoCompleteSuggestion} elements
         * to display
         */
        this.maxSuggestions = 5;
        /**
         * LitElement property/attribute
         * setting the minimum number
         * of text characters entered
         * before @type {AutoCompleteSuggestion} elements
         * are displayed
         */
        this.minInput = 0;
        /**
         * LitElement property/attribute
         * for the input mode of the `input` element
         * for OS virtual keyboards
         */
        this.inputMode = 'none';
        /**
         * LitElement property/attribute
         * for the generation strategy
         * of @type {AutoCompleteSuggestion} elements
         */
        this.suggestionGenerator = () => Promise.resolve([]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        const getNumber = (x) => {
            const s = x;
            return (!s) ? 0 : parseInt(s, 10);
        };
        switch (name.toLowerCase()) {
            case InputAutoCompleteBase.maxSuggestionsPropertyName.toLowerCase():
                this._autoCompleteSuggestions.maxSuggestions = getNumber(newVal);
                break;
            case InputAutoCompleteBase.minInputPropertyName.toLowerCase():
                this._autoCompleteSuggestions.minInput = getNumber(newVal);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    /**
     * clear the @type {AutoCompleteSuggestion} data
     * and call `.requestUpdate()`
     */
    clearSuggestionData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.clearData();
            yield this.requestUpdate();
            this.activeSuggestionIndex = -1;
            this.componentActive = false;
        });
    }
    /**
     * clear any @type {AutoCompleteSuggestion}
     * previously selected
     */
    clearSuggestionSelection(clearOnlyValue = false) {
        if (this.value !== '') {
            this.dispatchCustomEvent(CUSTOM_EVENT_NAME_UNSELECTED, { detail: { text: this.text, value: this.value } });
            this.value = '';
        }
        if (!clearOnlyValue) {
            this.text = '';
        }
    }
    /**
     * clear @type {AutoCompleteSuggestion} data
     * and selection
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearSuggestionSelection();
            yield this.clearSuggestionData();
        });
    }
    /**
     * emit the custom events of this Web Component
     */
    dispatchCustomEvent(eventName, data) {
        switch (eventName) {
            case CUSTOM_EVENT_NAME_SELECTED:
            case CUSTOM_EVENT_NAME_UNSELECTED:
                this.dispatchEvent(new CustomEvent(eventName, data));
                break;
        }
    }
    /**
     * handle the focus event of the `input` element
     * of this Web Component
     */
    handleFocus(e) {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        this.componentActive = true;
    }
    /**
     * handle the `keydown` event of the `input` element
     * of this Web Component
     */
    handleKeyDown(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!e) {
                console.error(`The expected \`${KeyboardEvent.name}\` is not here.`);
                return;
            }
            switch (e.key) {
                case Key.ArrowDown:
                case Key.ArrowUp:
                    this.setActiveSuggestionIndex(e.key);
                    this.handleSuggestionSelection(this.activeSuggestionIndex);
                    break;
                case Key.Enter:
                case Key.Tab:
                    e.preventDefault();
                    this.handleSuggestionClick(this.activeSuggestionIndex);
                    break;
                case Key.Escape:
                    yield this.close();
                    break;
            }
        });
    }
    /**
     * handle the `keyup` event of the `input` element
     * of this Web Component
     */
    handleKeyUp(e) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    e.preventDefault();
                    this.clearSuggestionSelection(true);
                    break;
                default:
                    yield this.prepareSuggestions(text);
                    break;
            }
        });
    }
    /**
     * handle the click event
     * of a selected @type {AutoCompleteSuggestion} element
     * of this Web Component
     */
    handleSuggestionClick(suggestionIndex) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //#region functional members:
            const suggestionIndexIsValid = () => {
                var _a;
                return suggestionIndex >= 0 &&
                    suggestionIndex < ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount());
            };
            const setTextAndValue = () => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const datum = (_b = this._autoCompleteSuggestions) === null || _b === void 0 ? void 0 : _b.getSuggestionDatum(suggestionIndex);
                // prevent browsers from caching previous values:
                this.text = '';
                this.value = '';
                yield EVENT_HANDLER_DELAY(50);
                this.text = datum.text;
                this.value = datum.value;
            });
            //#endregion
            if (suggestionIndexIsValid()) {
                setTextAndValue();
                this.dispatchCustomEvent(CUSTOM_EVENT_NAME_SELECTED, {
                    detail: (_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDatum(suggestionIndex)
                });
                yield this.clearSuggestionData();
            }
        });
    }
    /**
     * prepares @type {AutoCompleteSuggestion} element display
     * based on the specified text input
     */
    prepareSuggestions(text) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.prepareSuggestions(text));
            yield this.requestUpdate();
        });
    }
    /**
     * sets `this.activeSuggestionIndex`
     * based on the specified Arrow-key input
     */
    setActiveSuggestionIndex(key) {
        var _a;
        if (!((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.hasSuggestionData())) {
            return;
        }
        const isArrowDownKey = (key === Key.ArrowDown);
        //#region functional members:
        const activeSuggestionIndexIsValid = () => {
            var _a;
            return ((this.activeSuggestionIndex + 1) < ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount()));
        };
        const setActiveSuggestionIndexBoundary = () => {
            var _a;
            if (isArrowDownKey) {
                this.activeSuggestionIndex = 0;
            }
            else if (!isArrowDownKey && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            }
            else if (!isArrowDownKey) {
                this.activeSuggestionIndex = ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount()) - 1;
            }
        };
        //#endregion
        if (isArrowDownKey && activeSuggestionIndexIsValid()) {
            this.activeSuggestionIndex += 1;
        }
        else {
            setActiveSuggestionIndexBoundary();
        }
    }
    /**
     * conventional LitElement method
     */
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has(InputAutoCompleteBase.suggestionGeneratorPropertyName)) {
            this._autoCompleteSuggestions.suggestionGenerator = this.suggestionGenerator;
        }
    }
}
/**
 * the conventional property name of `this.suggestionGenerator`
 */
InputAutoCompleteBase.suggestionGeneratorPropertyName = 'suggestionGenerator';
/**
 * the conventional property name of `this.maxSuggestions`
 */
InputAutoCompleteBase.maxSuggestionsPropertyName = 'maxSuggestions';
/**
 * the conventional property name of `this.minInput`
 */
InputAutoCompleteBase.minInputPropertyName = 'minInput';
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "inputId", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "placeholder", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "text", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "value", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "required", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "maxSuggestions", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "minInput", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", String)
], InputAutoCompleteBase.prototype, "inputMode", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Function)
], InputAutoCompleteBase.prototype, "suggestionGenerator", void 0);
//# sourceMappingURL=input-autocomplete-base.js.map