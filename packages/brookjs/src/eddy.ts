import {
  StoreCreator,
  Reducer,
  StoreEnhancer,
  Store,
  Action,
  DeepPartial
} from 'redux';

const $$loop = Symbol('@brookjs/loop');
const NONE = Symbol('@brookjs/none');

export type Dispatchable<A extends Action> = A | typeof NONE;
export type ResultRight<A extends Action> = Dispatchable<A> | Dispatchable<A>[];
export type Result<L, A extends Action> = [L, ResultRight<A>] & {
  [$$loop]: true;
};

export type EddyReducer<S, A extends Action> =
  | ((state: S | undefined, action: A) => S | Result<S, A>)
  | ((state: S, action: A) => S | Result<S, A>);

const isResult = <S, A extends Action>(results: any): results is Result<S, A> =>
  results[$$loop] === true;

export const loop = <S, A extends Action>(
  state: S,
  action: ResultRight<A>
): Result<S, A> =>
  Object.assign([state, action] as [S, A], {
    [$$loop]: true as true
  });

loop.NONE = NONE;

const normalizeResults = <S, A extends Action>(
  results: S | Result<S, A>
): Result<S, A> => (isResult(results) ? results : (loop(results, NONE) as any));

type HandleCmd<A extends Action> = (cmd: A) => void;

const iterateCmd = <A extends Action>(
  cmd: ResultRight<A>,
  handleCmd: HandleCmd<A>
) => {
  if (cmd !== loop.NONE) {
    if (Array.isArray(cmd)) {
      cmd.forEach(c => iterateCmd(c, handleCmd));
    } else {
      handleCmd(cmd);
    }
  }
};

export const upgradeReducer = <
  L,
  A extends Action,
  R extends (...args: any[]) => L | Result<L, A>
>(
  reducer: R,
  handleCmd: HandleCmd<A>
): ((...args: Parameters<R>) => L) => (...args) => {
  const [nextState, cmd] = normalizeResults(reducer(...args));

  iterateCmd(cmd, handleCmd);

  return nextState;
};

export const eddy = () => (createStore: StoreCreator) => <
  S extends object,
  A extends Action,
  Ext,
  StateExt
>(
  reducer: Reducer<S, A> | EddyReducer<S, A>,
  state?: DeepPartial<S> | StoreEnhancer<Ext, StateExt>,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S & StateExt, A> & Ext => {
  let queue: ResultRight<A>[] = [];
  const handleCmd = (cmd: A) => queue.push(cmd);

  if (typeof state === 'function') {
    enhancer = state as StoreEnhancer<Ext, StateExt>;
    state = undefined;
  }

  const store = createStore(
    upgradeReducer(reducer, handleCmd),
    state,
    enhancer
  );

  const runCommands = (run: ResultRight<A>[]) => {
    for (const cmd of run) {
      if (cmd !== NONE) {
        if (Array.isArray(cmd)) {
          runCommands(cmd);
        } else {
          // mutually recursive
          // eslint-disable-next-line no-use-before-define
          dispatch(cmd);
        }
      }
    }
  };

  const dispatch = (action: A) => {
    store.dispatch(action);
    const run = queue;
    queue = [];

    runCommands(run);

    return action;
  };

  const replaceReducer = (reducer: Reducer<S, A> | EddyReducer<S, A>) =>
    store.replaceReducer(upgradeReducer(reducer, handleCmd));

  return {
    ...store,
    dispatch,
    replaceReducer
  } as any;
};

type ReducerMapObject<S, A extends Action> = {
  [K in keyof S]: EddyReducer<S[K], A>;
};

export interface LiftedLoopReducer<S, A extends Action> {
  (state: S | undefined, action: A): Result<S, A>;
}

export const combineReducers = <S, A extends Action>(
  reducerMap: ReducerMapObject<S, A>
): LiftedLoopReducer<S, A> => {
  const reducerKeys = Object.keys(reducerMap) as (keyof S)[];

  return (state: S = {} as S, action: A): Result<S, A> => {
    let hasChanged = false;
    const nextState = {} as S;
    const cmds: ResultRight<A> = [];

    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducerMap[key];
      const previousStateForKey = state[key];
      const [nextStateForKey, cmd] = normalizeResults(
        reducer(previousStateForKey, action)
      );

      if (cmd !== NONE) {
        cmds.push(...(Array.isArray(cmd) ? cmd : [cmd]));
      }

      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      nextState[key] = nextStateForKey;
    }

    return loop(hasChanged ? nextState : state, cmds);
  };
};
