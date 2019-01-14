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

type Dispatchable < A > = A | typeof NONE;
type ResultRight < A > = Dispatchable<A> | Dispatchable<A>[];
type Result < S , A > = [S, ResultRight<A>] & {
  [$$loop]: true;
};

export interface EddyReducer<S, A> {
  (state: S | undefined, action: A): S | Result<S, A>;
}

const isResult = <S, A>(results: any): results is Result<S, A> =>
  results[$$loop] === true;

const normalizeResults = <S, A>(results: S | Result<S, A>): Result<S, A> =>
  isResult(results) ? results : loop(results, NONE);

export const eddy = () => <S extends object, A extends Action, Ext, StateExt>(
  createStore: StoreCreator
) => (
    reducer: Reducer<S, A> | EddyReducer<S, A>,
    state?: DeepPartial<S> | StoreEnhancer<Ext, StateExt>,
    enhancer?: StoreEnhancer<Ext, StateExt>
  ): Store<S & StateExt, A> & Ext => {
    let queue: ResultRight<A>[] = [];

    const upgradeReducer = (reducer: Reducer<S, A> | EddyReducer<S, A>) => (
      state: S | undefined,
      action: A
    ) => {
      const [nextState, cmd] = normalizeResults(reducer(state, action)) as [
      S,
      ResultRight<A>
    ];

      if (cmd !== NONE) {
        queue.push(cmd);
      }

      return nextState;
    };

    if (typeof state === 'function') {
      enhancer = state as StoreEnhancer<Ext, StateExt>;
      state = undefined;
    }

    const store = createStore(upgradeReducer(reducer), state, enhancer);

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
      store.replaceReducer(upgradeReducer(reducer));

    return {
      ...store,
      dispatch,
      replaceReducer
    } as any;
  };

export const loop = <S, A>(state: S, action: ResultRight<A>): Result<S, A> =>
  Object.assign([state, action] as [S, A], {
    [$$loop]: true as true
  });

loop.NONE = NONE;

type ReducerMapObject < S , A > = { [K in keyof S]: EddyReducer<S[K], A> };

export interface LiftedLoopReducer<S, A> {
  (state: S | undefined, action: A): Result<S, A>;
}

export const combineReducers = <S, A>(
  reducerMap: ReducerMapObject<S, A>
): LiftedLoopReducer<S, A> => {
  const reducerKeys = Object.keys(reducerMap);

  return (state: S = {} as S, action: A): Result<S, A> => {
    let hasChanged = false;
    const nextState = {} as S;
    const cmds: ResultRight<A> = [];

    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = (reducerMap as any)[key];
      const previousStateForKey = (state as any)[key];
      const [nextStateForKey, cmd] = normalizeResults(
        reducer(previousStateForKey, action)
      );

      if (cmd !== NONE) {
        cmds.push(cmd);
      }

      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      (nextState as any)[key] = nextStateForKey;
    }

    return loop(hasChanged ? nextState : state, cmds);
  };
};
