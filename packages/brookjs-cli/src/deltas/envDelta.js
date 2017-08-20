import R from 'ramda';
import { Kefir } from 'brookjs';
import { readEnv, RUN } from '../actions';

export default R.curry(({ process }, actions$) =>
    actions$.ofType(RUN).take(1).flatMap(() => Kefir.fromCallback(cb => {
        cb(readEnv(process.cwd()));
    })));
