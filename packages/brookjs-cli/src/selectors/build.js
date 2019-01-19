// @todo: readd NpmInstallPlugin
// @todo: clean up this file (extra functions, commented out code, etc.)
import path from 'path';
import R from 'ramda';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import NpmInstallPlugin from 'webpack-plugin-install-deps';
import {
    lAppDir, lWebpackEntry, lCommandName, lEnvCwd, lCommandEnvOpt,
    lWebpackOutputPath, lWebpackOutputFilename, lCommandTypeArg
} from '../lenses';

export const isDevCommand = R.pipe(R.view(lCommandName), R.equals('dev'));

export const isDevAppCommand = R.converge(R.and, [
    isDevCommand,
    R.pipe(R.view(lCommandTypeArg), R.equals('app'))
]);

export const isBuildCommand = R.pipe(
    R.view(lCommandName),
    R.equals('build')
);

const selectDefaultPlugins = state => [
    new CaseSensitivePathsPlugin({ debug: R.view(lCommandEnvOpt, state) === 'development' })
];

const selectEnvPlugins = state => {
    switch (R.view(lCommandEnvOpt, state)) {
        case 'development':
            return [
                new NpmInstallPlugin()
            ];
        case 'production':
            return [

            ];
        default:
            return [];
    }
};

const selectAppPath = state => path.join(
    R.view(lEnvCwd, state),
    R.view(lAppDir, state)
);

const selectWebpackEntry = state => {
    const entry = R.view(lWebpackEntry, state);

    if (typeof entry === 'string') {
        return path.join(selectAppPath(state), entry);
    }

    // Handles values on objects & arrays.
    return R.map(e => path.join(selectAppPath(state), e), entry);
};

const selectFilename = state => {
    let filename = R.view(lWebpackOutputFilename, state);

    if (typeof filename === 'function') {
        filename = filename(state);
    }

    return filename;
};

const selectOutput = state => ({
    path: path.join(R.view(lEnvCwd, state), R.view(lWebpackOutputPath, state)),
    filename: selectFilename(state)
});

export const selectWebpackConfig = state => state.webpack.modifier({
    entry: selectWebpackEntry(state),
    output: selectOutput(state),
    mode: R.view(lCommandEnvOpt, state),
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: require.resolve('eslint-loader'),
                include: selectAppPath(state),
                enforce: 'pre',
                options: {
                    eslintPath: require.resolve('eslint'),
                }
            },
            {
                test: /\.js$/,
                loader: require.resolve('babel-loader'),
                include: selectAppPath(state),
            },
            {
                test: /\.hbs/,
                loader: require.resolve('handlebars-loader'),
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
        mainFields: ['module', 'main']
    },
    plugins: [
        ...selectDefaultPlugins(state),
        ...selectEnvPlugins(state)
    ]
}, state);
