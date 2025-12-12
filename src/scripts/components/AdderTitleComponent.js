const AdderTitleComponent = {
    props: ['text'],
    template: `
        <div v-if="text"
             class="lead text-break nc-title"
             v-text="text">
        </div>
    `
};

export { AdderTitleComponent };
