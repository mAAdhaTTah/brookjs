import R from 'ramda';
import shelljs from 'shelljs';
import { Kefir } from 'brookjs';
import { getMochaCommand } from '../../selectors';

export default R.curry(({  }, actions$, state$) =>
    state$.take(1).flatMap(state => Kefir.stream(emitter => {
        shelljs.exec(getMochaCommand(state), {
            async: true,
            shell: '/usr/local/bin/bash'
        });

        emitter.end();
    })));
