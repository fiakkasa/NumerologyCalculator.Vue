const SearchInputComponent = {
    props: ['text', 'loading', 'focusOnLoad'],
    emits: ['update:text'],
    inject: ['uiConfig'],
    template: `
    <div class="input-group">
        <input type="text"
               class="form-control"
               :placeholder="$t('enter_your_values')"
               :value="text"
               ref="searchInput"
               :maxlength="uiConfig.MaxInputChars"
               @input="update($event.target.value)" />

        <button class="btn btn-outline-secondary"
                :disabled="!text"
                @click="clear">
            <i class="oi oi-x"></i>
        </button>
    </div>

    <i class="d-flex small text-muted mt-1">
        <span v-if="loading" class="nc-loading"></span>
        <span class="flex-fill"></span>
        <span v-text="text?.length || '0'"></span>
        <span>/</span>
        <span v-text="uiConfig.MaxInputChars"></span>
    </i>
    `,
    mounted() {
        if (!this.focusOnLoad) {
            return;
        }

        setTimeout(() => this.$refs.searchInput.focus());
    },
    methods: {
        update(value) {
            const text = value.length > this.uiConfig.MaxInputChars
                ? value.substring(0, this.uiConfig.MaxInputChars)
                : value;
            this.text = text;
            this.$emit('update:text', text);
        },
        clear() {
            this.update('');
            this.$refs.searchInput.focus();
        }
    }
};
