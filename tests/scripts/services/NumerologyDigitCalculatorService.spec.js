describe('NumerologyDigitCalculatorService', function () {
    let uiServiceMock;
    let service;

    beforeEach(function () {
        uiServiceMock = {
            composeEntryEquation: jasmine.createSpy('composeEntryEquation').and.callFake(arr => arr.join('+')),
            composeEntrySequence: jasmine.createSpy('composeEntrySequence').and.callFake(arr => arr.join(''))
        };

        service = new NumerologyDigitCalculatorService(uiServiceMock);
    });

    describe('toDeltaInt', function () {
        it('returns numeric value for characters 1-9', function () {
            for (let i = 1; i <= 9; i++) {
                expect(service.toDeltaInt(i.toString())).toBe(i);
            }
        });

        it('returns 0 for unsupported characters', function () {
            expect(service.toDeltaInt('A')).toBe(0);
            expect(service.toDeltaInt('*')).toBe(0);
            expect(service.toDeltaInt('')).toBe(0);
            expect(service.toDeltaInt(' ')).toBe(0);
            expect(service.toDeltaInt(null)).toBe(0);
        });
    });

    describe('toDeltaIntCollectionSequence', function () {
        it('converts string of digits to array of integers', function () {
            expect(service.toDeltaIntCollectionSequence('123')).toEqual([1, 2, 3]);
        });

        it('handles empty string as empty array', function () {
            expect(service.toDeltaIntCollectionSequence('')).toEqual([]);
        });
    });

    describe('toSumString', function () {
        it('sums array of digits and returns string', function () {
            expect(service.toSumString([1, 2, 3])).toBe('6');
        });

        it('returns "0" for empty array', function () {
            expect(service.toSumString([])).toBe('0');
        });
    });

    describe('calculateSumAndStep', function () {
        it('returns sum and step object with correct properties', function () {
            const digits = [1, 2, 3];
            const sequence = '123';
            const { sum, step } = service.calculateSumAndStep(digits, sequence);

            expect(sum).toBe('6');
            expect(step.equation).toBe('1+2+3');
            expect(step.sum).toBe('6');
            expect(step.numberOfCharacters).toBe(3);
            expect(step.sequence).toBe(sequence);
        });
    });

    describe('calculate', function () {
        it('resolves empty result and steps for non-digit input', async function () {
            const result = await service.calculate('abc');

            expect(result).toEqual({ result: '', steps: [] });
        });

        it('calculates single-digit result correctly', async function () {
            const result = await service.calculate('5');

            expect(result.result).toBe('5');
            expect(result.steps.length).toBe(1);
            expect(result.steps[0].sum).toBe('5');
        });

        it('calculates multi-digit input with iterative sum reduction', async function () {
            const result = await service.calculate('12345');

            expect(result.result).toBe('6');
            expect(result.steps.length).toBe(2);
            expect(result.steps[0].sum).toBe('15');
            expect(result.steps[1].sum).toBe('6');

            expect(uiServiceMock.composeEntryEquation).toHaveBeenCalled();
            expect(uiServiceMock.composeEntrySequence).toHaveBeenCalled();
        });

        it('ignores non-digit characters', async function () {
            const result = await service.calculate('a1b2c3');

            expect(result.result).toBe('6');
        });
    });
});
