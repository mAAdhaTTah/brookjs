import R from 'ramda';
import { Kefir } from 'brookjs';
import { INIT_CONFIG_RESPONSE, RUN, SCAFFOLD_ERROR, FILE_CREATED,
    initConfigResponse, confirmConfig } from '../actions';
import { selectConfirmMessage } from '../selectors';

const newProjectPrompt = ({ ui }, actions$, state$) => {
    const prompt$ = state$.take(1).flatMap((/* state */) => ui.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the application name?'
        },
        {
            type: 'input',
            name: 'version',
            message: 'What is the application version?',
            default: '0.0.0'
        },
        {
            type: 'input',
            name: 'description',
            message: 'What is the application description?',
            default: ''
        },
        {
            type: 'input',
            name: 'dir',
            message: 'Where will the application src live?',
            default: 'src'
        },
        {
            type: 'list',
            name: 'license',
            message: 'Choose a license.',
            choices: ['MIT', 'ISC'],
            default: 'MIT'
        }
    ]))
        .map(initConfigResponse);

    const confirm$ = state$.sampledBy(actions$.ofType(INIT_CONFIG_RESPONSE)).take(1)
        .flatMap(state => ui.prompt([{
            type: 'confirm',
            name: 'confirmed',
            message: selectConfirmMessage(state)
        }]))
        .map(confirmConfig);

    return Kefir.merge([
        prompt$,
        confirm$
    ]);
};

const log = ({ ui }, actions$/*, state$*/) => {
    const success$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case FILE_CREATED:
                return ui.success(`created file ${payload.path}`);
            default:
                return Kefir.never();
        }
    });

    const error$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case SCAFFOLD_ERROR:
                return ui.error(`error scaffolding file: ${payload.error.message}`);
            default:
                return Kefir.never();
        }
    });

    return Kefir.merge([
        success$,
        error$
    ]);
};

const commandNotFound = ({ ui }, actions$, state$) =>
    state$.take(1).flatMap(state => ui.error(`Command not found: ${state.command.name}.`));

export default R.curry((services, actions$, state$) =>
    state$.sampledBy(actions$.ofType(RUN)).flatMap(state => {
        switch (state.command.name) {
            case 'new':
                return Kefir.concat([
                    newProjectPrompt(services, actions$, state$),
                    log(services, actions$, state$)
                ]);
            default:
                return commandNotFound(services, actions$, state$);
        }
    }));
