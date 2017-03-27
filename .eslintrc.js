module.exports = {
    root: true,
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
    extends: 'valtech',
    rules: {
        'wrap-iife': [2, 'inside']
    }
};
