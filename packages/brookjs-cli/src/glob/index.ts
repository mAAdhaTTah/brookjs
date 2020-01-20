import path from 'path';
import Kefir, { Stream } from 'kefir';
import { Delta, Maybe } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import glob from 'glob';

export const actions = {
  lint: createAsyncAction(
    'GLOB_LINT_DIR_REQUESTED',
    'GLOB_LINT_DIR_SUCCEEDED',
    'GLOB_LINT_DIR_FAILED'
  )<void, string[], Error>()
};

type State = {
  cwd: string;
  rc: Maybe<{ dir?: string }>;
};

export const delta: Delta<ActionType<typeof actions>, State> = (
  action$,
  state$
) =>
  sampleStateAtAction(action$, state$, actions.lint.request).flatMap(state =>
    service(
      path.join(state.cwd, state.rc?.dir ?? 'src', '**/*.{js,jsx,ts,tsx}')
    )
      .map(files => actions.lint.success(files))
      .flatMapErrors(err => Kefir.constant(actions.lint.failure(err)))
  );

export const service = (target: string): Stream<string[], Error> =>
  Kefir.fromNodeCallback(cb => glob(target, cb));
