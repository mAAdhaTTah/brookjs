import Kefir, { Stream, Property, Observable, Emitter } from 'kefir';
import path from 'path';
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
  main: path.join(state.config.dir, 'app.js'),
  author: '', // @TODO(mAAdhaTTah) get author,
  license: state.config.license
});

const exec = ({  }: typeof import('../../services')) => (
  action$: Stream<Action, never>,
  state$: Property<State, never>
): Observable<Action, never> =>
  state$
    .filter(
      (state: State): state is ConfiguredState => state.step === 'creating'
    )
    .take(1)
    .flatMapFirst(state => {
      const argv = ['project', 'new'];

      for (const [key, value] of Object.entries(
        selectNewProjectContext(state)
      )) {
        argv.push(`--${key}`);
        argv.push(value);
      }

      // @TODO(mAAdhaTTah) check if dir exists and confirm overwrite
      // hygen expects to handle interactivity
      return Kefir.stream(emitter => {
        runner(argv, {
          // NOTE: This is relative to dist, where the build result is.
          templates: path.join(__dirname, '..', 'templates'),
          cwd: state.cwd,
          logger: new Logger(emitter),
          createPrompter: () => inquirer,
          exec: (action, body) => {
            const opts = body && body.length > 0 ? { input: body } : {};
            return execa.shell(action, opts);
          },
          debug: false
        })
          .then(result => {
            emitter.value({ type: 'CREATED', payload: { result } });
          })
          .catch(error => {
            emitter.value({ type: 'FAILED', error: true, payload: { error } });
          });
      });
    });

export default exec;
