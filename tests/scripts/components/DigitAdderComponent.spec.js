import { DigitAdderComponent } from '../../../src/scripts/components/DigitAdderComponent.js';

describe('DigitAdderComponent', function () {
    function delay() {
        return new Promise((resolve) => setTimeout(() => resolve(true), 100));
    }

    function mountComponent(initialProps = {}, services = {}, eventSpies = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const app = Vue.createApp({
            render() {
                const vnodeProps = Object.assign({}, initialProps);
                if (eventSpies.busy) {
                    vnodeProps['onBusy'] = eventSpies.busy;
                }
                if (eventSpies.result) {
                    vnodeProps['onResult'] = eventSpies.result;
                }
                return Vue.h(DigitAdderComponent, vnodeProps);
            }
        });

        app.provide('uiService', services.uiService || {});
        app.provide('digitCalculatorService', services.digitCalculatorService || {});

        app.component('adder-title', {
            props: ['text'],
            template: '<div class="adder-title" v-text="text"></div>'
        });
        app.component('calculation-result', {
            props: ['text'],
            template: '<div class="calculation-result" v-text="text"></div>'
        });
        app.component('calculation-steps', {
            props: ['steps'],
            template: '<div class="calculation-steps"><div v-for="(s,i) in steps" :key="i" class="step" v-text="s.equation"></div></div>'
        });

        app.mount(container);

        return { app, container };
    }

    it('emits busy and empty result when uiService.normalizeTextInput returns empty', async function () {
        const busySpy = jasmine.createSpy('busy');
        const resultSpy = jasmine.createSpy('result');

        const services = {
            uiService: {
                normalizeTextInput: (v) => '',
                delay: () => delay()
            },
            digitCalculatorService: {
                calculate: () => Promise.resolve({ result: 'SHOULD_NOT_BE_CALLED', steps: [] })
            }
        };

        const { app, container } = mountComponent({ text: '   ' }, services, { busy: busySpy, result: resultSpy });

        await delay();
        await Vue.nextTick();

        expect(busySpy).toHaveBeenCalled();
        expect(busySpy.calls.first().args[0]).toBe(true);
        expect(busySpy.calls.mostRecent().args[0]).toBe(false);

        expect(resultSpy).toHaveBeenCalled();
        expect(resultSpy.calls.mostRecent().args[0]).toBe('');

        expect(container.querySelector('.calculator')).toBeNull();

        app.unmount();
        container.remove();
    });

    it('calls services, updates result and renders when valid normalized input provided', async function () {
        const busySpy = jasmine.createSpy('busy');
        const resultSpy = jasmine.createSpy('result');

        const calcResult = '5';
        const calcSteps = [{ equation: '2+3', numberOfCharacters: 2 }];

        const services = {
            uiService: {
                normalizeTextInput: (v) => v.replaceAll(' ', ''),
                delay: () => delay()
            },
            digitCalculatorService: {
                calculate: (normalized, signal) => Promise.resolve({ result: calcResult, steps: calcSteps })
            }
        };

        const { app, container } = mountComponent({ text: '2 3' }, services, { busy: busySpy, result: resultSpy });

        await delay();
        await Vue.nextTick();

        expect(busySpy).toHaveBeenCalled();
        expect(busySpy.calls.first().args[0]).toBe(true);
        expect(busySpy.calls.mostRecent().args[0]).toBe(false);

        expect(resultSpy).toHaveBeenCalled();
        expect(resultSpy.calls.mostRecent().args[0]).toBe(calcResult);

        const calcEl = container.querySelector('.calculator');
        expect(calcEl).toBeTruthy();

        const resultEl = container.querySelector('.calculation-result');
        expect(resultEl).toBeTruthy();
        expect(resultEl.textContent).toBe(calcResult);

        const stepEl = container.querySelector('.calculation-steps .step');
        expect(stepEl).toBeTruthy();
        expect(stepEl.textContent).toBe('2+3');

        app.unmount();
        container.remove();
    });
});
