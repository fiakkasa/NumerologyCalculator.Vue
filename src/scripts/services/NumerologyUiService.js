class NumerologyUiService {
    constructor(config) {
        this.config = config;
    }

    composeEntryEquation(collection) {
        return (collection || []).join(this.config.CalculatorEquationSeparator);
    }

    composeEntrySequence(collection) {
        return (collection || []).join('');
    }

    composeCombinedItem(left, right) {
        return this.config.CalculatorEquationCombinedItemTemplate
            .replace('{0}', left)
            .replace('{1}', right);
    }

    normalizeTextInput(text) {
        const normalizedText = (text || '').replaceAll(' ', '');

        if (!normalizedText) {
            return '';
        }

        if (normalizedText.length > this.config.MaxInputChars) {
            return normalizedText.slice(0, this.config.MaxInputChars);
        }

        return normalizedText;
    }

    inputDelay() {
        return new Promise(r => setTimeout(r, this.config.UiInputDelay));
    }
}
