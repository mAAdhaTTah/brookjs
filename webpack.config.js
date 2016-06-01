module.exports = {
    entry: {},
    output: {
        path: './dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
};
