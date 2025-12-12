import { NumerologyLetterCalculatorService } from '../../../src/scripts/services/NumerologyLetterCalculatorService.js';

describe('NumerologyLetterCalculatorService', function () {
    let uiServiceMock;
    let service;

    beforeEach(function () {
        uiServiceMock = {
            composeCombinedItem: jasmine.createSpy('composeCombinedItem').and.callFake((ch, val) => `${ch}:${val}`),
            composeEntrySequence: jasmine.createSpy('composeEntrySequence').and.callFake(arr => arr.join('')),
            composeEntryEquation: jasmine.createSpy('composeEntryEquation').and.callFake(arr => arr.join('+'))
        };

        service = new NumerologyLetterCalculatorService(uiServiceMock);
    });

    describe('toDeltaInt', function () {
        it('returns numeric value for characters 1-9', function () {
            for (let i = 1; i <= 9; i++) {
                expect(service.toDeltaInt(i.toString())).toBe(i);
            }
        });

        it('returns 0 for unsupported characters', function () {
            expect(service.toDeltaInt('0')).toBe(0);
            expect(service.toDeltaInt('*')).toBe(0);
            expect(service.toDeltaInt('')).toBe(0);
            expect(service.toDeltaInt(' ')).toBe(0);
            expect(service.toDeltaInt(null)).toBe(0);
        });
    });

    describe('toDeltaIntCollectionSequence', function () {
        it('maps string of digits to numbers', function () {
            expect(service.toDeltaIntCollectionSequence('123')).toEqual([1, 2, 3]);
        });

        it('returns array of zeros for non-digit input', function () {
            expect(service.toDeltaIntCollectionSequence('ABC')).toEqual([0, 0, 0]);
        });
    });

    describe('toSumString', function () {
        it('returns sum of numbers as string', function () {
            expect(service.toSumString([1, 2, 3])).toBe('6');
        });

        it('returns "0" for empty array', function () {
            expect(service.toSumString([])).toBe('0');
        });

        it('handles null or undefined', function () {
            expect(service.toSumString(null)).toBe('0');
            expect(service.toSumString(undefined)).toBe('0');
        });
    });

    describe('calculateSumAndStep', function () {
        it('returns sum and step object', function () {
            const digits = [1, 2, 3];
            const sequence = '123';
            const equation = '1+2+3';
            const { sum, step } = service.calculateSumAndStep(digits, sequence, equation);

            expect(sum).toBe('6');
            expect(step.equation).toBe(equation);
            expect(step.sum).toBe('6');
            expect(step.numberOfCharacters).toBe(3);
            expect(step.sequence).toBe(sequence);
        });
    });

    describe('calculate', function () {
        it('resolves empty result for non-letter input', async function () {
            const result = await service.calculate('123!?');

            expect(result).toEqual({ result: '', steps: [] });
        });

        it('calculates single-letter input correctly', async function () {
            const result = await service.calculate('A');

            expect(result.result).toBe('1');
            expect(result.steps.length).toBe(1);

            expect(uiServiceMock.composeCombinedItem).toHaveBeenCalledWith('A', 1);
            expect(uiServiceMock.composeEntrySequence).toHaveBeenCalledWith(['A']);
            expect(uiServiceMock.composeEntryEquation).toHaveBeenCalledWith(['A:1']);
        });

        it('calculates multi-letter input with iterative sum reduction', async function () {
            const result = await service.calculate('ABCD');

            expect(result.result).toBe('1');
            expect(result.steps.length).toBe(2);

            expect(result.steps[0].sum).toBe('10');
            expect(result.steps[0].numberOfCharacters).toBe(4);

            expect(result.steps[1].sum).toBe('1');

            expect(uiServiceMock.composeCombinedItem).toHaveBeenCalledTimes(4);
            expect(uiServiceMock.composeEntrySequence).toHaveBeenCalled();
            expect(uiServiceMock.composeEntryEquation).toHaveBeenCalled();
        });

        it('ignores non-mapped letters', async function () {
            const result = await service.calculate('AXYZ*!');

            expect(result.result).toBe('4');
        });

        it('handles cancellation via AbortSignal', async function () {
            const abortController = new AbortController();
            const calculationPromise = service.calculate('abcdefg', abortController.signal);

            abortController.abort();

            try {
                await calculationPromise;
                fail('Expected calculation to be aborted');
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toBe('Operation aborted');
            }
        });
    });
});
