var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var rxjs_1 = require('rxjs');
var lit_element_1 = require('lit-element');
var autocomplete_css_classes_1 = require('./models/autocomplete-css-classes');
var InputAutoComplete = (function (_super) {
    __extends(InputAutoComplete, _super);
    function InputAutoComplete() {
        _super.call(this);
        this._suggestionSubject = new rxjs_1.BehaviorSubject([]);
        this._subscriptions = [];
        this.active = false;
        this.activeIndex = -1;
        this.data = [];
        this.disabled = false;
        this.required = true;
        this.maxSuggestions = 5;
        this.minInput = 0;
        this.cssClasses = new autocomplete_css_classes_1.AutoCompleteCssClasses();
        this.inputMode = 'none';
        this.suggestionGenerator = this._suggestionSubject.asObservable();
        this.inputId = '';
        this.placeholder = '';
        this.text = '';
        this.value = '';
        var sub = this.suggestionGenerator.subscribe();
        this._subscriptions.push(sub);
        window.addEventListener('unload', this.handleUnload);
    }
    InputAutoComplete.prototype.clearData = function () {
        this.data = [];
        this.activeIndex = -1;
        this.active = false;
    };
    InputAutoComplete.prototype.clearSelection = function (clearOnlyValue) {
        if (clearOnlyValue === void 0) { clearOnlyValue = false; }
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
    };
    InputAutoComplete.prototype.getSuggestionsCssClasses = function (index) {
        return "" + this.cssClasses.suggestion + ((this.activeIndex === index) ? ' ' + this.cssClasses.active : '');
    };
    InputAutoComplete.prototype.handleActivation = function (next) {
        if (next === void 0) { next = true; }
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
    };
    InputAutoComplete.prototype.handleBlur = function (e) {
        var _this = this;
        e.preventDefault();
        setTimeout(function () {
            if (_this.active) {
                if (_this.value) {
                    _this.clearData();
                }
                else {
                    _this.handleClose();
                }
            }
        }, 250);
    };
    InputAutoComplete.prototype.handleClose = function () {
        this.clearSelection();
        this.clearData();
    };
    InputAutoComplete.prototype.handleFocus = function (e) {
        e.preventDefault();
        this.active = true;
    };
    InputAutoComplete.prototype.handleKeyDown = function (e) {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }
        var keyCode = e.keyCode;
        if (keyCode == 40 || keyCode == 38) {
            e.preventDefault();
            this.handleActivation(keyCode == 40);
        }
        else if (keyCode == 13 || keyCode == 9) {
            e.preventDefault();
            this.handleSelection(this.activeIndex);
        }
        else if (keyCode == 27) {
            this.handleClose();
        }
    };
    InputAutoComplete.prototype.handleKeyUp = function (e) {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }
        if (!e.target) {
            console.error('The expected KeyboardEvent EventTarget is not here.');
            return;
        }
        var keyCode = e.keyCode;
        var text = e.target['value'];
        if ([40, 38, 13, 9, 27].indexOf(keyCode) < 0) {
            this.clearSelection(true);
            this._suggestionSubject.next(text);
        }
        this.active = true;
        this.text = text;
    };
    InputAutoComplete.prototype.handleSelection = function (index) {
        if (index >= 0 && index < this.data.length) {
            this.text = this.data[index].text;
            this.value = this.data[index].value;
            this.dispatchEvent(new CustomEvent('selected', { detail: this.data[index] }));
            this.clearData();
        }
    };
    InputAutoComplete.prototype.handleUnload = function () {
        this._subscriptions.forEach(function (i) {
            if (i) {
                i.unsubscribe();
            }
        });
    };
    InputAutoComplete.prototype.hasData = function () {
        return this.data && this.data.length > 0;
    };
    InputAutoComplete.prototype.prepareSuggestions = function (text) {
    };
    InputAutoComplete.prototype.render = function () {
        return (_a = ["\n        <div .class=", ">\n            <input\n                @blur=\"", "\"\n                @focus=\"", "\"\n                @keyDown=\"", "\"\n                @keyUp=\"", "\"\n\n                ?disabled=\"", "\"\n\n                .class=\"", "\"\n                .id=\"", "\"\n                .inputMode=\"", "\"\n                .placeholder=\"", "\"\n                .required=\"", "\"\n                .value=\"", "\"\n\n                autocomplete=\"off\"\n                type=\"text\"\n\n                />\n\n            ", "\n        </div>"], _a.raw = ["\n        <div .class=", ">\n            <input\n                @blur=\"", "\"\n                @focus=\"", "\"\n                @keyDown=\"", "\"\n                @keyUp=\"", "\"\n\n                ?disabled=\"", "\"\n\n                .class=\"", "\"\n                .id=\"", "\"\n                .inputMode=\"", "\"\n                .placeholder=\"", "\"\n                .required=\"", "\"\n                .value=\"", "\"\n\n                autocomplete=\"off\"\n                type=\"text\"\n\n                />\n\n            ", "\n        </div>"], lit_element_1.html(_a, this.cssClasses.wrapper, this.handleBlur, this.handleFocus, this.handleKeyDown, this.handleKeyUp, this.disabled, this.cssClasses.input, this.inputId, this.inputMode, this.placeholder, this.required, this.text, this.hasData() ? this.renderSuggestions() : ''));
        var _a;
    };
    InputAutoComplete.prototype.renderSuggestion = function (suggestion, index) {
        var _this = this;
        return (_a = ["\n        <button\n            @click=\"", "\"\n\n            .class=\"", "\"\n            .data-value=\"", "\"\n\n            type=\"button\">\n            ", "\n        </button>"], _a.raw = ["\n        <button\n            @click=\"", "\"\n\n            .class=\"", "\"\n            .data-value=\"", "\"\n\n            type=\"button\">\n            ", "\n        </button>"], lit_element_1.html(_a, function () { return _this.handleSelection(index); }, this.getSuggestionsCssClasses(index), suggestion.value, suggestion.suggestion ? suggestion.suggestion : suggestion.text));
        var _a;
    };
    InputAutoComplete.prototype.renderSuggestions = function () {
        var _this = this;
        return (_a = ["\n        <div class=\"", "\">\n            ", "\n        </div>"], _a.raw = ["\n        <div class=\"", "\">\n            ", "\n        </div>"], lit_element_1.html(_a, this.cssClasses.suggestions, this.data.map(function (suggestion, index) { return _this.renderSuggestion(suggestion, index); })));
        var _a;
    };
    __decorate([
        lit_element_1.property({ type: Boolean })
    ], InputAutoComplete.prototype, "disabled");
    __decorate([
        lit_element_1.property({ type: Boolean })
    ], InputAutoComplete.prototype, "required");
    __decorate([
        lit_element_1.property({ type: Number })
    ], InputAutoComplete.prototype, "maxSuggestions");
    __decorate([
        lit_element_1.property({ type: Number })
    ], InputAutoComplete.prototype, "minInput");
    __decorate([
        lit_element_1.property({ type: Object })
    ], InputAutoComplete.prototype, "cssClasses");
    __decorate([
        lit_element_1.property({ type: Object })
    ], InputAutoComplete.prototype, "inputMode");
    __decorate([
        lit_element_1.property({ type: Object })
    ], InputAutoComplete.prototype, "suggestionGenerator");
    __decorate([
        lit_element_1.property({ type: String })
    ], InputAutoComplete.prototype, "inputId");
    __decorate([
        lit_element_1.property({ type: String })
    ], InputAutoComplete.prototype, "placeholder");
    __decorate([
        lit_element_1.property({ type: String })
    ], InputAutoComplete.prototype, "text");
    __decorate([
        lit_element_1.property({ type: String })
    ], InputAutoComplete.prototype, "value");
    InputAutoComplete = __decorate([
        lit_element_1.customElement('rx-input-autocomplete')
    ], InputAutoComplete);
    return InputAutoComplete;
})(lit_element_1.LitElement);
exports.InputAutoComplete = InputAutoComplete;
