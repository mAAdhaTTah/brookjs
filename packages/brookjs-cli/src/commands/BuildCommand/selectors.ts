// @todo: readd NpmInstallPlugin
// @todo: clean up this file (extra functions, commented out code, etc.)
import path from 'path';
import webpack, { Loader } from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { Plugin as ShakePlugin } from 'webpack-common-shake';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
// import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import { State } from './types';

// file regexes
const jsRegex = /\.(js|mjs|jsx|ts|tsx)$/;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const isEnvDevelopment = (state: State) => state.env === 'development';
const isEnvProduction = (state: State) => state.env === 'production';
const isEnvProductionProfile = (/* state: State */) => false;
const shouldUseSourceMap = (/* state: State */) => true;
const shouldUseRelativeAssetPaths = (/* state: State */) =>
  selectPublicPath() === './';
const selectPublicPath = (/* state: State */) => '/';

const selectAppPath = (state: State): string =>
  path.join(state.cwd, state.rc?.dir ?? 'src');

// const selectAppNodeModulesPath = (state: State) =>
//   path.join(state.cwd, 'node_modules');

const defaultBabelConfig = {
  presets: [require.resolve('babel-preset-brookjs')],
  plugins: [
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]'
          }
        }
      }
    ]
  ]
};

const selectStyleLoaders = (
  state: State,
  cssLoaderOptions: object,
  preProcessor?: string
) => {
  const loaders = [
    isEnvDevelopment(state) && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: shouldUseRelativeAssetPaths() ? { publicPath: '../../' } : {}
    },
    {
      loader: require.resolve('css-loader'),
      options: cssLoaderOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize()
        ],
        sourceMap: isEnvProduction(state) && shouldUseSourceMap()
      }
    }
  ].filter(Boolean) as Loader[];
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction(state) && shouldUseSourceMap()
        }
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true
        }
      }
    );
  }
  return loaders;
};

const selectDefaultRules = (state: State) => [
  { parser: { requireEnsure: false } },
  {
    test: jsRegex,
    loader: require.resolve('babel-loader'),
    include: selectAppPath(state),
    options: {
      customize: require.resolve('babel-preset-react-app/webpack-overrides'),
      babelrc: false,
      configFile: false,
      cacheDirectory: true,
      cacheCompression: false,
      compact: isEnvProduction(state),
      ...(state.rc?.babel?.modifier?.(defaultBabelConfig) ?? defaultBabelConfig)
    }
  },
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use MiniCSSExtractPlugin to extract that CSS
  // to a file, but in development "style" loader enables hot editing
  // of CSS.
  // By default we support CSS Modules with the extension .module.css
  {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: selectStyleLoaders(state, {
      importLoaders: 1,
      sourceMap: isEnvProduction(state) && shouldUseSourceMap()
    }),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true
  },
  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  {
    test: cssModuleRegex,
    use: selectStyleLoaders(state, {
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: {
        getLocalIdent: getCSSModuleLocalIdent
      }
    })
  },
  // Opt-in support for SASS (using .scss or .sass extensions).
  // By default we support SASS Modules with the
  // extensions .module.scss or .module.sass
  {
    test: sassRegex,
    exclude: sassModuleRegex,
    use: selectStyleLoaders(
      state,
      {
        importLoaders: 2,
        sourceMap: isEnvProduction && shouldUseSourceMap
      },
      'sass-loader'
    ),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true
  },
  // Adds support for CSS Modules, but using SASS
  // using the extension .module.scss or .module.sass
  {
    test: sassModuleRegex,
    use: selectStyleLoaders(
      state,
      {
        importLoaders: 2,
        sourceMap: isEnvProduction && shouldUseSourceMap,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent
        }
      },
      'sass-loader'
    )
  }
];

const selectEnvRules = (state: State) => {
  switch (state.env) {
    case 'development':
      return [
        {
          test: jsRegex,
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

const selectDefaultPlugins = (state: State) => [
  // @TODO(mAAdhaTTah) readd–rollup gets sad :(
  // This gives some necessary context to module not found errors, such as
  // the requesting resource.
  // new ModuleNotFoundPlugin(selectAppPath(state)),
  // Generate an asset manifest file with the following content:
  // - "files" key: Mapping of all asset filenames to their corresponding
  //   output file so that tools can pick it up without having to parse
  //   `index.html`
  // - "entrypoints" key: Array of files which are included in `index.html`,
  //   can be used to reconstruct the HTML if necessary
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: selectPublicPath(),
    generate: (seed, files, entrypoints) => ({
      files: files.reduce((manifest, file) => {
        if (file.name != null) manifest[file.name] = file.path;
        return manifest;
      }, seed as Record<string, string>),

      entrypoints: Object.entries(entrypoints).reduce(
        (entries, [key, entry]) => ({
          ...entries,
          [key]: entry.filter(fileName => !fileName.endsWith('.map'))
        }),
        {}
      )
    })
  }),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

const selectEnvPlugins = (state: State) => {
  const plugins = state.watch
    ? [
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        // @TODO(mAAdhaTTah) readd–rollup gets sad :(
        // new WatchMissingNodeModulesPlugin(selectAppNodeModulesPath(state))
      ]
    : [];
  switch (state.env) {
    case 'development':
      return [
        ...plugins,
        new CaseSensitivePathsPlugin({
          debug: false
        })
      ];
    case 'production':
      return [
        ...plugins,
        new ShakePlugin({
          warnings: {
            global: false,
            module: false
          }
        }),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css'
        })
      ];
    default:
      return plugins;
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
  pathinfo: isEnvDevelopment(state),
  filename: selectFilename(state),
  // TODO: remove this when upgrading to webpack 5
  futureEmitAssets: true,
  chunkFilename: isEnvProduction(state)
    ? '[name].[contenthash:8].chunk.js'
    : isEnvDevelopment(state)
    ? '[name].chunk.js'
    : undefined,
  // Prevents conflicts when multiple Webpack runtimes (from different apps)
  // are used on the same page.
  // @TODO(mAAdhaTTah) get app name
  // jsonpFunction: `webpackJsonp${state.name}`,
  // this defaults to 'window', but by setting it to 'this' then
  // module chunks which are built will work in web workers as well.
  globalObject: 'this'
});

const selectMinimizer = (state: State) => [
  // This is only used in production mode
  new TerserPlugin({
    terserOptions: {
      parse: {
        // We want terser to parse ecma 8 code. However, we don't want it
        // to apply any minification steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        // Disabled because of an issue with Terser breaking valid code:
        // https://github.com/facebook/create-react-app/issues/5250
        // Pending further investigation:
        // https://github.com/terser-js/terser/issues/120
        inline: 2
      },
      mangle: {
        safari10: true
      },
      // Added for profiling in devtools
      keep_classnames: isEnvProductionProfile(),
      keep_fnames: isEnvProductionProfile(),
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true
      }
    },
    sourceMap: shouldUseSourceMap()
  }),
  // This is only used in production mode
  new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      parser: safePostCssParser,
      map: shouldUseSourceMap()
        ? {
            // `inline: false` forces the sourcemap to be output into a
            // separate file
            inline: false,
            // `annotation: true` appends the sourceMappingURL to the end of
            // the css file, helping the browser find the sourcemap
            annotation: true
          }
        : false
    },
    cssProcessorPluginOptions: {
      preset: ['default', { minifyFontValues: { removeQuotes: false } }]
    }
  })
];

export const selectWebpackConfig = (state: State): webpack.Configuration => {
  const config: webpack.Configuration = {
    entry: selectWebpackEntry(state),
    output: selectOutput(state),
    bail: isEnvProduction(state),
    mode: state.env,
    devtool: isEnvProduction(state) ? 'source-map' : 'cheap-module-source-map',
    resolve: {
      mainFields: ['module', 'main'],
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: [
        'web.mjs',
        'mjs',
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx'
      ]
        .map(ext => `.${ext}`)
        // @TODO(mAAdhaTTah) add
        .filter(ext => /* useTypeScript || */ !ext.includes('ts')),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile() && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling'
        }),
        ...{
          // Add additional aliases here.
        }
      },
      plugins: [
        // @TODO(mAAdhaTTah) revisit if we want to add these plugins to the build
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        // PnpWebpackPlugin,
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
      ]
    },
    // resolveLoader: {
    //   plugins: [
    //     // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
    //     // from the current package.
    //     PnpWebpackPlugin.moduleLoader(module),
    //   ],
    // },
    module: {
      strictExportPresence: true,
      rules: [...selectDefaultRules(state), ...selectEnvRules(state)]
    },
    plugins: [...selectDefaultPlugins(state), ...selectEnvPlugins(state)],
    optimization: {
      minimize: isEnvProduction(state),
      minimizer: selectMinimizer(state),
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: false
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      }
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  };

  return (
    state.rc?.webpack?.modifier?.(config, { env: state.env, cmd: 'build' }) ??
    config
  );
};
