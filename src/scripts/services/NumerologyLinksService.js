class NumerologyLinksService {
    constructor(config) {
        this.config = config;
    }

    isEligible(value = '') {
        return !!value && value.length > 0 && value.length <= 3;
    }

    getUrl(value) {
        return this.config.Url.replace('{0}', value || '');
    }
}
