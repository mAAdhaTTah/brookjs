import R from 'ramda';
import { Kefir } from 'brookjs';
import { readEnv, readRcFile, readRcFileError, RUN } from '../actions';
import { lEnvCwd } from '../lenses';
import { selectRcPath } from '../selectors';

const envCwdHasValue = state => R.view(lEnvCwd, state) !== '';

export default R.curry(({ process, require }, actions$, state$) => {
    const cwd$ = actions$.ofType(RUN).take(1).flatMap(() => Kefir.fromCallback(cb => {
        cb(readEnv(process.cwd()));
    }));

    const beaverrc$ = state$.filterBy(
        actions$.ofType(RUN).take(1).map(({ payload }) => payload.command !== 'new')
    )
        .filter(envCwdHasValue).take(1)
        .delay(0) // this will be a promise when we switch to `import()`
        .flatMap(state => Kefir.stream(emitter => {
            try {
                emitter.value(readRcFile(require(selectRcPath(state))));
            } catch (e) {
                emitter.value(readRcFileError(e));
            }

            emitter.end();
        }));

    return Kefir.merge([
        beaverrc$,
        cwd$
    ]);
});
