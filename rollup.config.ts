import * as path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import builtins from 'builtins';

process.env.BABEL_ENV = process.env.NODE_ENV = 'production';

const pkg = require(path.resolve(process.cwd(), 'package.json'));

const externalModules = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  ...(pkg.bin ? builtins('13.0.0') : [])
];
export default {
  input: 'src/index.ts',
  external: id => {
    // Bare module identifier
    if (!id.includes('/')) {
      return true;
    }

    // Relative path
    if (id.startsWith('.')) {
      return false;
    }

    // These are absolute paths
    if (id.includes('babel-runtime')) {
      return true;
    }

    if (externalModules.includes(id)) {
      return true;
    }

    const packageName = id
      .split('node_modules')
      .pop()
      .split('/')
      .shift();

    if (!packageName) {
      return false;
    }

    return externalModules.includes(packageName);
  },
  output: [
    pkg.main && { file: pkg.main, format: 'cjs' },
    pkg.module && { file: pkg.module, format: 'es' },
    pkg.unpkg && { name: pkg.name, file: pkg.unpkg, format: 'umd' }
  ].filter(Boolean),
  plugins: [
    babel({
      runtimeHelpers: true,
      configFile: path.join(__dirname, 'babel.config.js'),
      extensions: ['.ts', '.tsx', '.js']
    }),
    resolve({
      extensions: ['.ts', '.tsx', '.js']
    }),
    commonjs({
      namedExports: {
        '@storybook/react': ['addDecorator'],
        '@storybook/theming': ['withTheme'],
        '@storybook/components': ['ActionBar'],
        '@storybook/addons': ['makeDecorator'],
        react: [
          'createContext',
          'createElement',
          'Component',
          'Fragment',
          'forwardRef'
        ]
      }
    }),
    json()
  ]
};
