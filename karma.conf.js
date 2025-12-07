module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/scripts/vue.global.prod.min.js',
            'src/scripts/vue-router.global.min.js',
            'src/scripts/vue-i18n.global.prod.js',
            'src/scripts/**/*.js',
            'tests/**/*.spec.js'
        ],
        browsers: ['ChromeHeadlessCustom'],
        customLaunchers: {
            ChromeHeadlessCustom: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        },
        reporters: ['mocha'],
        mochaReporter: {
            output: 'full'
        },
        singleRun: true,
        port: 9876
    });
};