import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { INIT_CONFIG_RESPONSE, initConfigResponse, confirmConfig } from '../../actions';
import { selectConfirmMessage } from '../../selectors';

const defaultConfig = {
    version: '0.0.0',
    description: '',
    dir: 'src',
    license: 'MIT'
};

export default ({ ui }, actions$, state$) => {
    const prompt$ = state$.take(1).flatMap(state =>
        state.command.opts.yes === true
            ? Kefir.later(0, initConfigResponse({ ...defaultConfig, name: state.command.args.name }))
            : ui.prompt([
                {
                    type: 'input',
                    name: 'version',
                    message: 'What is the application version?',
                    default: defaultConfig.version
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'What is the application description?',
                    default: defaultConfig.description
                },
                {
                    type: 'input',
                    name: 'dir',
                    message: 'Where will the application source live?',
                    default: defaultConfig.dir
                },
                {
                    type: 'list',
                    name: 'license',
                    message: 'Choose a license.',
                    choices: ['MIT', 'ISC'],
                    default: defaultConfig.license
                }
            ])
                .map(response => initConfigResponse({ ...response, name: state.command.args.name }))
    );

    const confirm$ = state$.sampledBy(actions$.thru(ofType(INIT_CONFIG_RESPONSE))).take(1)
        .flatMap(state =>
            state.command.opts.yes === true
                ? Kefir.constant({ confirmed: true })
                : ui.prompt([{
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
