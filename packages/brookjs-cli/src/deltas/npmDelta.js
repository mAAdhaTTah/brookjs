import R from 'ramda';
import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { FILE_CREATED } from '../actions';

const pathIsPkgJson = R.pipe(
    R.path(['payload', 'path']),
    R.contains('package.json')
);

export default R.curry(({ npm }, actions$, state$) => {
    const new$ = state$.sampledBy(
        actions$.thru(ofType(FILE_CREATED)).filter(pathIsPkgJson).take(1)
    )
        .flatMap(npm.install([
            {
                pkg: '@babel/polyfill',
                dev: false
            },
            {
                pkg: 'brookjs@beta',
                dev: false
            },
            {
                pkg: 'brookjs-silt@beta',
                dev: false
            },
            {
                pkg: 'redux',
                dev: false
            },
            {
                pkg: 'redux-devtools-extension',
                dev: false
            },
            {
                pkg: 'react',
                dev: false
            },
            {
                pkg: 'react-dom',
                dev: false
            },
            {
                pkg: 'prop-types',
                dev: false
            },
            {
                pkg: 'redux-actions',
                dev: false
            },
            {
                pkg: 'reselect',
                dev: false
            },
            {
                pkg: 'brookjs-cli@beta',
                dev: true
            },
            {
                pkg: 'babel-preset-brookjs@beta',
                dev: true
            },
            {
                pkg: '@babel/preset-env',
                dev: true
            },
            {
                pkg: 'eslint-config-valtech',
                dev: true
            },
            {
                pkg: 'eslint-plugin-react',
                dev: true
            },
            {
                pkg: 'hygen',
                dev: true
            }
        ]));

    return Kefir.merge([
        new$
    ]);
});
