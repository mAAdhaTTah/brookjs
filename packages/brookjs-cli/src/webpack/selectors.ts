// @todo: readd NpmInstallPlugin
// @todo: clean up this file (extra functions, commented out code, etc.)
import path from 'path';
// import address from 'address';
import webpack, { Loader } from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { Plugin as ShakePlugin } from 'webpack-common-shake';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import ignoredFiles from 'react-dev-utils/ignoredFiles';
// import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
// import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
// import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { unreachable } from 'brookjs-types';
import { State } from './types';
// @TODO(mAAdhaTTah) fix require -> import (missing types)
// const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
// const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');

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
const shouldUseRelativeAssetPaths = (state: State) =>
  selectPublicPath(state) === './';
const selectPublicPath = (state: State) => '/';
const selectPublicUrlOrPath = (state: State) => {
  return '/';
  // return getPublicUrlOrPath(isEnvDevelopment(state));
};
const selectAppPath = (state: State): string =>
  path.join(state.cwd, state.rc?.dir ?? 'src');
const selectAppHtml = (state: State) =>
  path.join(state.cwd, 'public', 'index.html');
// const selectHttpsConfig = (state: State) => false;
// const selectProxy = (state: State) => undefined;
// const selectHost = (state: State) => '0.0.0.0';
// const selectAllowHosts = (state: State) => {
//   const host = selectHost(state);
//   const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
//   let lanUrlForConfig;
//   if (isUnspecifiedHost) {
//     try {
//       // This can only return an IPv4 address
//       lanUrlForConfig = address.ip();
//       if (lanUrlForConfig) {
//         // Check if the address is a private ip
//         // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
//         if (
//           !/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
//             lanUrlForConfig
//           )
//         ) {
//           // Address is not private, so we will discard it
//           lanUrlForConfig = undefined;
//         }
//       }
//     } catch (_e) {
//       // ignored
//     }
//   }

//   return lanUrlForConfig;
// };

// const shouldInlineRuntimeChunk = (state: State) => true;
// const selectPublicUrl = (state: State) => {
//   switch (state.cmd) {
//     case 'start':
//       return 'localhost:3000';
//     case 'build':
//       return '';
//     default:
//       return unreachable(state.cmd);
//   }
// };

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
            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
          },
        },
      },
    ],
  ],
};

const selectStyleLoaders = (
  state: State,
  cssLoaderOptions: object,
  preProcessor?: string,
) => {
  const loaders = [
    isEnvDevelopment(state) && require.resolve('style-loader'),
    isEnvProduction(state) && {
      loader: MiniCssExtractPlugin.loader,
      options: shouldUseRelativeAssetPaths(state)
        ? { publicPath: '../../' }
        : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssLoaderOptions,
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
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
      },
    },
  ].filter(Boolean) as Loader[];
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      },
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
      ...(state.rc?.babel?.modifier?.(defaultBabelConfig) ??
        defaultBabelConfig),
    },
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
      sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
    }),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  {
    test: cssModuleRegex,
    use: selectStyleLoaders(state, {
      importLoaders: 1,
      sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
      modules: {
        getLocalIdent: getCSSModuleLocalIdent,
      },
    }),
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
        importLoaders: 3,
        sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
      },
      require.resolve('sass-loader'),
    ),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  // Adds support for CSS Modules, but using SASS
  // using the extension .module.scss or .module.sass
  {
    test: sassModuleRegex,
    use: selectStyleLoaders(
      state,
      {
        importLoaders: 3,
        sourceMap: isEnvProduction(state) && shouldUseSourceMap(),
        modules: {
          getLocalIdent: getCSSModuleLocalIdent,
        },
      },
      require.resolve('sass-loader'),
    ),
  },
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
              extends: [require.resolve('eslint-config-brookjs')],
            },
            useEslintrc: false,
          },
        },
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
    publicPath: selectPublicPath(state),
    generate: (seed, files, entrypoints) => ({
      files: files.reduce((manifest, file) => {
        if (file.name != null) manifest[file.name] = file.path;
        return manifest;
      }, seed as Record<string, string>),

      entrypoints: Object.entries(entrypoints).reduce(
        (entries, [key, entry]) => ({
          ...entries,
          [key]: entry.filter(fileName => !fileName.endsWith('.map')),
        }),
        {},
      ),
    }),
  }),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: selectAppHtml(state),
      },
      isEnvProduction(state)
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : undefined,
    ),
  ),
  // new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
  //   // Useful for determining whether we’re running in production mode.
  //   // Most importantly, it switches React into the correct mode.
  //   NODE_ENV: process.env.NODE_ENV || 'development',
  //   // Useful for resolving the correct path to static assets in `public`.
  //   // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
  //   // This should only be used as an escape hatch. Normally you would put
  //   // images into the `src` and `import` them in code to get their paths.
  //   PUBLIC_URL: selectPublicUrl(state)
  // })
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
        state.extension === 'ts' &&
          // Only typecheck if we're watching.
          state.watch &&
          new ForkTsCheckerWebpackPlugin({
            async: true,
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            tsconfig: path.join(state.cwd, 'tsconfig.json'),
            reportFiles: [path.join(state.cwd, state.rc?.dir ?? 'src', '**')],
            silent: true,
            formatter: require('react-dev-utils/typescriptFormatter'),
          }),
        new CaseSensitivePathsPlugin({
          debug: false,
        }),
      ].filter(Boolean);
    case 'production':
      return [
        ...plugins,
        new ShakePlugin({
          warnings: {
            global: false,
            module: false,
          },
        }),
        // shouldInlineRuntimeChunk(state) &&
        //   new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css',
        }),
      ];
    default:
      return plugins;
  }
};

const selectCmdPlugins = (state: State) => {
  switch (state.cmd) {
    case 'build':
      return [];
    case 'start':
      return [new webpack.HotModuleReplacementPlugin()];
    default:
      return unreachable(state.cmd);
  }
};

const selectWebpackEntry = (state: State): webpack.Configuration['entry'] => {
  let entry = state.rc?.webpack?.entry ?? `index`;

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
        [key]: path.join(selectAppPath(state), value),
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
  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // We inferred the "public path" (such as / or /my-project) from homepage.
  publicPath: selectPublicUrlOrPath(state),
  // Prevents conflicts when multiple Webpack runtimes (from different apps)
  // are used on the same page.
  // @TODO(mAAdhaTTah) get app name
  // jsonpFunction: `webpackJsonp${state.name}`,
  // this defaults to 'window', but by setting it to 'this' then
  // module chunks which are built will work in web workers as well.
  globalObject: 'this',
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
        ecma: 8,
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
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      // Added for profiling in devtools
      keep_classnames: isEnvProductionProfile(),
      keep_fnames: isEnvProductionProfile(),
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    },
    sourceMap: shouldUseSourceMap(),
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
            annotation: true,
          }
        : false,
    },
    cssProcessorPluginOptions: {
      preset: ['default', { minifyFontValues: { removeQuotes: false } }],
    },
  }),
];

const addHotReload = (
  entry: webpack.Configuration['entry'],
): webpack.Configuration['entry'] => {
  const client = require.resolve('react-dev-utils/webpackHotDevClient');

  if (typeof entry === 'string') {
    return [client, entry];
  }

  if (Array.isArray(entry)) {
    return [client, ...entry];
  }

  // @TODO(mAAdhaTTah) what to do if function provided?
  if (typeof entry === 'function') {
    return entry;
  }

  if (typeof entry === 'object') {
    for (const key in entry) {
      let value = entry[key];

      if (Array.isArray(value)) {
        value = [client, ...value];
      }

      if (typeof value === 'string') {
        value = [client, value];
      }

      entry[key] = value;
    }
  }

  return entry;
};

export const selectWebpackConfig = (state: State): webpack.Configuration => {
  let entry = selectWebpackEntry(state);

  if (state.cmd === 'start') {
    entry = addHotReload(entry);
  }

  const config: webpack.Configuration = {
    entry,
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
        'jsx',
      ]
        .map(ext => `.${ext}`)
        .filter(ext => state.extension === 'ts' || !ext.includes('ts')),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile() && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...{
          // Add additional aliases here.
        },
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
      ],
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
      rules: [...selectDefaultRules(state), ...selectEnvRules(state)],
    },
    plugins: [
      ...selectDefaultPlugins(state),
      ...selectEnvPlugins(state),
      ...selectCmdPlugins(state),
    ],
    optimization: {
      minimize: isEnvProduction(state),
      minimizer: selectMinimizer(state),
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      // @TODO(mAAdhaTTah) figure out why this results in no app bootstrapping when running start
      // splitChunks: {
      //   chunks: 'all',
      //   name: false
      // },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
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
      child_process: 'empty',
    },
  };

  return (
    state.rc?.webpack?.modifier?.(config, { env: state.env, cmd: state.cmd }) ??
    config
  );
};

export const selectServerConfig = (
  state: State,
): WebpackDevServer.Configuration => ({
  // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
  // websites from potentially accessing local content through DNS rebinding:
  // https://github.com/webpack/webpack-dev-server/issues/887
  // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
  // However, it made several existing use cases such as development in cloud
  // environment or subdomains in development significantly more complicated:
  // https://github.com/facebook/create-react-app/issues/2271
  // https://github.com/facebook/create-react-app/issues/2233
  // While we're investigating better solutions, for now we will take a
  // compromise. Since our WDS configuration only serves files in the `public`
  // folder we won't consider accessing them a vulnerability. However, if you
  // use the `proxy` feature, it gets more dangerous because it can expose
  // remote code execution vulnerabilities in backends like Django and Rails.
  // So we will disable the host check normally, but enable it if you have
  // specified the `proxy` setting. Finally, we let you override it if you
  // really know what you're doing with a special environment variable.
  // @TODO(mAAdhaTTah) make this configurable
  disableHostCheck: false,
  // Enable gzip compression of generated files.
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'silent',
  // By default WebpackDevServer serves physical files from current directory
  // in addition to all the virtual build products that it serves from memory.
  // This is confusing because those files won’t automatically be available in
  // production build folder unless we copy them. However, copying the whole
  // project directory is dangerous because we may expose sensitive files.
  // Instead, we establish a convention that only files in `public` directory
  // get served. Our build script will copy `public` into the `build` folder.
  // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
  // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
  // Note that we only recommend to use `public` folder as an escape hatch
  // for files like `favicon.ico`, `manifest.json`, and libraries that are
  // for some reason broken when imported through Webpack. If you just want to
  // use an image, put it in `src` and `import` it from JavaScript instead.
  contentBase: path.join(state.cwd, 'public'),

  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
  // for the WebpackDevServer client so it can learn when the files were
  // updated. The WebpackDevServer client is included as an entry point
  // in the Webpack development configuration. Note that only changes
  // to CSS are currently hot reloaded. JS changes will refresh the browser.
  hot: true,
  // Use 'ws' instead of 'sockjs-node' on server since we're using native
  // websockets in `webpackHotDevClient`.
  transportMode: 'ws',
  // Prevent a WS client from getting injected as we're already including
  // `webpackHotDevClient`.
  injectClient: false,
  // Enable custom sockjs pathname for websocket connection to hot reloading server.
  // Enable custom sockjs hostname, pathname and port for websocket connection
  // to hot reloading server.

  // @TODO(mAAdhaTTah) make these 3 configurable
  // sockHost,
  // sockPath,
  // sockPort,

  // It is important to tell WebpackDevServer to use the same "publicPath" path as
  // we specified in the Webpack config. When homepage is '.', default to serving
  // from the root.
  // remove last slash so user can land on `/test` instead of `/test/`
  // publicPath: selectPublicPath(),
  // WebpackDevServer is noisy by default so we emit custom message instead
  // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
  quiet: true,
  // Reportedly, this avoids CPU overload on some systems.
  // https://github.com/facebook/create-react-app/issues/293
  // src/node_modules is not ignored to support absolute imports
  // https://github.com/facebook/create-react-app/issues/1065
  watchOptions: {
    ignored: ignoredFiles(selectAppPath(state)),
  },
  // https: selectHttpsConfig(state),
  // host: selectHost(state),
  overlay: false,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebook/create-react-app/issues/387.
    disableDotRule: true,
    index: selectPublicUrlOrPath(state),
  },
  // public: selectAllowHosts(state),
  // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
  // proxy: selectProxy(state),
  before(app, server) {
    // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
    // middlewares before `redirectServedPath` otherwise will not have any effect
    // This lets us fetch source contents from webpack for the error overlay
    app.use(evalSourceMapMiddleware(server));
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware());
  },
  after(app) {
    // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
    // app.use(redirectServedPath(selectPublicUrlOrPath(state)));

    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    // We do this in development to avoid hitting the production cache if
    // it used the same host and port.
    // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
    app.use(noopServiceWorkerMiddleware());
  },
});
