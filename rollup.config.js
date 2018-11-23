import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const BASE_PATH = process.cwd();
const pkg = require(path.resolve(BASE_PATH, 'package.json'));

const cjs = {
    namedExports: {
        'create-react-ref': ['createRef', 'forwardRef', 'getRef'],
        '@storybook/addon-actions': ['action', 'ADDON_ID', 'PANEL_ID',
            'EVENT_ID'],
        '@storybook/addons': ['makeDecorator'],
        'react': ['createContext', 'createElement', 'Component', 'Fragment',
            'forwardRef']
    }
};

export default [
    {
        input: 'src/index.js',
        output: { name: pkg.name, file: pkg.unpkg, format: 'umd' },
        plugins: [
            babel(),
            resolve(),
            commonjs(cjs),
        ]
    },
    {
        input: 'src/index.js',
        external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            babel({
                'plugins': ['@babel/external-helpers']
            }),
            commonjs(cjs),
        ]
    }
];
