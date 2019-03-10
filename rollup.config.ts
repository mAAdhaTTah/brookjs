import * as path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const BASE_PATH = process.cwd();
const pkg = require(path.resolve(BASE_PATH, 'package.json'));

const input = 'src/index.ts';

const cjs = {
  namedExports: {
    '@storybook/addon-actions': ['action', 'ADDON_ID', 'PANEL_ID', 'EVENT_ID'],
    '@storybook/addons': ['makeDecorator'],
    'prop-types': ['element', 'func'],
    react: [
      'createContext',
      'createElement',
      'Component',
      'Fragment',
      'forwardRef'
    ]
  }
};

const bbl = {
  configFile: path.join(__dirname, 'babel.config.ts.js'),
  extensions: ['.ts', '.tsx', '.js']
};

const rslv = {
  extensions: ['.ts', '.tsx', '.js']
};

export default [
  pkg.unpkg && {
    input,
    output: { name: pkg.name, file: pkg.unpkg, format: 'umd' },
    plugins: [babel(bbl), resolve(rslv), commonjs(cjs)]
  },
  {
    input,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.dependencies || {})
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [babel(bbl), resolve(rslv), commonjs(cjs)]
  }
].filter(Boolean);
