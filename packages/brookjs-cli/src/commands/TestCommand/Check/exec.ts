import path from 'path';
import { Delta } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import Kefir from 'kefir';
import { glob, prettier } from '../../../services';
import * as actions from './actions';
import { State, Action } from './types';

export const exec: Delta<Action, State> = (action$, state$) => {
  const glob$ = state$.take(1).flatMap(state =>
    glob(path.join(state.cwd, state.rc?.dir ?? 'src', '**/*.{js,jsx,ts,tsx}'))
      .map(files => actions.globDir.success(files))
      .flatMapErrors(err => Kefir.constant(actions.globDir.failure(err)))
  );

  const check$ = sampleStateAtAction(
    action$,
    state$,
    actions.check.project.request
  ).flatMap(state =>
    Kefir.concat<Action, never>([
      Kefir.merge(state.files.map(file => prettier.check(file.path)))
        .map(result => actions.check.file.success(result))
        .flatMapErrors(error =>
          Kefir.constant(actions.check.file.failure(error))
        ),
      Kefir.constant(actions.check.project.success())
    ])
  );

  return Kefir.merge<Action, never>([glob$, check$]);
};
