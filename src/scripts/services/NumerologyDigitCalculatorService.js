class NumerologyDigitCalculatorService {
    constructor(uiService) {
        this.uiService = uiService;
    }

    toDeltaInt(character) {
        return (character || '').codePointAt(0) - 48;
    }

    toDeltaIntCollectionSequence(text) {
        return [...text].map(ch => this.toDeltaInt(ch));
    }

    toSumString(collection) {
        return (collection || []).reduce((a, b) => a + b, 0).toString();
    }

    calculateSumAndStep(digits, sequence) {
        const sum = this.toSumString(digits);
        const step = {
            equation: this.uiService.composeEntryEquation(digits),
            sum,
            numberOfCharacters: digits.length,
            sequence
        };

        return { sum, step };
    }

    calculate(text) {
        return new Promise(resolve => {
            setTimeout(() => {
                let digits = [...(text || '')]
                    .filter(ch => /\d/.test(ch))
                    .map(ch => this.toDeltaInt(ch));

                if (!digits.length) {
                    return resolve({ result: '', steps: [] });
                }

                let result = '';
                const steps = [];

                let { sum, step } = this.calculateSumAndStep(
                    digits,
                    this.uiService.composeEntrySequence(digits)
                );

                result = sum;
                steps.push(step);

                while (result.length > 1) {
                    digits = this.toDeltaIntCollectionSequence(result);
                    let { sum, step } = this.calculateSumAndStep(
                        digits,
                        this.uiService.composeEntrySequence(digits)
                    );

                    result = sum;
                    steps.push(step);
                }

                resolve({ result, steps });
            });
        });
    }
}
