import { Linter } from 'eslint';

const config: Linter.Config = {
  extends: ['eslint-config-react-app', 'prettier'],
  globals: {
    KTU: true
  },
  rules: {
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-absolute-path': 2,
    'import/first': 2,
    'import/newline-after-import': 2,
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
    ]
  }
};

export default config;
