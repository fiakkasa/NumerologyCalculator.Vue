describe('AdderTitleComponent', function () {
    function mountComponent(props = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const app = Vue.createApp({
            render() { return Vue.h(AdderTitleComponent, props); }
        });
        app.mount(container);

        return { app, container };
    }

    it('renders text when "text" prop is provided', async function () {
        const { app, container } = mountComponent({ text: 'Hello World' });
        await Vue.nextTick();
        const el = container.querySelector('.nc-title');

        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe('Hello World');

        app.unmount();
        container.remove();
    });

    it('does not render when "text" is falsy', async function () {
        const { app, container } = mountComponent({ text: '' });
        await Vue.nextTick();

        expect(container.querySelector('.nc-title')).toBeNull();

        app.unmount();
        container.remove();
    });
});