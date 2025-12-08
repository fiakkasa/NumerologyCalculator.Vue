const DigitAdderComponent = {
    inject: ['uiService', 'digitCalculatorService'],
    props: ['title', 'text'],
    emits: ['busy', 'result'],
    template: `
        <div v-if="result && steps.length"
             class="calculator digit-adder">
            <adder-title :text="title" />

            <div class="d-flex align-items-center flex-column flex-sm-row mt-2">
                <calculation-result :text="result" />
                <calculation-steps v-if="steps[0]?.numberOfCharacters > 1"
                                   :steps="steps" />
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

                this.$emit('busy', true);

                if (this.abortController) {
                    this.abortController.abort();
                }

                this.abortController = new AbortController();
                this.currentText = value;

                const normalized = this.uiService.normalizeTextInput(value);

                if (!normalized) {
                    this.result = '';
                    this.steps = [];
                    this.$emit('busy', false);
                    this.$emit('result', '');

                    return;
                }

                const { result, steps, error } = await this.uiService.delay(this.abortController.signal)
                    .then(() => this.digitCalculatorService.calculate(
                        normalized,
                        this.abortController.signal
                    ))
                    .catch(error => ({ error }));

                if (error) {
                    return;
                }

                this.result = result;
                this.steps = steps;
                this.$emit('busy', false);
                this.$emit('result', result);
            }
        }
    }
};
