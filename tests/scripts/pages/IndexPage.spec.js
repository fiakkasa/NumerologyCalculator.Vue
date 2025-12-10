describe('IndexPage', function () {
    const uiConfig = {
        MaxInputChars: 1000,
        UiDefaultDelay: 100,
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

    function delay(value) {
        return new Promise((resolve) => setTimeout(() => resolve(true), value || uiConfig.UiDefaultDelay));
    }

    function mountPage(initialRouteValue = '/') {
        const container = document.createElement('div');
        document.body.appendChild(container);

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

        app.config.globalProperties.$t = (k) => k;

        app.mount(container);

        initialRouteValue && app.config.globalProperties.$router.push(initialRouteValue);

        return { app, container, router };
    }

    describe('Initial rendering', function () {
        it('renders empty', async function () {
            const { app, container } = mountPage();
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeNull();
            expect(container.querySelector('.digit-adder')).toBeNull();

            app.unmount();
            container.remove();
        });

        it('transforms %20 and . as spaces', async function () {
            const { app, container } = mountPage('/%20%20Hello.World%20%20');
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('  Hello World  ');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeTruthy();
            expect(container.querySelector('.digit-adder')).toBeNull();

            app.unmount();
            container.remove();
        });

        it('renders numbers only', async function () {
            const { app, container } = mountPage('/123');
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('123');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeNull();
            expect(container.querySelector('.digit-adder')).toBeTruthy();

            app.unmount();
            container.remove();
        });

        it('renders letters only', async function () {
            const { app, container } = mountPage('/abc');
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('abc');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeTruthy();
            expect(container.querySelector('.digit-adder')).toBeNull();

            app.unmount();
            container.remove();
        });

        it('renders numbers and letters', async function () {
            const { app, container } = mountPage('/abc123');
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('abc123');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeTruthy();
            expect(container.querySelectorAll('.digit-adder')?.length).toBe(1);

            await delay();
            await Vue.nextTick();

            expect(container.querySelectorAll('.digit-adder')?.length).toBe(2);

            app.unmount();
            container.remove();
        });
    });

    describe('Input change rendering', function () {
        it('renders continuous input', async function () {
            const { app, container, router } = mountPage();
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeNull();
            expect(container.querySelector('.digit-adder')).toBeNull();

            let navigatedRoutes = [];
            const text = '12ab';
            for (const ch of text) {
                searchInputEl.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
                searchInputEl.value = searchInputEl.value + ch;
                searchInputEl.dispatchEvent(new InputEvent('input', { data: ch, bubbles: true, inputType: 'insertText' }));
                searchInputEl.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));

                await delay();
                await Vue.nextTick();

                navigatedRoutes.push(router.currentRoute.value.fullPath);
            }

            await delay();
            await Vue.nextTick();

            expect(searchInputEl.getAttribute('value')).toBe(text);
            expect(container.querySelector('.letter-adder')).toBeTruthy();
            expect(container.querySelectorAll('.digit-adder')?.length).toBe(1);

            await delay();
            await Vue.nextTick();

            expect(container.querySelectorAll('.digit-adder')?.length).toBe(2);

            expect(navigatedRoutes.length).toBe(text.length);

            let composed = '';
            for (let i = 0; i < text.length; i++) {
                composed += text[i];
                expect(navigatedRoutes[i]).toBe('/' + composed);
            }

            expect(navigatedRoutes.at(-1)).toBe('/' + text);

            app.unmount();
            container.remove();
        });
    });

    describe('Route change rendering', function () {
        it('renders route parameter', async function () {
            const { app, container, router } = mountPage();
            await delay();
            await Vue.nextTick();
            const searchInputEl = container.querySelector('input');

            expect(searchInputEl).toBeTruthy();
            expect(searchInputEl.getAttribute('value')).toBe('');

            await delay();
            await Vue.nextTick();

            expect(container.querySelector('.letter-adder')).toBeNull();
            expect(container.querySelector('.digit-adder')).toBeNull();

            let routeValue = '';
            let navigatedRoutes = [];
            const text = '12ab';
            for (const ch of text) {
                routeValue += ch;
                router.push('/' + routeValue);

                await delay();
                await Vue.nextTick();

                navigatedRoutes.push(router.currentRoute.value.fullPath);
            }

            await delay();
            await Vue.nextTick();

            expect(searchInputEl.getAttribute('value')).toBe(text);
            expect(container.querySelector('.letter-adder')).toBeTruthy();
            expect(container.querySelectorAll('.digit-adder')?.length).toBe(1);

            await delay();
            await Vue.nextTick();

            expect(container.querySelectorAll('.digit-adder')?.length).toBe(2);

            expect(navigatedRoutes.length).toBe(text.length);

            let composed = '';
            for (let i = 0; i < text.length; i++) {
                composed += text[i];
                expect(navigatedRoutes[i]).toBe('/' + composed);
            }

            expect(navigatedRoutes.at(-1)).toBe('/' + text);

            app.unmount();
            container.remove();
        });
    });
});
