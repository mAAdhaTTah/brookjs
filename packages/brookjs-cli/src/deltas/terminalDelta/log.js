import { Kefir } from 'brookjs';
import { SCAFFOLD_ERROR, READ_RC_FILE_ERROR, WEBPACK_COMPILED } from '../../actions';

const setExitCode = code => Kefir.stream(emitter => {
    process.exitCode = code;
    emitter.end();
});

export default ({ ui }, actions$/*, state$ */) => {
    const success$ = actions$.flatMap(({ type, payload }) => {
        switch (type) {
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
                return setExitCode(1);
            case READ_RC_FILE_ERROR:
                return Kefir.concat([
                    ui.error(`error reading .beaverrc.js: ${payload.error.message}`),
                    setExitCode(1)
                ]);
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
        // silly$
    ]);
};
