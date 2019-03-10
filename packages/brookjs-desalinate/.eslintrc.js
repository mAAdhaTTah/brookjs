const path = require('path');

module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  extends: '../../.eslintrc.js',
  plugins: ['typescript'],
  rules: {
    indent: [2, 2],
    'no-unused-vars': 0,

    // TypeScript
    'typescript/no-unused-vars': [2]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx']
      }
    }
  }
};
