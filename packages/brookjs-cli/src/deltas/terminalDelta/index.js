import R from 'ramda';
import { Kefir } from 'brookjs';
import {  RUN } from '../../actions';
import log from './log';
import commandNotFound from './commandNotFound';
import newCommandPrompt from './newCommandPrompt';

export default R.curry((services, actions$, state$) =>
    state$.sampledBy(actions$.ofType(RUN)).take(1).flatMap(state => {
        switch (state.command.name) {
            case 'new':
                return Kefir.concat([
                    newCommandPrompt(services, actions$, state$),
                    log(services, actions$, state$)
                ]);
            case 'make':
            case 'dev':
            case 'test':
            case 'build':
                return log(services, actions$, state$);
            default:
                return commandNotFound(services, actions$, state$);
        }
    }));
