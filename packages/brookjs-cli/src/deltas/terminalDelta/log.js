import { Kefir } from 'brookjs';
import {  SCAFFOLD_ERROR, FILE_CREATED, READ_RC_FILE_ERROR,
    NPM_COMMAND_OUTPUT, NPM_COMMAND_FINISH } from '../../actions';

export default ({ ui }, actions$/*, state$*/) => {
    const success$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case FILE_CREATED:
                return ui.success(`created file ${payload.path}`);
            case NPM_COMMAND_FINISH:
                return ui.success(`npm finished with code ${payload.code}`);
            default:
                return Kefir.never();
        }
    });

    const error$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case SCAFFOLD_ERROR:
                return ui.error(`error scaffolding file: ${payload.error.message}`);
            case READ_RC_FILE_ERROR:
                return ui.error(`error reading .beaverrc.js: ${payload.error.message}`);
            default:
                return Kefir.never();
        }
    });

    const info$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case NPM_COMMAND_OUTPUT:
                return ui.info(`npm says: ${payload.output}`);
            default:
                return Kefir.never();
        }
    });

    return Kefir.merge([
        success$,
        error$,
        info$
    ]);
};
