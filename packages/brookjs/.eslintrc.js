module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            impliedStrict: true
        }
    },
    env: {
        es6: true,
        node: true,
        browser: true
    },
    plugins: [
        'flowtype'
    ],
    extends: 'valtech',
    rules: {
        eqeqeq: [2, 'smart'],
        'wrap-iife': [2, 'inside'],
        'flowtype/define-flow-type': 1,
        'flowtype/use-flow-type': 1
    }
};
