export const dir = 'src';

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
