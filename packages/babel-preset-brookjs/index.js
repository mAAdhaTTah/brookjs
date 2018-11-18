module.exports = function(api, { pragma = 'h', useBuiltIns = true, modules = false, targets } = {}) {
    return {
        presets: [
            ['env', { useBuiltIns, modules, targets }]
        ],
        plugins: [
            ['transform-react-jsx', { pragma }],
            'ramda',
            'syntax-dynamic-import',
            ['transform-object-rest-spread', { useBuiltIns }]
        ]
    };
};
