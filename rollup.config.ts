import * as path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const pkg = require(path.resolve(process.cwd(), 'package.json'));

export default {
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
    ...(pkg.bin ? ['path', 'util', 'child_process', 'fs'] : [])
  ],
  output: [
    pkg.main && { file: pkg.main, format: 'cjs' },
    pkg.module && { file: pkg.module, format: 'es' },
    pkg.unpkg && { name: pkg.name, file: pkg.unpkg, format: 'umd' }
  ].filter(Boolean),
  plugins: [
    babel({
      configFile: path.join(__dirname, 'babel.config.js'),
      extensions: ['.ts', '.tsx', '.js']
    }),
    resolve({
      extensions: ['.ts', '.tsx', '.js']
    }),
    commonjs({
      namedExports: {
        '@storybook/addon-actions': [
          'action',
          'ADDON_ID',
          'PANEL_ID',
          'EVENT_ID'
        ],
        '@storybook/addons': ['makeDecorator'],
        react: [
          'createContext',
          'createElement',
          'Component',
          'Fragment',
          'forwardRef'
        ]
      }
    })
  ]
};
