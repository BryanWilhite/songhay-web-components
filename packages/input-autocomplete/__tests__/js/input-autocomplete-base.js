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
import { ComponentCssClasses } from './models/component-css-classes';
import { Key } from './models/key';
import { AutoCompleteSuggestions } from './services/autocomplete-suggestions';
const CUSTOM_EVENT_NAME_SELECTED = 'selected';
const CUSTOM_EVENT_NAME_UNSELECTED = 'unselected';
const EVENT_HANDLER_DELAY = (timeInMilliseconds) => new Promise((resolve) => {
    setTimeout(function () { resolve(); }, timeInMilliseconds);
});
export class InputAutoCompleteBase extends LitElement {
    constructor() {
        super(...arguments);
        this.activeSuggestionIndex = -1;
        this.componentActive = false;
        this._autoCompleteSuggestions = new AutoCompleteSuggestions();
        this.inputId = '';
        this.cssSuggestionAlignment = '';
        this.cssWidth = '';
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
    }
    clearData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.clearData();
            yield this.requestUpdate();
            this.activeSuggestionIndex = -1;
            this.componentActive = false;
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            this.clearSelection();
            yield this.clearData();
        });
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
    handleBlur(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!e) {
                console.error(`The expected \`${FocusEvent.name}\` is not here.`);
                return;
            }
            e.preventDefault();
            yield EVENT_HANDLER_DELAY(250);
            yield this.close();
        });
    }
    handleFocus(e) {
        if (!e) {
            console.error(`The expected \`${FocusEvent.name}\` is not here.`);
            return;
        }
        this.componentActive = true;
    }
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
                    this.handleSuggestionClick(this.activeSuggestionIndex);
                    break;
                case Key.Escape:
                    yield this.close();
                    break;
            }
        });
    }
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
                    this.clearSelection(true);
                    break;
                default:
                    yield this.prepareSuggestions(text);
                    break;
            }
        });
    }
    handleSuggestionClick(suggestionIndex) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //#region functional members:
            const suggestionIndexIsValid = () => {
                var _a;
                return suggestionIndex >= 0 &&
                    suggestionIndex < ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount());
            };
            const setTextAndValue = () => {
                var _a;
                const datum = (_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDatum(suggestionIndex);
                this.text = datum.text;
                this.value = datum.value;
            };
            //#endregion
            if (suggestionIndexIsValid()) {
                setTextAndValue();
                this.dispatchCustomEvent(CUSTOM_EVENT_NAME_SELECTED, {
                    detail: (_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDatum(suggestionIndex)
                });
                yield this.clearData();
            }
        });
    }
    prepareSuggestions(text) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.prepareSuggestions(text));
            yield this.requestUpdate();
        });
    }
    setActiveSuggestionIndex(key) {
        var _a;
        if (!((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.hasSuggestionData())) {
            return;
        }
        const isKeyDown = (key === Key.ArrowDown);
        //#region functional members:
        const activeSuggestionIndexIsValid = () => {
            var _a;
            return ((this.activeSuggestionIndex + 1) < ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount()));
        };
        const setActiveSuggestionIndexBoundary = () => {
            var _a;
            if (isKeyDown) {
                this.activeSuggestionIndex = 0;
            }
            else if (!isKeyDown && (this.activeSuggestionIndex) > 0) {
                this.activeSuggestionIndex -= 1;
            }
            else if (!isKeyDown) {
                this.activeSuggestionIndex = ((_a = this._autoCompleteSuggestions) === null || _a === void 0 ? void 0 : _a.getSuggestionDataCount()) - 1;
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
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has(InputAutoCompleteBase.suggestionGeneratorPropertyName)) {
            this._autoCompleteSuggestions.suggestionGenerator = this.suggestionGenerator;
        }
    }
}
InputAutoCompleteBase.suggestionGeneratorPropertyName = 'suggestionGenerator';
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "inputId", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], InputAutoCompleteBase.prototype, "cssSuggestionAlignment", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "cssWidth", void 0);
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
    __metadata("design:type", Object)
], InputAutoCompleteBase.prototype, "cssClasses", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", String)
], InputAutoCompleteBase.prototype, "inputMode", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Function)
], InputAutoCompleteBase.prototype, "suggestionGenerator", void 0);
//# sourceMappingURL=input-autocomplete-base.js.map