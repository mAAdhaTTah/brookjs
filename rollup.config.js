import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const BASE_PATH = process.cwd();
const pkg = require(path.resolve(BASE_PATH, 'package.json'));

const cjs = {
    namedExports: {
        'create-react-ref': ['createRef', 'forwardRef', 'getRef']
    }
};

export default [
    {
        input: 'src/index.js',
        output: { name: pkg.name, file: pkg.browser, format: 'umd' },
        plugins: [
            babel(),
            resolve(),
            commonjs(cjs),
        ]
    },
    {
        input: 'src/index.js',
        external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            babel({
                'plugins': ['external-helpers']
            }),
            commonjs(cjs),
        ]
    }
];
