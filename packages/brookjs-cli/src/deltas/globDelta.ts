import path from 'path';
import Kefir from 'kefir';
import { Delta, Maybe } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import { glob } from '../services';

export const globLint = createAsyncAction(
  'GLOB_LINT_DIR_REQUESTED',
  'GLOB_LINT_DIR_SUCCEEDED',
  'GLOB_LINT_DIR_FAILED'
)<void, string[], Error>();

type State = {
  cwd: string;
  rc: Maybe<{ dir?: string }>;
};

export const globLintDelta: Delta<ActionType<typeof globLint>, State> = (
  action$,
  state$
) =>
  sampleStateAtAction(action$, state$, globLint.request).flatMap(state =>
    glob(path.join(state.cwd, state.rc?.dir ?? 'src', '**/*.{js,jsx,ts,tsx}'))
      .map(files => globLint.success(files))
      .flatMapErrors(err => Kefir.constant(globLint.failure(err)))
  );
