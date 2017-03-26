const webpack = require('webpack');
const merge = require('webpack-merge');

const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        mainFields: ['module', 'jsnext:main', 'browser', 'main'],
        alias: {
            handlebars: 'handlebars/dist/cjs/handlebars',
            diffhtml: 'diffhtml/lib'
        }
    }
};

switch (process.env.npm_lifecycle_event) {
    case 'build:umd:min':
        module.exports = merge({
            output: {
                library: 'brook',
                libraryTarget: 'umd'
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                new webpack.optimize.UglifyJsPlugin({})
            ]
        }, common);
        break;
    case 'build:umd':
        module.exports = merge({
            output: {
                library: 'brook',
                libraryTarget: 'umd'
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ]
        }, common);
        break;
    default:
        module.exports = common;
        break;
}
