const webpack = require('webpack');

module.exports = {
    entry: {},
    devtool: 'sourcemap',
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
    },
    resolve: {
        mainFields: ['jsnext:main', 'browser', 'main'],
        alias: {
            handlebars: 'handlebars/dist/cjs/handlebars'
        }
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
