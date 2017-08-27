module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    env: {
        es6: true,
        node: true
    },
    plugins: [
        'import'
    ],
    extends: 'valtech',
    rules: {
        // analysis/correctness
        'import/no-unresolved': 2,
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'import/no-absolute-path': 2,
        'import/no-internal-modules': 2,
        'import/no-extraneous-dependencies': 2,
        'import/first': 2,
        'import/newline-after-import': 2,
        'import/prefer-default-export': 2,

        // red flags (thus, warnings)
        'import/no-named-as-default': 1,
        'import/no-named-as-default-member': 1,
        'import/no-duplicates': 1,
        'import/no-deprecated': 1,
        'import/order': [1, {
            groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
            'newlines-between': 'never'
        }],
    }
};
