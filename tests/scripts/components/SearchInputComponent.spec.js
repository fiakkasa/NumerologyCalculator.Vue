describe('SearchInputComponent', function () {
    function mountComponent(props = {}, uiConfigMock = {}, emitSpy = null) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const app = Vue.createApp({
            render() {
                const vnodeProps = Object.assign({}, props);
                if (emitSpy) {
                    vnodeProps['onUpdate:text'] = emitSpy;
                }
                return Vue.h(SearchInputComponent, vnodeProps);
            }
        });

        app.provide('uiConfig', uiConfigMock);
        app.config.globalProperties.$t = (k) => k;

        app.mount(container);
        
        return { app, container };
    }

    const initialFocusDelay = () => new Promise((resolve) => setTimeout(() => resolve(true), 100));

    it('sets input maxlength from uiConfig.MaxInputChars', async function () {
        const uiConfig = { MaxInputChars: 7 };
        const { app, container } = mountComponent({ text: '' }, uiConfig);

        await initialFocusDelay();
        await Vue.nextTick();

        const input = container.querySelector('input.form-control');
        expect(input).toBeTruthy();
        expect(input.getAttribute('maxlength')).toBe('7');

        app.unmount();
        container.remove();
    });

    it('emits update:text truncated to MaxInputChars when typing', async function () {
        const uiConfig = { MaxInputChars: 5 };
        const spy = jasmine.createSpy('onUpdateText');
        const { app, container } = mountComponent({ text: '' }, uiConfig, spy);

        await initialFocusDelay();
        await Vue.nextTick();

        const input = container.querySelector('input.form-control');

        const text = 'abcdefg';
        for (const ch of text) {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
            input.value = input.value + ch;
            input.dispatchEvent(new InputEvent('input', { data: ch, bubbles: true, inputType: 'insertText' }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
        }

        await Vue.nextTick();

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toBe('abcde');

        app.unmount();
        container.remove();
    });

    it('clear button emits empty string and focuses the input', async function () {
        const uiConfig = { MaxInputChars: 10 };
        const spy = jasmine.createSpy('onUpdateText');
        const { app, container } = mountComponent({ text: 'hello' }, uiConfig, spy);

        await initialFocusDelay();
        await Vue.nextTick();

        const input = container.querySelector('input.form-control');
        const btn = container.querySelector('button');

        btn.click();
        await Vue.nextTick();

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toBe('');
        expect(document.activeElement).toBe(input);

        app.unmount();
        container.remove();
    });

    it('focuses the input on mount when focusOnLoad is truthy', async function () {
        const uiConfig = { MaxInputChars: 10 };
        const { app, container } = mountComponent({ text: '', focusOnLoad: true }, uiConfig);

        await initialFocusDelay();
        await Vue.nextTick();

        const input = container.querySelector('input.form-control');
        expect(document.activeElement).toBe(input);

        app.unmount();
        container.remove();
    });
});
