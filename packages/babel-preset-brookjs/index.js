module.exports = function(api, { pragma = 'h' } = {}) {
    return {
        plugins: [
            ['@babel/transform-react-jsx', { pragma }]
        ]
    };
};
