import R from 'ramda';
import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { readEnv, readRcFile, readRcFileError, RUN, READ_ENV } from '../actions';
import { selectRcPath } from '../selectors';

export default R.curry(({ process, require }, actions$, state$) => {
    const beaverrc$ = state$.sampledBy(
        actions$.thru(ofType(RUN)).take(1).filter(({ payload }) => payload.command !== 'new')
            .flatMap(() => actions$.thru(ofType(READ_ENV)).take(1))
    )
        .flatMap(state => Kefir.stream(emitter => {
            try {
                emitter.value(readRcFile(require(selectRcPath(state))));
            } catch (e) {
                emitter.value(readRcFileError(e));
            }

            emitter.end();
        }));

    const cwd$ = actions$.thru(ofType(RUN)).take(1).flatMap(() => Kefir.fromCallback(cb => {
        cb(readEnv(process.cwd()));
    }));

    return Kefir.merge([
        beaverrc$,
        cwd$
    ]);
});
