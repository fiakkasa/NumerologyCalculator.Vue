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
            result: ''
        };
    },
    watch: {
        text: {
            immediate: true,
            async handler(v) {
                if (v === this.currentText) return;

                this.$emit('busy', true);
                this.currentText = v;

                const normalized = this.uiService.normalizeTextInput(v);

                if (!normalized) {
                    this.result = '';
                    this.steps = [];
                    this.$emit('busy', false);
                    this.$emit('result', '');

                    return;
                }

                await this.uiService.inputDelay();
                
                const { result, steps } = await this.digitCalculatorService.calculate(normalized);
                
                this.result = result;
                this.steps = steps;
                this.$emit('busy', false);
                this.$emit('result', result);
            }
        }
    }
};
