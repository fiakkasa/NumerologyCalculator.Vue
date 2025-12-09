describe('CalculationStepsComponent', function () {
    function mountComponent(props = {}, linksServiceMock = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const app = Vue.createApp({
            render() { return Vue.h(CalculationStepsComponent, props); }
        });

        app.provide('linksService', linksServiceMock);
        app.mount(container);

        return { app, container };
    }

    it('does not render when steps is empty or falsy', async function () {
        const linksServiceMock = { isEligible: () => false, getUrl: () => '#' };
        const { app, container } = mountComponent({ steps: [] }, linksServiceMock);
        await Vue.nextTick();

        expect(container.querySelector('.card')).toBeNull();

        app.unmount();
        container.remove();
    });

    it('renders multiple steps and honors linksService for sequence and sum', async function () {
        const steps = [
            { equation: '1+1', sequence: '11', sum: '2' },
            { equation: '2+2', sequence: '22', sum: '4' }
        ];
        const linksServiceMock = {
            isEligible: (text) => text === '11' || text === '4',
            getUrl: (text) => `https://example.com/${text}`
        };
        const { app, container } = mountComponent({ steps }, linksServiceMock);
        await Vue.nextTick();

        const itemsEls = container.querySelectorAll('.card-body .d-flex.align-items-center');
        expect(itemsEls.length).toBe(2);

        const firstEl = itemsEls[0];
        expect(firstEl.querySelector('.nc-count').textContent).toBe('1.');
        const firstEquationEl = firstEl.querySelector('a.nc-equation');
        expect(firstEquationEl).toBeTruthy();
        expect(firstEquationEl.textContent).toBe('1+1');
        expect(firstEquationEl.href).toContain('https://example.com/11');

        const firstSumEl = firstEl.querySelector('div.nc-sum');
        expect(firstSumEl).toBeTruthy();
        expect(firstSumEl.textContent).toBe('2');

        const secondEl = itemsEls[1];
        expect(secondEl.querySelector('.nc-count').textContent).toBe('2.');
        const secondEquationEl = secondEl.querySelector('div.nc-equation');
        expect(secondEquationEl).toBeTruthy();
        expect(secondEquationEl.textContent).toBe('2+2');

        const secondSumEl = secondEl.querySelector('a.nc-sum');
        expect(secondSumEl).toBeTruthy();
        expect(secondSumEl.textContent).toBe('4');
        expect(secondSumEl.href).toContain('https://example.com/4');

        app.unmount();
        container.remove();
    });
});