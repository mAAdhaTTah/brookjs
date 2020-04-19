import path from 'path';
import Kefir, { Stream } from 'kefir';
import { Delta, Maybe } from 'brookjs-types';
import { sampleByAction } from 'brookjs-flow';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import glob from 'glob';

export const actions = {
  lint: createAsyncAction(
    'GLOB_LINT_REQUESTED',
    'GLOB_LINT_SUCCEEDED',
    'GLOB_LINT_FAILED',
  )<void, string[], Error>(),
  format: createAsyncAction(
    'GLOB_FORMAT_REQUESTED',
    'GLOB_FORMAT_SUCCEEDED',
    'GLOB_FORMAT_FAILED',
  )<void, string[], Error>(),
};

export type State = {
  cwd: string;
  rc: Maybe<{ dir?: string }>;
};

export const selectLintGlob = (cwd: string, dir: string) =>
  path.join(cwd, dir, '**/*.{js,jsx,mjs,ts,tsx}');

export const selectFormatGlob = (cwd: string, dir: string) =>
  path.join(cwd, dir, '**/*.{js,jsx,mjs,ts,tsx}');

export type Action = ActionType<typeof actions>;

export const delta: Delta<Action, State> = (action$, state$) => {
  const lint$ = state$
    .thru(sampleByAction(action$, actions.lint.request))
    .flatMap(state =>
      service(selectLintGlob(state.cwd, state.rc?.dir ?? 'src'))
        .map(files => actions.lint.success(files))
        .flatMapErrors(err => Kefir.constant(actions.lint.failure(err))),
    );

  const format$ = state$
    .thru(sampleByAction(action$, actions.format.request))
    .flatMap(state =>
      service(selectFormatGlob(state.cwd, state.rc?.dir ?? 'src'))
        .map(files => actions.format.success(files))
        .flatMapErrors(err => Kefir.constant(actions.format.failure(err))),
    );

  return Kefir.merge<Action, never>([lint$, format$]);
};

export const service = (target: string): Stream<string[], Error> =>
  Kefir.fromNodeCallback(cb => glob(target, cb));
