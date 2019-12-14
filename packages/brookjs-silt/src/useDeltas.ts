import {
  useReducer,
  Reducer,
  ReducerState,
  ReducerAction,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef
} from 'react';
import Kefir, { Observable } from 'kefir';
import { Delta } from 'brookjs-types';

const useSingleton = <T>(creator: () => T): T => {
  const ref = useRef<T | null>(null);

  if (ref.current == null) {
    ref.current = creator();
  }

  return ref.current;
};

// Reuse this array to avoid React triggering rerenders.
const defaultDeltas: any[] = [];

const createAction$ = <R extends Reducer<any, any>>() =>
  new Kefir.Stream<ReducerAction<R>, never>();

const createState$ = <R extends Reducer<any, any>>() =>
  new Kefir.Property<ReducerState<R>, never>();

const useDeltas = <R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  deltas: Delta<ReducerAction<R>, ReducerState<R>>[] = defaultDeltas
) => {
  const [state, _dispatch] = useReducer(reducer, initialState);

  const actions$ = useSingleton(() => createAction$<R>());
  const state$ = useSingleton(() => createState$<R>());
  const lastAction = useRef<ReducerAction<R> | null>(null);

  const dispatch = useCallback(
    (action: ReducerAction<R>) => {
      lastAction.current = action;
      _dispatch(action);
    },
    [_dispatch]
  );

  useLayoutEffect(() => {
    (state$ as any)._emitValue(state);
    lastAction.current && (actions$ as any)._emitValue(lastAction.current);
  }, [state, state$]);

  const delta$ = useMemo(
    () =>
      Kefir.merge<ReducerAction<R>, never>(
        deltas.map(delta => delta(actions$, state$))
      ),
    [...deltas, state$, actions$]
  );

  useEffect(() => {
    const sub = delta$.observe(dispatch);

    return () => {
      sub.unsubscribe();
    };
  }, [delta$, dispatch]);

  const root$ = useCallback(
    (root$: Observable<ReducerAction<R>, Error>) => root$.observe(dispatch),
    [dispatch]
  );

  return { state, root$, dispatch };
};

export default useDeltas;
