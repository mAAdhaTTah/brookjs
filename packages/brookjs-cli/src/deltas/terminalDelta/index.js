import R from 'ramda';
import { Kefir } from 'brookjs';
import {  RUN } from '../../actions';
import log from './log';
import commandNotFound from './commandNotFound';
import newCommandPrompt from './newCommandPrompt';

export default R.curry((services, actions$, state$) =>
    Kefir.merge([
        log(services, actions$, state$),
        state$.sampledBy(actions$.ofType(RUN)).take(1).flatMap(state => {
            switch (state.command.name) {
                case 'new':
                    return newCommandPrompt(services, actions$, state$);
                case 'make':
                case 'dev':
                case 'test':
                case 'build':
                    return Kefir.never();
                default:
                    return commandNotFound(services, actions$, state$);
            }
        })
    ]));
