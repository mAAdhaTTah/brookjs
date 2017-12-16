import { Kefir } from 'brookjs';
import { SCAFFOLD_ERROR, FILE_CREATED, READ_RC_FILE_ERROR,
    NPM_COMMAND_SPAWNED, NPM_COMMAND_OUTPUT, NPM_COMMAND_FINISH,
    WEBPACK_COMPILED } from '../../actions';

const setExitCode = code => Kefir.stream(emitter => {
    process.exitCode = code;
    emitter.end();
});

export default ({ ui }, actions$/*, state$ */) => {
    const success$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case FILE_CREATED:
                return ui.success(`created file ${payload.path}`);
            case NPM_COMMAND_FINISH:
                return ui.success(`npm finished with code ${payload.code}`);
            case WEBPACK_COMPILED:
                return Kefir.concat([
                    ui.success(`webpack compiled:\n`),
                    ui.log(payload.stats.toString({ colors: true }))
                ]);
            default:
                return Kefir.never();
        }
    });

    const error$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case SCAFFOLD_ERROR:
                return Kefir.concat([
                    ui.error(`error scaffolding file: ${payload.error.message}`),
                    setExitCode(1)
                ]);
            case READ_RC_FILE_ERROR:
                return Kefir.concat([
                    ui.error(`error reading .beaverrc.js: ${payload.error.message}`),
                    setExitCode(1)
                ]);
            default:
                return Kefir.never();
        }
    });

    const info$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
            case NPM_COMMAND_SPAWNED:
                return ui.info(`running ${payload.command}`);
            case NPM_COMMAND_OUTPUT:
                return ui.info(`npm says: ${payload.output}`);
            default:
                return Kefir.never();
        }
    });

    // Leaving this as it's useful debugging code until we get proper verbose outputs
    // or debugging tools.
    // const silly$ = Kefir.zip([actions$, state$]).flatMap(([action, state]) => Kefir.concat([
    //     ui.log(`action: ${JSON.stringify(action, null, '  ')}`),
    //     ui.log(`state: ${JSON.stringify(state, null, '  ')}`)
    // ]));

    return Kefir.merge([
        success$,
        error$,
        info$,
        // silly$
    ]);
};
