import R from 'ramda';
import shelljs from 'shelljs';
import Kefir from 'kefir';
import { getMochaCommand } from '../../selectors';
import { shellCommand } from '../../actions';

export default R.curry(({  }, actions$, state$) =>
    state$.take(1).flatMap(state => Kefir.stream(emitter => {
        const command = getMochaCommand(state);

        emitter.value(shellCommand(command));

        shelljs.exec(command, code => {
            process.exitCode = code;
            emitter.end();
        });
    })));
