// Karma configuration
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
}

const R = require('ramda');
const webpackConfig = R.clone(require('./webpack.config'));

webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
    const tests = '!(node_modules)/**/__tests__/*.spec.js';

    const opts = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            tests
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            [tests]: ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true //please don’t spam the console when running in karma!
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],

        // specify the coverage information
        coverageReporter: {
            // specify a common output directory
            dir: 'coverage',
            reporters: [
                { type: 'html', subdir: 'report-html' }
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // Ensure Karma doesn't use an iFrame.
        client: {
            useIframe: false
        }
    };

    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
        opts.sauceLabs = {
            testName: 'brookjs unit tests',
            recordScreenshots: false
        };

        opts.customLaunchers = {
            sl_ie_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '11'
            },
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 10',
                version: 'dev'
            },
            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Windows 10',
                version: 'dev'
            },
            sl_edge: {
                base: 'SauceLabs',
                browserName: 'Microsoft Edge',
                platform: 'Windows 10',
                version: '15.15063'
            },
            sl_osx_safari: {
                base: 'SauceLabs',
                browserName: 'Safari',
                platform: 'macOS 10.12',
                version: '10.0'
            },
            sl_ios_safari: {
                base: 'SauceLabs',
                browserName: 'Safari',
                deviceName: 'iPhone 7 Simulator',
                platformVersion: '10.3',
                platformName: 'iOS'
            },
            sl_android: {
                base: 'SauceLabs',
                browserName: 'Browser',
                platform: 'Android',
                version: '4.4',
                deviceName: 'Samsung Galaxy S3 Emulator',
                deviceOrientation: 'portrait'
            }
        };

        opts.browsers = Object.keys(opts.customLaunchers);
        opts.reporters.push('saucelabs');
    }

    config.set(opts);
};
