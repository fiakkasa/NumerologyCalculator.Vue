const IndexPage = {
    inject: ['uiService'],
    template: `
        <div class="container">
            <div class="px-3 pt-4">
                <search-input :text="text"
                              :loading="loading"
                              :focus-on-load="true"
                              @update:text="onTextChange" />
            </div>

            <div class="px-3 pb-4" :class="{ 'd-none': !text }">
                <digit-adder title="Numeric Calculation"
                             :text="text"
                             @busy="digitBusy = $event"
                             @result="digitResult = $event" />
            </div>

            <div class="px-3 pb-4" :class="{ 'd-none': !text }">
                <letter-adder title="Letter Calculation"
                              :text="text"
                              @busy="letterBusy = $event"
                              @result="letterResult = $event" />
            </div>

            <div class="px-3 pb-4" :class="{ 'd-none': !text || !combinedResult }">
                <digit-adder title="Combined Numeric and Letter Calculation"
                             :text="combinedResult"
                             @busy="combinedBusy = $event" />
            </div>
        </div>
    `,
    data() {
        return {
            text: '',
            digitBusy: false,
            letterBusy: false,
            combinedBusy: false,
            digitResult: '',
            letterResult: ''
        };
    },
    computed: {
        loading() {
            return this.digitBusy || this.letterBusy || this.combinedBusy;
        },
        combinedResult() {
            if (!this.digitResult || !this.letterResult) {
                return '';
            }

            return this.digitResult + this.letterResult;
        }
    },
    beforeMount() {
        this.text = this.normalizeText(
            window.location.hash.trim().split('#')[1]
        );
    },
    methods: {
        normalizeText(text) {
            return (text || '').replaceAll('%20', ' ').replaceAll('.', ' ');
        },
        onTextChange(text) {
            this.text = this.normalizeText(text);
            window.location.hash = this.text;
        }
    }
};
