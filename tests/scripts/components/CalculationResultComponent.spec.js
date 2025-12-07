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

        const anchor = container.querySelector('a.nc-result');

        expect(anchor).toBeTruthy();
        expect(anchor.textContent.trim()).toBe('42');
        expect(anchor.getAttribute('target')).toBe('_blank');
        expect(anchor.href).toContain(mockUrl);

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

        const anchor = container.querySelector('a.nc-result');
        expect(anchor).toBeNull();

        const div = container.querySelector('div.nc-result');
        expect(div).toBeTruthy();
        expect(div.textContent.trim()).toBe('NoLink');

        app.unmount();
        container.remove();
    });
});
