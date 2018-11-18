import path from 'path';
import R from 'ramda';
import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { runner } from 'hygen';
import inquirer from 'inquirer';
import execa from 'execa';
import { RUN, CONFIRM_CONFIG, READ_ENV, READ_RC_FILE, fileCreated } from '../actions';
import { selectNewProjectContext, selectFilePath,
    selectBarrelPath, selectExportTemplate, selectMakeContext, isMakeCommand,
    selectInstanceTemplate } from '../selectors';
import { lCommandFileOpts } from '../lenses';

/**
 * Match the Logger interface expected by Hygen.
 */
class Logger {
    constructor(logger) {
        this.logger = logger;
    }

    log(msg) {
        this.logger.info(msg);
    }

    colorful(msg) {
        this.logger.info(msg);
    }

    notice(msg) {
        this.logger.info(msg);
    }

    warn(msg) {
        this.logger.warn(msg);
    }

    err(msg) {
        this.logger.error(msg);
    }

    ok(msg) {
        this.logger.info(msg);
    }
}

export default ({ scaffold, logger }) => (actions$, state$) => {
    const new$ = state$.sampledBy(actions$.thru(ofType(CONFIRM_CONFIG))).take(1).delay(0)
        .flatMap(state => {
            const argv = ['project', 'new'];

            for (const [key, value] of Object.entries(selectNewProjectContext(state))) {
                argv.push(`--${key}`);
                argv.push(value);
            }

            return Kefir.fromPromise(runner(argv, {
                templates: path.join(__dirname, '..', '..', 'templates'),
                cwd: state.env.cwd,
                logger: new Logger(logger),
                createPrompter: () => inquirer,
                exec: (action, body) => {
                    const opts = body && body.length > 0 ? { input: body } : {};
                    return execa.shell(action, opts);
                },
                debug: !!process.env.DEBUG
            }))
                .flatMap(output =>
                    Kefir.merge(
                        output.actions.map(({ subject }) =>
                            Kefir.constant(fileCreated(subject))
                        )
                    )
                );
        });

    const make$ = state$.sampledBy(actions$.thru(ofType(READ_RC_FILE, READ_ENV, RUN)).bufferWithCount(3))
        .take(1).filter(isMakeCommand).flatMap(state => {
            const specs = [{
                action: scaffold.APPEND,
                target: scaffold.APP,
                path: selectBarrelPath,
                template: R.view(lCommandFileOpts, state) ? selectExportTemplate : selectInstanceTemplate,
                context: selectMakeContext
            }];

            if (R.view(lCommandFileOpts, state)) {
                specs.push({
                    action: scaffold.APPEND,
                    target: scaffold.APP,
                    path: selectFilePath,
                    template: selectInstanceTemplate,
                    context: selectMakeContext
                });
            }

            return scaffold(specs, state);
        });

    return Kefir.merge([
        make$,
        new$
    ]);
};
