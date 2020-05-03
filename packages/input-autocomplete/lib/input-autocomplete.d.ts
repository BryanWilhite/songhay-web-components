import { LitElement, TemplateResult } from 'lit-element';
import { AutoCompleteSuggestion } from './models/autocomplete-suggestion';
import { InputModes } from './types/input-modes';
import { AutoCompleteCssClasses } from './models/autocomplete-css-classes';
export declare class InputAutoComplete extends LitElement {
    active: boolean;
    activeIndex: number;
    data: AutoCompleteSuggestion[];
    disabled: boolean;
    required: boolean;
    maxSuggestions: number;
    minInput: number;
    cssClasses: AutoCompleteCssClasses;
    inputMode: InputModes;
    suggestionGenerator: (text: string) => Promise<AutoCompleteSuggestion[]>;
    inputId: string;
    placeholder: string;
    text: string;
    value: string;
    clearData(): void;
    clearSelection(clearOnlyValue?: boolean): void;
    getSuggestionsCssClasses(index: number): string;
    handleActivation(next?: boolean): void;
    handleBlur(e: FocusEvent): void;
    handleClose(): void;
    handleFocus(e: FocusEvent): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleKeyUp(e: KeyboardEvent): void;
    handleSelection(index: number): void;
    hasData(): boolean;
    prepareSuggestions(text: string): Promise<void>;
    render(): TemplateResult;
    renderSuggestion(suggestion: AutoCompleteSuggestion, index: number): TemplateResult;
    renderSuggestions(): TemplateResult;
}
