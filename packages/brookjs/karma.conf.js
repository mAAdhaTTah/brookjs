const R = require('ramda');
const webpackConfig = R.clone(require('./webpack.config'));

webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
    const tests = '!(node_modules)/**/__tests__/*.spec.js';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

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
        reporters: ['mocha', 'coverage'],

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
        },

        mochaReporter: {
            showDiff: true
        }
    });
};
