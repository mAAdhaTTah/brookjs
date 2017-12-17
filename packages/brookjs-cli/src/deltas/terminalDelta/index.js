import R from 'ramda';
import { Kefir, ofType } from 'brookjs';
import { RUN } from '../../actions';
import log from './log';
import commandNotFound from './commandNotFound';
import devCommand from './devCommand';
import newCommandPrompt from './newCommandPrompt';

export default R.curry((services, actions$, state$) =>
    Kefir.merge([
        log(services, actions$, state$),
        state$.sampledBy(actions$.thru(ofType(RUN))).take(1).flatMap(state => {
            switch (state.command.name) {
                case 'new':
                    return newCommandPrompt(services, actions$, state$);
                case 'dev':
                    return devCommand(services, actions$, state$);
                case 'make':
                case 'test':
                case 'build':
                    return Kefir.never();
                default:
                    return commandNotFound(services, actions$, state$);
            }
        })
    ]));
