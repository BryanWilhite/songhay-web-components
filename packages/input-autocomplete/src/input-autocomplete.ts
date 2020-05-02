import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
    customElement,
    html,
    LitElement,
    property,
    TemplateResult
} from 'lit-element';

import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputModes } from './types/input-modes';
import { AutoCompleteCssClasses } from './models/autocomplete-css-classes';

@customElement('rx-input-autocomplete')
export class InputAutoComplete extends LitElement {

    private _suggestionSubject = new BehaviorSubject<AutoCompleteSuggestion[]>([]);
    private _subscriptions: Subscription[] = [];

    active: boolean = false;
    activeIndex = -1;
    data: AutoCompleteSuggestion[] = [];

    @property({ type: Boolean }) disabled = false;
    @property({ type: Boolean }) required = true;

    @property({ type: Number }) maxSuggestions = 5;
    @property({ type: Number }) minInput = 0;

    @property({ type: Object }) cssClasses = new AutoCompleteCssClasses();
    @property({ type: Object }) inputMode: InputModes = 'none';
    @property({ type: Object }) suggestionGenerator: Observable<AutoCompleteSuggestion[]> = this._suggestionSubject.asObservable();

    @property({ type: String }) inputId = '';
    @property({ type: String }) placeholder = '';
    @property({ type: String }) text = '';
    @property({ type: String }) value = '';

    constructor() {
        super();

        const sub = this.suggestionGenerator.subscribe();
        this._subscriptions.push(sub);

        window.addEventListener('unload', this.handleUnload)
    }

    clearData(): void {
        this.data = [];
        this.activeIndex = -1;
        this.active = false;
    }

    clearSelection(clearOnlyValue = false): void {
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

    getSuggestionsCssClasses(index: number): string {
        return `${this.cssClasses.suggestion}${(this.activeIndex === index) ? ' ' + this.cssClasses.active : ''}`;
    }

    handleActivation(next = true): void {
        if (this.data.length > 0) {
            if (next && (this.activeIndex + 1) < this.data.length) {
                this.activeIndex += 1;
            } else if (next) {
                this.activeIndex = 0;
            } else if (!next && (this.activeIndex) > 0) {
                this.activeIndex -= 1;
            } else if (!next) {
                this.activeIndex = this.data.length - 1;
            }
        }
    }

    handleBlur(e: FocusEvent): void {
        e.preventDefault();

        setTimeout(() => {
            if (this.active) {
                if (this.value) {
                    this.clearData();
                } else {
                    this.handleClose();
                }
            }
        }, 250);
    }

    handleClose(): void {
        this.clearSelection();
        this.clearData();
    }

    handleFocus(e: FocusEvent): void {
        e.preventDefault();
        this.active = true;
    }

    handleKeyDown(e: KeyboardEvent): void {
        if (!e) {
            console.error('The expected KeyboardEvent is not here.');
            return;
        }

        const keyCode = e.keyCode;

        if (keyCode == 40 || keyCode == 38) { // up/down arrows
            e.preventDefault();
            this.handleActivation(keyCode == 40)
        } else if (keyCode == 13 || keyCode == 9) { // enter/tab
            e.preventDefault();
            this.handleSelection(this.activeIndex);
        } else if (keyCode == 27) { // esc
            this.handleClose();
        }
    }

    handleKeyUp(e: KeyboardEvent): void {
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

    handleSelection(index: number): void {
        if (index >= 0 && index < this.data.length) {
            this.text = this.data[index].text;
            this.value = this.data[index].value;
            this.dispatchEvent(new CustomEvent('selected', { detail: this.data[index] }));
            this.clearData();
        }
    }

    handleUnload(): void {
        this._subscriptions.forEach(i => {
            if (i) {
                i.unsubscribe();
            }
        });
    }

    hasData(): boolean {
        return this.data && this.data.length > 0;
    }

    render(): TemplateResult {
        return html`
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

            ${ this.hasData() ? this.renderSuggestions() : ''}
        </div>`;
    }

    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number) {
        return html`
        <button
            @click="${() => this.handleSelection(index)}"

            .class="${this.getSuggestionsCssClasses(index)}"
            .data-value="${suggestion.value}"

            type="button">
            ${ suggestion.suggestion ? suggestion.suggestion : suggestion.text }
        </button>`;
    }

    renderSuggestions(): TemplateResult {
        return html`
        <div class="${this.cssClasses.suggestions}">
            ${ this.data.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
        </div>`;
    }
}
