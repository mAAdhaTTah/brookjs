module.exports = function(api, { pragma = 'React.createElement', useBuiltIns = true, modules = false, targets } = {}) {
    return {
        presets: [
            ['babel-preset-env', { useBuiltIns, modules, targets }]
        ],
        plugins: [
            ['transform-react-jsx', { pragma }],
            'babel-plugin-ramda',
            'babel-plugin-syntax-dynamic-import',
            ['babel-plugin-transform-object-rest-spread', { useBuiltIns }]
        ]
    };
};
