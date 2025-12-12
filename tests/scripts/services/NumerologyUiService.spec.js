import { NumerologyUiService } from '../../../src/scripts/services/NumerologyUiService.js';

describe('NumerologyUiService', function () {
    const config = {
        CalculatorEquationSeparator: '+',
        CalculatorEquationCombinedItemTemplate: '{0}:{1}',
        MaxInputChars: 5,
        UiDefaultDelay: 500
    };
    let service;

    beforeEach(function () {
        service = new NumerologyUiService(config);
    });

    describe('composeEntryEquation', function () {
        it('composes entry equation using separator', function () {
            expect(service.composeEntryEquation(['1', '2', '3'])).toBe('1+2+3');
            expect(service.composeEntryEquation([])).toBe('');
            expect(service.composeEntryEquation(null)).toBe('');
        });
    });

    describe('composeEntrySequence', function () {
        it('composes entry sequence by concatenation', function () {
            expect(service.composeEntrySequence(['1', '2', '3'])).toBe('123');
            expect(service.composeEntrySequence(null)).toBe('');
        });
    });

    describe('composeCombinedItem', function () {
        it('composes combined item from template', function () {
            expect(service.composeCombinedItem('L', 'R')).toBe('L:R');
        });
    });

    describe('normalizeTextInput', function () {
        it('normalizes text input: trims spaces and enforces max length', function () {
            expect(service.normalizeTextInput(' a b c ')).toBe('abc');
            expect(service.normalizeTextInput('')).toBe('');
            expect(service.normalizeTextInput('     ')).toBe('');
            expect(service.normalizeTextInput('abcdefg')).toBe('abcde');
            expect(service.normalizeTextInput('abc')).toBe('abc');
        });
    });

    describe('delay', function () {
        it('resolves after configured delay', async function () {
            const start = Date.now();
            await service.delay();
            const elapsed = Date.now() > start;

            expect(elapsed).toBeTrue();
        });

        it('handles cancellation via AbortSignal', async function () {
            const abortController = new AbortController();
            const resultPromise = service.delay(abortController.signal);

            abortController.abort();

            try {
                await resultPromise;
                fail('Expected calculation to be aborted');
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toBe('Operation aborted');
            }
        });
    });
});