class NumerologyUiService {
    constructor(config) {
        this.config = config;
    }

    composeEntryEquation(collection) {
        return (collection || []).join(this.config.calculatorEquationSeparator);
    }

    composeEntrySequence(collection) {
        return (collection || []).join('');
    }

    composeCombinedItem(left, right) {
        return this.config.calculatorEquationCombinedItemTemplate
            .replace('{0}', left)
            .replace('{1}', right);
    }

    normalizeTextInput(text) {
        const normalizedText = (text || '').replaceAll(' ', '');

        if (!normalizedText) {
            return '';
        }

        if (normalizedText.length > this.config.maxInputChars) {
            return normalizedText.slice(0, this.config.maxInputChars);
        }

        return normalizedText;
    }

    delay(cancellationSignal) {
        return new Promise(
            (resolve, reject) => {
                setTimeout(resolve, this.config.uiDefaultDelay);

                cancellationSignal?.addEventListener('abort', () => {
                    reject(new Error('Operation aborted'));
                }, { once: true });
            }
        );
    }
}

export { NumerologyUiService };
