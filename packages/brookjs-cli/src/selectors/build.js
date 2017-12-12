import path from 'path';
import R from 'ramda';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import { lAppDir, lAppEntry, lCommandName, lEnvCwd,
    lCommandEnvArg } from '../lenses';

export const isBuildCommand = R.pipe(
    R.view(lCommandName),
    R.equals('build')
);

const selectDefaultPlugins = state => [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(R.view(lCommandEnvArg, state))
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
];

const selectEnvPlugins = state => {
    switch (R.view(lCommandEnvArg, state)) {
        case 'development':
            return [];
        case 'production':
            return [
                new UglifyJsPlugin({
                    paralle: true,
                    cache: true,
                    sourceMap: true
                })
            ];
        default:
            return [];
    }
};

const selectAppPath = state => path.join(
    R.view(lEnvCwd, state),
    R.view(lAppDir, state)
);

const selectWebpackEntry = state => ({
    app: path.join(
        selectAppPath(state),
        R.view(lAppEntry, state)
    )
});
export const selectWebpackConfig = state => ({
    entry: selectWebpackEntry(state),
    output: {
        path: path.join(selectAppPath(state), 'public', 'assets'),
        publicPath: '/assets',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                include: selectAppPath(state),
                enforce: 'pre'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: selectAppPath(state),
            },
            {
                test: /\.hbs/,
                loader: 'handlebars-loader',
                query: {
                    helperDirs: [`${selectAppPath(state)}/helpers`],
                    partialDirs: [selectAppPath(state)],
                    preventIndent: true,
                    compat: true
                }
            }
        ]
    },
    resolve: {
        alias: {
            redux: 'redux/es',
            brookjs: 'brookjs/es'
        },
        mainFields: ['module', 'browser', 'main']
    },
    plugins: [
        ...selectDefaultPlugins(state),
        ...selectEnvPlugins(state)
    ]
});
