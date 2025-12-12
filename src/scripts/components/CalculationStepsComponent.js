const CalculationStepsComponent = {
    inject: ['linksService'],
    props: ['steps'],
    template: `
        <div v-if="steps?.length" 
             class="card flex-fill m-0 ms-sm-3 mt-4 mt-sm-0">
            <div class="card-body">
                <div v-for="(s,i) in steps"
                     :key="i"
                     class="d-flex align-items-center py-1">

                    <div class="nc-count p-1"
                         v-text="(i + 1) + '.'">
                    </div>

                    <template v-if="linksService.isEligible(s.sequence)">
                        <a :href="linksService.getUrl(s.sequence)"
                           target="_blank"
                           class="nc-equation btn p-1 border-0 text-secondary text-break"
                           v-text="s.equation">
                        </a>
                    </template>
                    <template v-else>
                        <div class="nc-equation p-1 text-secondary text-break"
                             v-text="s.equation">
                        </div>
                    </template>

                    <div class="nc-equation-symbol text-success">=</div>

                    <template v-if="linksService.isEligible(s.sum)">
                        <a :href="linksService.getUrl(s.sum)"
                           target="_blank"
                           class="nc-sum btn p-1 border-0 text-secondary">
                            <span class="sum text-secondary font-monospace"
                                  v-text="s.sum">
                            </span>
                        </a>
                    </template>
                    <template v-else>
                        <div class="nc-sum p-1 text-secondary font-monospace"
                             v-text="s.sum">
                        </div>
                    </template>

                </div>
            </div>
        </div>
    `
};

export { CalculationStepsComponent };
