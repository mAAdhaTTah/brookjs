module.exports = function(api, { useBuiltIns = true, modules = false, targets } = {}) {
    return {
        presets: [
            ['babel-preset-env', { useBuiltIns, modules, targets }]
        ],
        plugins: [
            'babel-plugin-ramda',
            'babel-plugin-syntax-dynamic-import',
            ['babel-plugin-transform-object-rest-spread', { useBuiltIns }]
        ]
    };
};
