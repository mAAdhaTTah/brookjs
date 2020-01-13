'use strict';

const babelJest = require('babel-jest');
const { create } = require('brookjs-cli');

module.exports = babelJest.createTransformer({
  ...create().getBabelConfig({
    presets: [require.resolve('babel-preset-brookjs')]
  }),
  babelrc: false,
  configFile: false
});
