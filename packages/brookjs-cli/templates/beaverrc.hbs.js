export const dir = '{{dir}}';

/**
 * Mocha testing configuration.
 */
export const mocha = {
    reporter: 'spec',
    ui: 'bdd',
    requires: []
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
    modifier: (config, state) => config
};
