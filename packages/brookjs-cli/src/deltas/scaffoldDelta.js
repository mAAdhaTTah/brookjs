import path from 'path';
import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { runner } from 'hygen';
import inquirer from 'inquirer';
import execa from 'execa';
import { CONFIRM_CONFIG, fileCreated } from '../actions';
import { selectNewProjectContext } from '../selectors';

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

export default ({ logger }) => (actions$, state$) => {
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

    return Kefir.merge([
        new$
    ]);
};
