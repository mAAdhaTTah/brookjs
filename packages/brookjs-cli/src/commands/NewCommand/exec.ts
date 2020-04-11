import path from 'path';
import Kefir, { Stream, Property, Observable, Emitter } from 'kefir';
import { runner } from 'hygen';
import inquirer from 'inquirer';
import execa from 'execa';
import { Action, State, ConfiguredState, Level, LogAction } from './types';

/**
 * Match the Logger interface expected by Hygen.
 */
class Logger {
  constructor(private emitter: Emitter<LogAction, never>) {
    this.emitter = emitter;
  }

  private emit(level: Level, msg: string) {
    this.emitter.value({ type: 'LOG', payload: { level, msg } });
  }

  log(msg: string) {
    this.emit('notice', msg);
  }

  colorful(msg: string) {
    this.emit('notice', msg);
  }

  notice(msg: string) {
    this.emit('notice', msg);
  }

  warn(msg: string) {
    this.emit('warn', msg);
  }

  err(msg: string) {
    this.emit('error', msg);
  }

  ok(msg: string) {
    this.emit('ok', msg);
  }
}

const selectNewProjectContext = (state: ConfiguredState) => ({
  dir: state.config.dir,
  name: state.config.name,
  version: state.config.version,
  description: state.config.description,
  main: path.join(state.config.dir, 'index.js'),
  author: '', // @TODO(mAAdhaTTah) get author,
  license: state.config.license,
  typescript: state.config.typescript,
});

const createHygenArgv = (state: ConfiguredState) => {
  const argv = ['project', 'new'];
  for (const [key, value] of Object.entries(selectNewProjectContext(state))) {
    if (typeof value === 'boolean' && value === true) {
      argv.push(`--${key}`);
    } else if (typeof value === 'string') {
      argv.push(`--${key}`);
      argv.push(value);
    }
  }
  return argv;
};

const exec = (
  action$: Stream<Action, never>,
  state$: Property<State, never>,
): Observable<Action, never> =>
  state$
    .filter(
      (state: State): state is ConfiguredState => state.step === 'creating',
    )
    .take(1)
    .flatMapFirst(state =>
      Kefir.stream(emitter => {
        // @TODO(mAAdhaTTah) check if dir exists and confirm overwrite
        // hygen will overwrite for now
        process.env.HYGEN_OVERWRITE = '1';
        runner(createHygenArgv(state), {
          // NOTE: This is relative to dist, where the build result is.
          templates: path.join(__dirname, '..', 'templates'),
          cwd: state.cwd,
          logger: new Logger(emitter),
          createPrompter: () => inquirer,
          exec: (action, body) => {
            const opts = body && body.length > 0 ? { input: body } : {};
            return execa(action, { ...opts, shell: true });
          },
          debug: false,
        })
          .then(result => {
            emitter.value({ type: 'CREATED', payload: { result } });
          })
          .catch(error => {
            emitter.value({ type: 'FAILED', error: true, payload: { error } });
          });
      }),
    );

export default exec;
