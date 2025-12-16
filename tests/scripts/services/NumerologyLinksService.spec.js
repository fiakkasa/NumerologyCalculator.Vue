import { NumerologyLinksService } from '../../../src/scripts/services/NumerologyLinksService.js';

describe('NumerologyLinksService', function () {
    const config = {
        url: 'https://example.com/numerology/{0}'
    };
    let service;

    beforeEach(function () {
        service = new NumerologyLinksService(config);
    });

    describe('isEligible', function () {
        it('returns true for non-empty strings with length <= 3', function () {
            expect(service.isEligible('1')).toBeTrue();
            expect(service.isEligible('12')).toBeTrue();
            expect(service.isEligible('123')).toBeTrue();
        });

        it('returns false for empty strings', function () {
            expect(service.isEligible('')).toBeFalse();
        });

        it('returns false for null or undefined', function () {
            expect(service.isEligible(null)).toBeFalse();
            expect(service.isEligible(undefined)).toBeFalse();
        });

        it('returns false for strings longer than 3 characters', function () {
            expect(service.isEligible('1234')).toBeFalse();
            expect(service.isEligible('abcdef')).toBeFalse();
        });
    });

    describe('getUrl', function () {
        it('replaces placeholder with given value', function () {
            expect(service.getUrl('123')).toBe('https://example.com/numerology/123');
            expect(service.getUrl('A')).toBe('https://example.com/numerology/A');
        });

        it('uses empty string if value is null or undefined', function () {
            expect(service.getUrl(null)).toBe('https://example.com/numerology/');
            expect(service.getUrl(undefined)).toBe('https://example.com/numerology/');
        });

        it('uses empty string if value is empty', function () {
            expect(service.getUrl('')).toBe('https://example.com/numerology/');
        });
    });
});
