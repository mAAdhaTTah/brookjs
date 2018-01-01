import path from 'path';
import R from 'ramda';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import {
    lAppDir, lWebpackEntry, lCommandName, lEnvCwd, lCommandEnvOpt,
    lWebpackOutputPath, lWebpackOutputFilename, lCommandTypeArg
} from '../lenses';

export const isDevCommand = R.pipe(R.view(lCommandName), R.equals('dev'));

export const isDevAppCommand = R.converge(R.and, [
    isDevCommand,
    R.pipe(R.view(lCommandTypeArg), R.equals('app'))
]);

export const isDevStorybookCommand = R.converge(R.and, [
    isDevCommand,
    R.pipe(R.view(lCommandTypeArg), R.equals('storybook'))
]);

export const isBuildCommand = R.pipe(
    R.view(lCommandName),
    R.equals('build')
);

const selectAppPath = state => path.join(
    R.view(lEnvCwd, state),
    R.view(lAppDir, state)
);

const selectDefaultPlugins = state => [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(R.view(lCommandEnvOpt, state))
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
];

const selectEnvPlugins = state => {
    const base = [];

    if (isDevStorybookCommand(state)) {
        base.push(new webpack.HotModuleReplacementPlugin());
        base.push(new webpack.DefinePlugin({
            '__APP_PATH__': JSON.stringify(selectAppPath(state))
        }));
    }

    switch (R.view(lCommandEnvOpt, state)) {
        case 'development':
            return [
                new NpmInstallPlugin(),
                ...base
            ];
        case 'production':
            return [
                new UglifyJsPlugin({
                    parallel: true,
                    cache: true,
                    uglifyOptions: {
                        ie8: false,
                    },
                }),
                ...base
            ];
        default:
            return [];
    }
};

const selectWebpackEntry = state => {
    if (isDevStorybookCommand(state)) {
        return {
            manager: [
                require.resolve('../../storybook/polyfills'),
                require.resolve('../../storybook/manager'),
            ],
            preview: [
                require.resolve('../../storybook/polyfills'),
                require.resolve('../../storybook/globals'),
                `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
                require.resolve('../../storybook/preview/entry'),
            ],
        };
    }

    const entry = R.view(lWebpackEntry, state);

    if (typeof entry === 'string') {
        return path.join(selectAppPath(state), entry);
    }

    // Handles values on objects & arrays.
    return R.map(e => path.join(selectAppPath(state), e), entry);
};

const selectOutput = state => ({
    path: path.join(R.view(lEnvCwd, state), R.view(lWebpackOutputPath, state)),
    filename: R.pipe(
        R.view(lWebpackOutputFilename),
        R.when(R.always(state.command.opts.env === 'production'),  filename => filename.replace('.js', '.min.js'))
    )(state),
    publicPath: isDevStorybookCommand(state) ? '/' : undefined
});

function selectEnvRules (state) {
    if (isDevStorybookCommand(state)) {
        return [];
    }

    return [];
}

export const selectWebpackConfig = state => state.webpack.modifier({
    entry: selectWebpackEntry(state),
    output: selectOutput(state),
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                include: selectAppPath(state),
                enforce: 'pre'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    selectAppPath(state),
                    path.resolve(__dirname + '/../../storybook')
                ]
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
            },
            ...selectEnvRules(state)
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
}, state);
