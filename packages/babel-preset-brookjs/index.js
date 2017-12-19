module.exports = function(api, { loose = false, useBuiltIns = true, modules = false, targets } = {}) {
    return {
        presets: [
            ['babel-preset-env', { loose, useBuiltIns, modules, targets }]
        ],
        plugins: [
            'babel-plugin-ramda',
            'babel-plugin-syntax-dynamic-import',
            ['babel-plugin-transform-object-rest-spread', { useBuiltIns }]
        ]
    };
};
