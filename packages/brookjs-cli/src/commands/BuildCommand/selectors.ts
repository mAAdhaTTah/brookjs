import path from 'path';
import webpack, { Plugin, RuleSetRule } from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import { State } from './types';

const isEnvProduction = (state: State) => state.env === 'production';

const selectAppPath = (state: State): string =>
  path.join(state.cwd, state.rc?.dir ?? 'src');

const defaultBabelConfig = {
  presets: ['brookjs']
};

const selectDefaultRules = (state: State): RuleSetRule[] => [
  { parser: { requireEnsure: false } },
  {
    test: /\.m?(j|t)sx?$/,
    loader: require.resolve('babel-loader'),
    include: selectAppPath(state),
    options: {
      babelrc: false,
      configFile: false,
      cacheDirectory: true,
      cacheCompression: false,
      compact: isEnvProduction(state),
      ...(state.rc?.babel?.modifier?.(defaultBabelConfig) ?? defaultBabelConfig)
    }
  }
];

const selectEnvRules = (state: State): RuleSetRule[] => {
  switch (state.env) {
    case 'development':
      return [
        {
          test: /\.(j|t)sx?$/,
          loader: require.resolve('eslint-loader'),
          include: selectAppPath(state),
          enforce: 'pre' as const,
          options: {
            cache: true,
            formatter: require.resolve('react-dev-utils/eslintFormatter'),
            eslintPath: require.resolve('eslint'),
            baseConfig: {
              extends: [require.resolve('eslint-config-brookjs')]
            },
            useEslintrc: false
          }
        }
      ];
    default:
      return [];
  }
};

const selectDefaultPlugins = (): Plugin[] => [
  new CaseSensitivePathsPlugin({
    debug: false
  })
];

const selectEnvPlugins = (state: State): Plugin[] => {
  switch (state.env) {
    case 'development':
      return [
        new NpmInstallPlugin({
          quiet: true,
          yarn: state.rc?.client === 'yarn'
        })
      ];
    case 'production':
      return [];
    default:
      return [];
  }
};

const selectWebpackEntry = (state: State): webpack.Configuration['entry'] => {
  let entry = state.rc?.webpack?.entry ?? 'index.js';

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
  let filename = state.rc?.webpack?.output?.filename ?? '[name].js';

  if (typeof filename === 'function') {
    filename = filename(state);

    if (typeof filename !== 'string') {
      throw new Error('rc.webpack.filename function should return a string.');
    }
  }

  return filename;
};

const selectPath = (state: State) =>
  path.join(state.cwd, state.rc?.webpack?.output?.path ?? 'dist/');

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
      rules: [...selectDefaultRules(state), ...selectEnvRules(state)]
    },
    resolve: {
      mainFields: ['module', 'main']
    },
    plugins: [...selectDefaultPlugins(), ...selectEnvPlugins(state)]
  };

  return (
    state.rc?.webpack?.modifier?.(config, { env: state.env, cmd: 'build' }) ??
    config
  );
};
