import R from 'ramda';
import { Kefir } from 'brookjs';
import { INIT_CONFIG_RESPONSE, initConfigResponse, confirmConfig } from '../../../actions';
import { lCommandArgs, lCommandName } from '../../../lenses';
import { selectConfirmMessage } from '../../../selectors';

export const newCommandPrompt = ({ ui }, actions$, state$) => {
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

export const makeCommandPrompt = ({ ui }, actions$, state$) =>
    state$.take(1).flatMap(state =>
        ui.success(`Ran command '${R.view(lCommandName, state)}' with type '${R.view(lCommandArgs, state).type}'.`));
