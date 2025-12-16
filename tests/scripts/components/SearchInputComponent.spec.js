import { SearchInputComponent } from '../../../src/scripts/components/SearchInputComponent.js';

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

    it('sets input maxlength from uiConfig.maxInputChars', async function () {
        const uiConfig = { maxInputChars: 7 };
        const { app, container } = mountComponent({ text: '' }, uiConfig);

        await initialFocusDelay();
        await Vue.nextTick();

        const el = container.querySelector('input.form-control');

        expect(el).toBeTruthy();
        expect(el.getAttribute('maxlength')).toBe('7');

        app.unmount();
        container.remove();
    });

    it('emits update:text truncated to maxInputChars when typing', async function () {
        const uiConfig = { maxInputChars: 5 };
        const spy = jasmine.createSpy('onUpdateText');
        const { app, container } = mountComponent({ text: '' }, uiConfig, spy);

        await initialFocusDelay();
        await Vue.nextTick();

        const el = container.querySelector('input.form-control');

        const text = 'abcdefg';
        for (const ch of text) {
            el.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
            el.value = el.value + ch;
            el.dispatchEvent(new InputEvent('input', { data: ch, bubbles: true, inputType: 'insertText' }));
            el.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
        }

        await Vue.nextTick();

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toBe('abcde');

        app.unmount();
        container.remove();
    });

    it('clear button emits empty string and focuses the input', async function () {
        const uiConfig = { maxInputChars: 10 };
        const spy = jasmine.createSpy('onUpdateText');
        const { app, container } = mountComponent({ text: 'hello' }, uiConfig, spy);

        await initialFocusDelay();
        await Vue.nextTick();

        const inputEl = container.querySelector('input.form-control');
        const btnEl = container.querySelector('button');

        btnEl.click();
        await Vue.nextTick();

        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toBe('');
        expect(document.activeElement).toBe(inputEl);

        app.unmount();
        container.remove();
    });

    it('focuses the input on mount when focusOnLoad is truthy', async function () {
        const uiConfig = { maxInputChars: 10 };
        const { app, container } = mountComponent({ text: '', focusOnLoad: true }, uiConfig);

        await initialFocusDelay();
        await Vue.nextTick();

        const el = container.querySelector('input.form-control');
        expect(document.activeElement).toBe(el);

        app.unmount();
        container.remove();
    });
});
