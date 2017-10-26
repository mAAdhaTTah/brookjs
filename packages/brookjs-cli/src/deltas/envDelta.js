import R from 'ramda';
import { Kefir } from 'brookjs';
import { readEnv, readRcFile, readRcFileError, RUN, READ_ENV } from '../actions';
import { selectRcPath } from '../selectors';

export default R.curry(({ process, require }, actions$, state$) => {
    const beaverrc$ = state$.sampledBy(
        actions$.ofType(RUN).take(1).filter(({ payload }) => payload.command !== 'new')
            .flatMap(() => actions$.ofType(READ_ENV).take(1))
    )
        .flatMap(state => Kefir.stream(emitter => {
            try {
                emitter.value(readRcFile(require(selectRcPath(state))));
            } catch (e) {
                emitter.value(readRcFileError(e));
            }

            emitter.end();
        }));

    const cwd$ = actions$.ofType(RUN).take(1).flatMap(() => Kefir.fromCallback(cb => {
        cb(readEnv(process.cwd()));
    }));

    return Kefir.merge([
        beaverrc$,
        cwd$
    ]);
});
