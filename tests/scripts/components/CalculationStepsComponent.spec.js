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

        const items = container.querySelectorAll('.card-body .d-flex.align-items-center');
        expect(items.length).toBe(2);

        const first = items[0];
        expect(first.querySelector('.nc-count').textContent.trim()).toBe('1.');
        const eqAnchor1 = first.querySelector('a.nc-equation');
        expect(eqAnchor1).toBeTruthy();
        expect(eqAnchor1.textContent.trim()).toBe('1+1');
        expect(eqAnchor1.href).toContain('https://example.com/11');

        const sumDiv1 = first.querySelector('div.nc-sum');
        expect(sumDiv1).toBeTruthy();
        expect(sumDiv1.textContent.trim()).toBe('2');

        const second = items[1];
        expect(second.querySelector('.nc-count').textContent.trim()).toBe('2.');
        const eqDiv2 = second.querySelector('div.nc-equation');
        expect(eqDiv2).toBeTruthy();
        expect(eqDiv2.textContent.trim()).toBe('2+2');

        const sumAnchor2 = second.querySelector('a.nc-sum');
        expect(sumAnchor2).toBeTruthy();
        expect(sumAnchor2.textContent.trim()).toBe('4');
        expect(sumAnchor2.href).toContain('https://example.com/4');

        app.unmount();
        container.remove();
    });
});