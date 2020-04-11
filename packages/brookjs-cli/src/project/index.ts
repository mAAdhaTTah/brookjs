import path from 'path';
import Kefir, { Observable } from 'kefir';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import { Delta } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import { service as fs } from '../fs';

export type Ext = 'ts' | 'js';

export const setupTestsPath = (cwd: string, dir: string, ext: Ext) =>
  path.join(cwd, dir, `setupTests.${ext}`);

export const extension$ = (cwd: string): Observable<Ext, never> =>
  fs
    .access(path.join(cwd, 'tsconfig.json'))
    .map(() => 'ts')
    .flatMapErrors(() => Kefir.constant('js'));

export const setupTestsConfig$ = (
  cwd: string,
  dir: string,
  ext: Ext,
): Observable<string[], never> =>
  fs
    .access(setupTestsPath(cwd, dir, ext))
    .map(() => [`<rootDir>/${dir}/setupTests.${ext}`])
    .flatMapErrors(() => Kefir.constant([]));

export const actions = {
  extension: createAsyncAction(
    'PROJECT_EXTENSION_REQUESTED',
    'PROJECT_EXTENSION_SUCCEEDED',
    'PROJECT_EXTENSION_FAILED',
  )<void, Ext, never>(),
};

export type Action = ActionType<typeof actions>;

export type State = {
  cwd: string;
};

export const delta: Delta<Action, State> = (action$, state$) =>
  sampleStateAtAction(action$, state$, actions.extension.request)
    .flatMap(state => extension$(state.cwd))
    .map(actions.extension.success);
