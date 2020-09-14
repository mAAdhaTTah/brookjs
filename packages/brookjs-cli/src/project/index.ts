import path from 'path';
import Kefir, { Observable } from 'kefir';
import { createAsyncAction, ActionType, getType } from 'typesafe-actions';
import { Delta } from 'brookjs-types';
import { ofType } from 'brookjs-flow';
import * as t from 'io-ts';
import { EddyReducer } from 'brookjs-eddy';
import { useEffect } from 'react';
import { service as fs } from '../fs';
import { RootAction } from '../types';

export type Ext = 'ts' | 'js';

export const Pkg = t.type({
  name: t.string,
});

export type Pkg = t.TypeOf<typeof Pkg>;

export const setupTestsPath = (cwd: string, dir: string, ext: Ext) =>
  path.join(cwd, dir, `setupTests.${ext}`);

export const extension$ = (cwd: string): Observable<Ext, never> =>
  fs
    .access(path.join(cwd, 'tsconfig.json'))
    .map(() => 'ts')
    .flatMapErrors(() => Kefir.constant('js'));

export const package$ = (cwd: string): Observable<Pkg, Error> =>
  fs
    .readFile(path.join(cwd, 'package.json'))
    .flatMap(buff => {
      try {
        return Kefir.constant(JSON.parse(buff.toString()) as unknown);
      } catch (error) {
        return Kefir.constantError(error);
      }
    })
    .flatMap(pkg =>
      Pkg.decode(pkg).fold<Observable<Pkg, Error>>(
        () =>
          Kefir.constantError(new Error('`name` is not defined in pkg.json')),
        pkg => Kefir.constant(pkg),
      ),
    );

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
  initialize: createAsyncAction(
    'PROJECT_EXTENSION_REQUESTED',
    'PROJECT_EXTENSION_SUCCEEDED',
    'PROJECT_EXTENSION_FAILED',
  )<{ cwd: string }, { ext: Ext; pkg: Pkg }, Error>(),
};

export type Action = ActionType<typeof actions>;

type Uninitialized = {
  status: 'uninitialized';
};

type Initializing = {
  status: 'initializing';
};

type Initialized = {
  status: 'initialized';
  ext: Ext;
  pkg: Pkg;
};

type InitializeError = {
  status: 'error';
  error: Error;
};

export type State =
  | Uninitialized
  | Initializing
  | Initialized
  | InitializeError;

export const reducer: EddyReducer<State, RootAction> = (
  state: State = { status: 'uninitialized' },
  action: RootAction,
) => {
  switch (state.status) {
    case 'uninitialized':
      switch (action.type) {
        case getType(actions.initialize.request):
          return {
            status: 'initializing',
          } as const;
        default:
          return state;
      }
    case 'initializing':
      switch (action.type) {
        case getType(actions.initialize.success):
          return {
            status: 'initialized',
            ext: action.payload.ext,
            pkg: action.payload.pkg,
          } as const;
        case getType(actions.initialize.failure):
          return {
            status: 'error',
            error: action.payload,
          } as const;
        default:
          return state;
      }
    default:
      return state;
  }
};

export const delta: Delta<Action, State> = action$ => {
  const initialize$ = action$
    .thru(ofType(actions.initialize.request))
    .flatMap(action =>
      extension$(action.payload.cwd)
        .combine(package$(action.payload.cwd), (ext, pkg) => ({ ext, pkg }))
        .map(payload => actions.initialize.success(payload))
        .flatMapErrors(err => Kefir.constant(actions.initialize.failure(err))),
    );

  return initialize$;
};

export const useInitializeProject = (
  state: State,
  cwd: string,
  dispatch: React.Dispatch<Action>,
) => {
  useEffect(() => {
    if (state.status === 'uninitialized') {
      dispatch(actions.initialize.request({ cwd }));
    }
  }, [cwd, dispatch, state]);
};
