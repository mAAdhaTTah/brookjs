import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const BASE_PATH = process.cwd();
const pkg = require(path.resolve(BASE_PATH, 'package.json'));

const bbl = {
  configFile: path.join(__dirname, 'babel.config.js')
};

const cjs = {
  namedExports: {
    '@storybook/addon-actions': ['action', 'ADDON_ID', 'PANEL_ID', 'EVENT_ID'],
    '@storybook/addons': ['makeDecorator'],
    react: [
      'createContext',
      'createElement',
      'Component',
      'Fragment',
      'forwardRef'
    ]
  }
};

export default [
  pkg.unpkg && {
    input: 'src/index.js',
    output: { name: pkg.name, file: pkg.unpkg, format: 'umd' },
    plugins: [babel(bbl), resolve(), commonjs(cjs)]
  },
  {
    input: 'src/index.js',
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.dependencies || {})
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({ ...bbl, plugins: ['@babel/external-helpers'] }),
      commonjs(cjs)
    ]
  }
].filter(Boolean);
