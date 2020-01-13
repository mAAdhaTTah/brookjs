import { Delta } from 'brookjs-types';
import Kefir from 'kefir';
import { globLintDelta, globLint } from '../../../deltas';
import { Action, State } from './types';
import { ofType, sampleStateAtAction } from 'brookjs-flow';
import { lint } from './actions';
import { ESLintService } from '../../../services';

export const exec: Delta<Action, State> = (action$, state$) => {
  const globLint$ = globLintDelta(
    action$.thru(ofType(globLint.request)),
    state$
  );

  const lint$ = sampleStateAtAction(
    action$,
    state$,
    lint.project.request
  ).flatMap(state => {
    const eslint = ESLintService.create({ cwd: state.cwd, fix: false });

    return Kefir.concat<Action, never>([
      Kefir.merge(
        state.files.map(({ path }) =>
          eslint
            .check(path)
            .map(report => lint.file.success({ path, report }))
            .flatMapErrors(error =>
              Kefir.constant(lint.file.failure({ path, error }))
            )
        )
      ),
      Kefir.constant(lint.project.success())
    ]);
  });

  return Kefir.merge([globLint$, lint$]);
};
