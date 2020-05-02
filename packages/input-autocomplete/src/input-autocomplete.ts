import { BehaviorSubject, Observable } from 'rxjs';
import { css, html, LitElement, TemplateResult } from 'lit-element';

import { Suggestion } from './models/suggestion';
import { InputModes } from './types/input-modes';

export class InputAutoComplete extends LitElement {

    static get properties() {
        return {
            text: { type: String }, // The text is displayed by the form field for users
            value: { type: String }, // The actual value of the form field
            placeholder: { type: String }, // The placeholder for the input field
            disabled: { type: String }, // Enable/Disable the input field
            minInput: { type: Number }, // The minimum input size for generating suggestions
            maxSuggestions: { type: Number }, // The maximally shown suggestions in the list
            required: { type: Boolean }, // Form validation: is the form input required
            inputId: { type: Boolean }, // id of the input field
        };
    }

    private _inputMode: InputModes = 'none';
    private _suggestionSubject = new BehaviorSubject<Suggestion[]>([]);

    active: boolean = false;
    activeIndex = -1;
    data: Array<{ text: string, value: string, suggestion?: string }> = [];

    get inputmode(): InputModes {
        return this._inputMode;
    }

    set inputmode(value: InputModes) {
        this._inputMode = value;
        this.render();
    }

    suggestionGenerator: Observable<Suggestion[]> = this._suggestionSubject.asObservable();

    render(): TemplateResult {
        return html``;
    }
}

window.customElements.define('rx-input-autocomplete', InputAutoComplete);
