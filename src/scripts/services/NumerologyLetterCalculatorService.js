class NumerologyLetterCalculatorService {
    constructor(uiService) {
        this.uiService = uiService;
        this.map = {
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
    }

    toDeltaInt(character) {
        return (character || '')[0].codePointAt(0) - 48;
    }

    toSumString(collection) {
        return (collection || []).reduce((a, b) => a + b, 0).toString();
    }

    toDeltaIntCollectionSequence(text) {
        return [...text].map(ch => this.toDeltaInt(ch));
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

    calculate(text) {
        return new Promise(resolve => {
            setTimeout(() => {
                const uiService = this.uiService;
                const map = this.map;
                const letters = [];
                const digits = [];
                const composed = [];

                for (const ch of (text || '').toUpperCase()) {
                    if (!map[ch]) {
                        continue;
                    }

                    letters.push(ch);
                    digits.push(map[ch]);
                    composed.push(
                        uiService.composeCombinedItem(ch, map[ch])
                    );
                }

                if (!letters.length) {
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
                    const next = this.toDeltaIntCollectionSequence(result);
                    let { sum, step } = this.calculateSumAndStep(
                        next,
                        uiService.composeEntrySequence(next),
                        uiService.composeEntryEquation(next)
                    );

                    result = sum;
                    steps.push(step);
                }

                resolve({ result, steps });
            });
        });
    }
}
