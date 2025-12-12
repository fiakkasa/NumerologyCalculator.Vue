import { CalculationResultComponent } from '../../../src/scripts/components/CalculationResultComponent.js';

describe('CalculationResultComponent', function () {
    function mountComponent(props = {}, linksServiceMock = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const app = Vue.createApp({
            render() { return Vue.h(CalculationResultComponent, props); }
        });

        app.provide('linksService', linksServiceMock);

        app.mount(container);

        return { app, container };
    }

    it('renders an anchor when linksService.isEligible returns true', async function () {
        const mockUrl = 'https://example.com/item/42';
        const linksServiceMock = {
            isEligible: (text) => true,
            getUrl: (text) => mockUrl
        };
        const { app, container } = mountComponent({ text: '42' }, linksServiceMock);
        await Vue.nextTick();

        const el = container.querySelector('a.nc-result');

        expect(el).toBeTruthy();
        expect(el.textContent).toBe('42');
        expect(el.getAttribute('target')).toBe('_blank');
        expect(el.href).toContain(mockUrl);

        app.unmount();
        container.remove();
    });

    it('renders a div when linksService.isEligible returns false', async function () {
        const linksServiceMock = {
            isEligible: (text) => false,
            getUrl: (text) => '/should/not/use'
        };
        const { app, container } = mountComponent({ text: 'NoLink' }, linksServiceMock);
        await Vue.nextTick();

        const anchorEl = container.querySelector('a.nc-result');
        expect(anchorEl).toBeNull();

        const divEl = container.querySelector('div.nc-result');
        expect(divEl).toBeTruthy();
        expect(divEl.textContent).toBe('NoLink');

        app.unmount();
        container.remove();
    });
});
