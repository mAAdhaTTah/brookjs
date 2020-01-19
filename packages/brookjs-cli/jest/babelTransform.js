'use strict';

const babelJest = require('babel-jest');
const { create } = require('brookjs-cli');

module.exports = babelJest.createTransformer({
  ...create().getBabelConfig({
    presets: [require.resolve('babel-preset-brookjs')],
    // @TODO(mAAdhaTTah) this should be enabled by NODE_ENV
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
  }),
  babelrc: false,
  configFile: false
});
