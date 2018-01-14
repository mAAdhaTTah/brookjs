import { Kefir, ofType } from 'brookjs';
import { h, Text } from 'ink';
import {
    FILE_CREATED, NPM_COMMAND_FINISH, NPM_COMMAND_OUTPUT,
    NPM_COMMAND_SPAWNED, RUN, SCAFFOLD_ERROR,
    SCAFFOLD_FINISH
} from '../../actions';
import log from './log';
import CommandNotFound from './CommandNotFound';
import NewCommandPrompt from './NewCommandPrompt';
import devCommand from './devCommand';
import mountTerminal from './mountTerminal';

const success = msg => (
    <div><Text green bold>{msg}</Text></div>
);

const info = msg => (
    <div><Text bold>{msg}</Text></div>
);

const error = msg => (
    <div><Text bold red>{msg}</Text></div>
);

const toMessages = actions$ => actions$.scan((acc, { type, payload }) => {
    switch (type) {
        case FILE_CREATED:
            return [...acc, success(`created file ${payload.path}`)];
        case NPM_COMMAND_FINISH:
            return [...acc, success(`npm finished with code ${payload.code}`)];
        case SCAFFOLD_FINISH:
            return [...acc, success(`scaffolding finished successfully`)];
        case SCAFFOLD_ERROR:
            return [...acc, error(`error scaffolding file: ${payload.error.message}`)];
        case NPM_COMMAND_SPAWNED:
            return [...acc, info(`running ${payload.command}`)];
        case NPM_COMMAND_OUTPUT:
            return [...acc, info(`npm says: ${payload.output}`)];
        default:
            return acc;
    }
}, []);

export default (services) => (actions$, state$) =>
    Kefir.merge([
        log(services, actions$, state$),
        state$.sampledBy(actions$.thru(ofType(RUN))).take(1).flatMap(state => {
            switch (state.command.name) {
                case 'new':
                    return mountTerminal(
                        NewCommandPrompt,
                        Kefir.combine({
                            state: state$,
                            messages: actions$.thru(toMessages)
                        }, ({ state, messages }) => ({
                            ...state,
                            messages
                        }))
                    )
                        .takeUntilBy(
                            // 2 NPM commands are run (dev & prod deps)
                            actions$.thru(ofType(NPM_COMMAND_FINISH, SCAFFOLD_FINISH))
                                .bufferWithCount(3)
                                .take(1)
                        );
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
