const IndexPage = {
    template: `
        <div class="container">
            <div class="nc-search-input-spacer"
                 :style="{ 'padding-bottom': searchInputContainerSpace }">
            </div>

            <div class="nc-search-input-container position-relative px-3 pt-4"
                :class="{ 'position-sticky sticky-top': trimmedText }"
                 ref="searchInputContainer">
                <search-input :text="text"
                              :loading="loading"
                              :focus-on-load="true"
                              @update:text="onTextChange" />
            </div>

            <div class="px-3 pb-4" 
                 :class="{ 'd-none': !trimmedText || !digitResult }">
                <digit-adder :title="$t('digit_calculation')"
                             :text="trimmedText"
                             @busy="digitBusy = $event"
                             @result="digitResult = $event" />
            </div>

            <div class="px-3 pb-4" 
                 :class="{ 'd-none': !trimmedText || !letterResult }">
                <letter-adder :title="$t('letter_calculation')"
                              :text="trimmedText"
                              @busy="letterBusy = $event"
                              @result="letterResult = $event" />
            </div>

            <div class="px-3 pb-4" 
                 :class="{ 'd-none': !combinedResult }">
                <digit-adder :title="$t('combined_calculation')"
                             :text="combinedResult"
                             @busy="combinedBusy = $event" />
            </div>
        </div>
    `,
    data() {
        return {
            init: false,
            text: '',
            trimmedText: '',
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
            if (!this.trimmedText || !this.digitResult || !this.letterResult) {
                return '';
            }

            return this.digitResult + this.letterResult;
        },
        searchInputContainerSpace() {
            if (this.trimmedText) {
                return '0';
            }

            let elementHeight = 0;

            if (this.init) {
                elementHeight = this.$refs.searchInputContainer?.offsetHeight ?? 87;
            }

            return `max(calc(50vh - ${elementHeight}px), 0px)`;
        }
    },
    beforeMount() {
        this.setTextItemsFromRoute();
    },
    mounted() {
        this.init = true;
    },
    watch: {
        $route(to, from) {
            if (to.params.value === this.text) {
                return;
            }

            this.setTextItemsFromRoute();
        }
    },
    methods: {
        setTextItemsFromRoute() {
            this.text = this.normalizeText(
                this.$route.params.value
            );
            this.trimmedText = this.text.trim();
        },
        normalizeText(text) {
            return (text || '').replaceAll('%20', ' ').replaceAll('.', ' ');
        },
        onTextChange(text) {
            this.text = this.normalizeText(text);
            this.trimmedText = this.text.trim();
            this.$router.push(`/${this.text}`);
        }
    }
};

export { IndexPage };
