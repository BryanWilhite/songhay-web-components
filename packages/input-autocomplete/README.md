# `@songhay/input-autocomplete`

[![npm version](https://badge.fury.io/js/%40songhay%2Finput-autocomplete.svg)](https://badge.fury.io/js/%40songhay%2Finput-autocomplete)

## an HTML input element with auto-complete functionality

Here is a sample declaration of this Web Component from the `mocha` [test harness](./__tests__/index.html):

```html
<rx-input-autocomplete
    inputId="my-input"
    maxSuggestions="5"
    minInput="0"
    placeholder="enter here">
</rx-input-autocomplete>
```

Styling depends on CSS Variables also summarized in the test harness:

```html
<style>
    :root {
        --input-autocomplete-width: 16em;
        --input-autocomplete-z-index: 1;
        --input-autocomplete-suggestion-border: none;
        --input-autocomplete-suggestion-font-weight: normal;
        --input-autocomplete-suggestion-margin: 0;
        --input-autocomplete-suggestion-text-align: left;
        --input-autocomplete-suggestion-text-overflow: ellipses;
        --input-autocomplete-suggestion-selected-background-color: #e2e2e2;
        --input-autocomplete-suggestion-selected-border: solid #f00;
        --input-autocomplete-suggestion-selected-font-weight: bold;
    }
</style>
```

The values of these variables are the defaults set by this Web Component.

![component animated demo](../../docs/images/input-autocomplete.peek.gif)

📚 `typedoc` [documentation](https://bryanwilhite.github.io/songhay-web-components/input-autocomplete/) is available.

@[BryanWilhite](https://twitter.com/BryanWilhite)
