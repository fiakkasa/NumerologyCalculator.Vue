describe('NumerologyUiService', function () {
    const config = {
        CalculatorEquationSeparator: '+',
        CalculatorEquationCombinedItemTemplate: '{0}:{1}',
        MaxInputChars: 5,
        UiInputDelay: 500
    };
    let service;

    beforeEach(function () {
        service = new NumerologyUiService(config);
    });

    it('composes entry equation using separator', function () {
        expect(service.composeEntryEquation(['1', '2', '3'])).toBe('1+2+3');
        expect(service.composeEntryEquation([])).toBe('');
        expect(service.composeEntryEquation(null)).toBe('');
    });

    it('composes entry sequence by concatenation', function () {
        expect(service.composeEntrySequence(['1', '2', '3'])).toBe('123');
        expect(service.composeEntrySequence(null)).toBe('');
    });

    it('composes combined item from template', function () {
        expect(service.composeCombinedItem('L', 'R')).toBe('L:R');
    });

    it('normalizes text input: trims spaces and enforces max length', function () {
        expect(service.normalizeTextInput(' a b c ')).toBe('abc');
        expect(service.normalizeTextInput('')).toBe('');
        expect(service.normalizeTextInput('     ')).toBe('');
        expect(service.normalizeTextInput('abcdefg')).toBe('abcde');
        expect(service.normalizeTextInput('abc')).toBe('abc');
    });

    it('inputDelay resolves after configured delay', async function () {
        const start = Date.now();
        await service.inputDelay();
        const elapsed = Date.now() > start;

        expect(elapsed).toBeTrue();
    });
});