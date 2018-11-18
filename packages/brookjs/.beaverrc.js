export const dir = 'src';

/**
 * Mocha testing configuration.
 */
export const mocha = {
    reporter: 'spec',
    ui: 'bdd',
    requires: [
        '@babel/register',
        'raf/polyfill',
        'jsdom-global/register'
    ]
};

/**
 * Webpack build configuration.
 */
export const webpack = {
    entry: {
        app: 'app.js'
    },
    output: {
        path: 'dist/',
        filename: '[name].js'
    },
    modifier: x => x
};
