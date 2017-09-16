const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'node_modules', 'diffhtml'),
                    path.join(__dirname, 'node_modules', 'diffhtml-shared-modules'),
                ]
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    compat: true,
                    knownHelpersOnly: false,
                    runtimePath: 'handlebars/runtime'
                }
            }
        ]
    },
    resolve: {
        mainFields: ['module', 'jsnext:main', 'browser', 'main'],
        alias: {
            'handlebars/runtime': 'handlebars/dist/cjs/handlebars.runtime'
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
            }
        }, common);
        break;
    default:
        module.exports = common;
        break;
}
