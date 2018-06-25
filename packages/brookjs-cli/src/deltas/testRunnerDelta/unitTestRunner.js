import R from 'ramda';
import shelljs from 'shelljs';
import Kefir from 'kefir';
import { getMochaCommand } from '../../selectors';

export default R.curry(({  }, actions$, state$) =>
    state$.take(1).flatMap(state => Kefir.stream(emitter => {
        shelljs.exec(getMochaCommand(state), {
            shell: '/usr/local/bin/bash'
        }, code => {
            process.exitCode = code;
            emitter.end();
        });
    })));
