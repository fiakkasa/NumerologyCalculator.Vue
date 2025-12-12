class NumerologyLetterCalculatorService {
    constructor(uiService) {
        this.uiService = uiService;
        this.letterMap = {
            A: 1, J: 1, S: 1,
            B: 2, K: 2, T: 2,
            C: 3, L: 3, U: 3,
            D: 4, M: 4, V: 4,
            E: 5, N: 5, W: 5,
            F: 6, O: 6, X: 6,
            G: 7, P: 7, Y: 7,
            H: 8, Q: 8, Z: 8,
            I: 9, R: 9
        };
        this.codePointsMap = {
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9
        };
    }

    toDeltaInt(character) {
        return this.codePointsMap[character] ?? 0;
    }

    toDeltaIntCollectionSequence(text) {
        return [...text].map(ch => this.toDeltaInt(ch));
    }

    toSumString(collection) {
        return (collection || []).reduce((a, b) => a + b, 0).toString();
    }

    calculateSumAndStep(digits, sequence, equation) {
        const sum = this.toSumString(digits);
        const step = {
            equation,
            sum,
            numberOfCharacters: digits.length,
            sequence
        };

        return { sum, step };
    }

    calculate(text, cancellationSignal) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const uiService = this.uiService;
                const letters = [];
                const digits = [];
                const composed = [];

                for (const ch of (text || '').toUpperCase()) {
                    if (!this.letterMap[ch]) {
                        continue;
                    }

                    letters.push(ch);
                    digits.push(this.letterMap[ch]);
                    composed.push(
                        uiService.composeCombinedItem(ch, this.letterMap[ch])
                    );
                }

                if (!digits.length) {
                    return resolve({ result: '', steps: [] });
                }

                let result = '';
                const steps = [];

                let { sum, step } = this.calculateSumAndStep(
                    digits,
                    uiService.composeEntrySequence(letters),
                    uiService.composeEntryEquation(composed)
                );

                result = sum;
                steps.push(step);

                while (result.length > 1) {
                    const nextDigits = this.toDeltaIntCollectionSequence(result);
                    let { sum, step } = this.calculateSumAndStep(
                        nextDigits,
                        uiService.composeEntrySequence(nextDigits),
                        uiService.composeEntryEquation(nextDigits)
                    );

                    result = sum;
                    steps.push(step);
                }

                resolve({ result, steps });
            });

            cancellationSignal?.addEventListener('abort', () => {
                reject(new Error('Operation aborted'));
            }, { once: true });
        });
    }
}

export { NumerologyLetterCalculatorService };
