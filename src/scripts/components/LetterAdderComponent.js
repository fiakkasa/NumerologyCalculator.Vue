const LetterAdderComponent = {
    inject: ['uiService', 'letterCalculatorService'],
    props: ['title', 'text'],
    emits: ['busy', 'result'],
    template: `
        <div v-if="result && steps.length"
             class="calculator letter-adder">
            <adder-title :text="title" />

            <div class="d-flex align-items-center flex-column flex-sm-row mt-2">
                <calculation-result :text="result" />
                <calculation-steps :steps="steps" />
            </div>
        </div>
    `,
    data() {
        return {
            currentText: '',
            steps: [],
            result: '',
            abortController: null
        };
    },
    watch: {
        text: {
            immediate: true,
            async handler(value) {
                if (value === this.currentText) return;

                if (this.abortController) {
                    this.abortController.abort();
                }

                this.abortController = new AbortController();
                this.$emit('busy', true);
                this.currentText = value;

                const normalized = this.uiService.normalizeTextInput(value);
                if (!normalized) {
                    this.result = '';
                    this.steps = [];
                    this.$emit('busy', false);
                    this.$emit('result', '');

                    return;
                }

                const cancellation = new Promise((resolve, _) => {
                    this.abortController.signal.addEventListener('abort', () => {
                        resolve([]);
                    }, { once: true });
                });
                const results = await Promise.race(
                    [
                        Promise.all(
                            [
                                this.letterCalculatorService.calculate(normalized),
                                this.uiService.inputDelay()
                            ]
                        ),
                        cancellation
                    ]
                );

                if (!results.length) {
                    this.$emit('busy', false);
                    return;
                }

                const [{ result, steps }] = results;

                this.result = result;
                this.steps = steps;
                this.$emit('busy', false);
                this.$emit('result', result);
            }
        }
    }
};