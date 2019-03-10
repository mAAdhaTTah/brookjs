export const dir = 'src';

/**
 * Mocha testing configuration.
 */
export const mocha = {
  reporter: 'spec',
  ui: 'bdd',
  requires: [
    '@babel/register',
    'react-testing-library',
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
