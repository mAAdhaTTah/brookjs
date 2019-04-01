import Kefir, { Stream, Property } from 'kefir';
import { Nullable } from 'typescript-nullable';
import shelljs from 'shelljs';
import { shellCommand } from './actions';
import { getMochaCommand } from './selectors';
import { State, Action } from './types';

const exec = ({  }: typeof import('../../services')) => (
  action$: Stream<Action, never>,
  state$: Property<State, never>
): Stream<Action, never> =>
  state$
    .take(1)
    .filter(state => Nullable.isSome(state))
    .flatMap(state =>
      Kefir.stream(emitter => {
        const command = getMochaCommand(state);

        emitter.value(shellCommand.request(command));

        shelljs.exec(command, { silent: true }, (code, stdout, stderr) => {
          if (code !== 0) {
            emitter.value(shellCommand.failure({ code, stdout, stderr }));
          } else {
            emitter.value(shellCommand.success({ stdout }));
          }

          emitter.end();
        });
      })
    );

export default exec;
