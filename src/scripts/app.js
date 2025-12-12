import { AdderTitleComponent } from './components/AdderTitleComponent.js';
import { CalculationResultComponent } from './components/CalculationResultComponent.js';
import { CalculationStepsComponent } from './components/CalculationStepsComponent.js';
import { DigitAdderComponent } from './components/DigitAdderComponent.js';
import { LetterAdderComponent } from './components/LetterAdderComponent.js';
import { SearchInputComponent } from './components/SearchInputComponent.js';
import { IndexPage } from './pages/IndexPage.js';
import { NumerologyUiService } from './services/NumerologyUiService.js';
import { NumerologyDigitCalculatorService } from './services/NumerologyDigitCalculatorService.js';
import { NumerologyLetterCalculatorService } from './services/NumerologyLetterCalculatorService.js';
import { NumerologyLinksService } from './services/NumerologyLinksService.js';

const uiConfig = {
    MaxInputChars: 1000,
    UiDefaultDelay: 250,
    CalculatorEquationSeparator: ' + ',
    CalculatorEquationCombinedItemTemplate: '({0}: {1})'
};

const linksConfig = {
    Url: 'https:/number.academy/numerology/{0}'
};

const routes = [
    { path: '/:value', component: IndexPage },
    { path: '/', component: IndexPage }
];

async function appInit() {
    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes
    });
    const i18n = VueI18n.createI18n({
        legacy: false,
        locale: 'en-US',
        fallbackLocale: 'en',
        messages: {
            en: {
                enter_your_values: "Enter your values..",
                digit_calculation: "Numeric Calculation",
                letter_calculation: "Letter Calculation",
                combined_calculation: "Combined Calculation"
            }
        }
    });

    const uiService = new NumerologyUiService(uiConfig);
    const digitCalculatorService = new NumerologyDigitCalculatorService(uiService);
    const letterCalculatorService = new NumerologyLetterCalculatorService(uiService);
    const linksService = new NumerologyLinksService(linksConfig);

    const app = Vue.createApp({
        template: `<router-view />`
    });

    app.use(router);
    app.use(i18n);

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

    const locale = 'en-US';
    const messages = await fetch('localization/' + locale + '.json')
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return {};
        });

    i18n.global.setLocaleMessage(locale, messages);
    i18n.global.locale.value = locale;

    return app;
}

export { appInit };
