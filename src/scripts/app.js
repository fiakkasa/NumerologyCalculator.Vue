const uiConfig = {
    MaxInputChars: 1000,
    UiInputDelay: 600,
    CalculatorEquationSeparator: ' + ',
    CalculatorEquationCombinedItemTemplate: '({0}: {1})'
};

const linksConfig = {
    Url: 'https://number.academy/numerology/{0}'
};

const routes = [
    { path: '/:value', component: IndexPage },
    { path: '/', component: IndexPage }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

const uiService = new NumerologyUiService(uiConfig);
const digitCalculatorService = new NumerologyDigitCalculatorService(uiService);
const letterCalculatorService = new NumerologyLetterCalculatorService(uiService);
const linksService = new NumerologyLinksService(linksConfig);

const app = Vue.createApp({
    template: `<router-view />`
});

app.use(router);

app.component('adder-title', AdderTitleComponent);
app.component('calculation-result', CalculationResultComponent);
app.component('calculation-steps', CalculationStepsComponent);
app.component('digit-adder', DigitAdderComponent);
app.component('letter-adder', LetterAdderComponent);
app.component('search-input', SearchInputComponent);
app.component('index-page', IndexPage);

app.provide('uiConfig', uiConfig);
app.provide('linksService', linksService);
app.provide('uiService', uiService);
app.provide('digitCalculatorService', digitCalculatorService);
app.provide('letterCalculatorService', letterCalculatorService);



app.mount('#app');
