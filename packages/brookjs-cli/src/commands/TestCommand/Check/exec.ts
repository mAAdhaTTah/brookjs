import { Delta } from 'brookjs-types';
import { sampleStateAtAction, ofType } from 'brookjs-flow';
import Kefir from 'kefir';
import { prettier } from '../../../services';
import * as glob from '../../../glob';
import { check } from './actions';
import { State, Action } from './types';

export const exec: Delta<Action, State> = (action$, state$) => {
  const globLint$ = glob.delta(
    action$.thru(ofType(glob.actions.lint.request)),
    state$
  );

  const check$ = sampleStateAtAction(
    action$,
    state$,
    check.project.request
  ).flatMap(state =>
    Kefir.concat<Action, never>([
      Kefir.merge(state.files.map(file => prettier.check(file.path)))
        .map(result => check.file.success(result))
        .flatMapErrors(error => Kefir.constant(check.file.failure(error))),
      Kefir.constant(check.project.success())
    ])
  );

  return Kefir.merge<Action, never>([globLint$, check$]);
};
