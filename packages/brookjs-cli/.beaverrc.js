export const dir = 'src';

/**
 * Mocha testing configuration.
 */
export const mocha = {
    reporter: 'spec',
    ui: 'bdd',
    requires: [
        '@std/esm'
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
    modifier: (config, state) => config
};

/**
 * Storybook development environment configuration.
 *
 * This will use the webpack configuration defined above.
 */
export const storybook = {
    port: 9001,
    host: null,
    staticDirs: [],
    https: {
        enabled: false
    },
    devServer: {},
    middleware: (router, state) => router
};
