export const dir = 'src';

/**
 * Mocha testing configuration.
 */
export const mocha = {
  reporter: 'spec',
  ui: 'bdd',
  requires: [
    '../../setupTests.ts',
    // Needs to be required first
    // to get unmocked globals
    '@testing-library/react',
    'jsdom-global/register',
    'raf/polyfill'
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
