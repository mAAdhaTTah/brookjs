import R from 'ramda';
import { Kefir } from 'brookjs';
import { FILE_CREATED } from '../actions';

const pathIsPkgJson = R.pipe(
    R.path(['payload', 'path']),
    R.contains('package.json')
);

export default R.curry(({ npm }, actions$, state$) => {
    const new$ = state$.sampledBy(
        actions$.ofType(FILE_CREATED).filter(pathIsPkgJson).take(1)
    )
        .flatMap(npm.install([
            {
                pkg: 'babel-polyfill',
                dev: false
            },
            {
                pkg: 'brookjs',
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
                pkg: 'valtech-nyc/brookjs-cli',
                dev: true
            }

        ]));

    return Kefir.merge([
        new$
    ]);
});
