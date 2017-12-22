import { Kefir, ofType } from 'brookjs';
import { RUN } from '../../actions';
import log from './log';
import CommandNotFound from './CommandNotFound';
import NewCommandPrompt from './NewCommandPrompt';
import devCommand from './devCommand';
import mountTerminal from './mountTerminal';

export default (services) => (actions$, state$) =>
    Kefir.merge([
        log(services, actions$, state$),
        state$.sampledBy(actions$.thru(ofType(RUN))).take(1).flatMap(state => {
            switch (state.command.name) {
                case 'new':
                    return mountTerminal(NewCommandPrompt, state$);
                case 'dev':
                    return devCommand(services, actions$, state$);
                case 'make':
                case 'test':
                case 'build':
                    return Kefir.never();
                default:
                    return mountTerminal(CommandNotFound, state$);
            }
        })
    ]);
