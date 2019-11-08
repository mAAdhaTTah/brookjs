// @todo: readd NpmInstallPlugin
// @todo: clean up this file (extra functions, commented out code, etc.)
import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { errorToNull } from '../../cli';
import { State } from './types';

const selectDefaultPlugins = () => [
  new CaseSensitivePathsPlugin({
    debug: false
  })
];

const selectEnvPlugins = (state: State) => {
  switch (state.env) {
    case 'development':
      return [];
    case 'production':
      return [];
    default:
      return [];
  }
};

const selectAppPath = (state: State): string =>
  path.join(state.cwd, errorToNull(state.rc)?.dir ?? 'src');

const selectWebpackEntry = (state: State): webpack.Configuration['entry'] => {
  let entry = errorToNull(state.rc)?.webpack?.entry ?? 'index.js';

  if (typeof entry === 'string') {
    return path.join(selectAppPath(state), entry);
  }

  if (Array.isArray(entry)) {
    return entry.map(e => path.join(selectAppPath(state), e));
  }

  if (typeof entry === 'object') {
    for (const [key, value] of Object.entries(entry)) {
      entry = {
        ...entry,
        [key]: path.join(selectAppPath(state), value)
      };
    }
  }

  return entry;
};

const selectFilename = (state: State): string => {
  let filename = errorToNull(state.rc)?.webpack?.output?.filename ?? '[name].js';

  if (typeof filename === 'function') {
    filename = filename(state);

    if (typeof filename !== 'string') {
      throw new Error('rc.webpack.filename function should return a string.');
    }
  }

  return filename;
};

const selectPath = (state: State) =>
  path.join(
    state.cwd,
    errorToNull(state.rc)?.webpack?.output?.path ?? 'dist/'
  );

const selectOutput = (state: State): webpack.Configuration['output'] => ({
  path: selectPath(state),
  filename: selectFilename(state)
});

export const selectWebpackConfig = (state: State): webpack.Configuration => {
  const config: webpack.Configuration = {
    entry: selectWebpackEntry(state),
    output: selectOutput(state),
    mode: state.env,
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          loader: require.resolve('eslint-loader'),
          include: selectAppPath(state),
          enforce: 'pre',
          options: {
            eslintPath: require.resolve('eslint')
          }
        },
        {
          test: /\.(j|t)sx?$/,
          loader: require.resolve('babel-loader'),
          include: selectAppPath(state)
        }
      ]
    },
    resolve: {
      mainFields: ['module', 'main']
    },
    plugins: [...selectDefaultPlugins(), ...selectEnvPlugins(state)]
  };

  const modifier = errorToNull(state.rc)?.webpack?.modifier;
  return modifier?.(config, { env: state.env, cmd: 'build' }) ?? config;
};
