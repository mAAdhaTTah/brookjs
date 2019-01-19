const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true,
    browser: true
  },
  plugins: ['import', 'react'],
  extends: 'valtech',
  rules: {
    eqeqeq: [2, 'smart'],
    'wrap-iife': [2, 'inside'],

    'import/no-unresolved': 2,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-absolute-path': 2,
    /* 'import/no-extraneous-dependencies': [2, {
            packageDir: [__dirname, path.join(__dirname, 'packages', 'brookjs')]
        }], */
    'import/first': 2,
    'import/newline-after-import': 2,

    'import/no-internal-modules': 1,
    'import/prefer-default-export': 1,
    'import/no-named-as-default': 1,
    'import/no-named-as-default-member': 1,
    'import/no-duplicates': 1,
    'import/no-deprecated': 1,
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'never'
      }
    ],

    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', path.join(__dirname, 'packages')]
      }
    }
  }
};
