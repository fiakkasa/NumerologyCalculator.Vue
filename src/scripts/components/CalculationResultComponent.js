const CalculationResultComponent = {
    inject: ['linksService'],
    props: ['text'],
    template: `
        <a v-if="linksService.isEligible(text)"
           :href="linksService.getUrl(text)"
           target="_blank"
           class="nc-result btn p-0 border-0">
            <span class="px-3 text-secondary display-1"
                  v-text="text">
            </span>
        </a>
        <div v-else
             class="nc-result px-3 text-secondary display-1"
             v-text="text">
        </div>
    `
};
