import {
  Reducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import Kefir, { Observable, Property, Stream } from 'kefir';
import { Delta } from 'brookjs-types';

const useSingleton = <T>(creator: () => T): T => {
  const ref = useRef<T | null>(null);

  if (ref.current == null) {
    ref.current = creator();
  }

  return ref.current;
};

const useSubscribe = <V>(
  obs$: Observable<V, never>,
  listener: (value: V) => void
) => {
  useEffect(() => {
    const sub = obs$.observe(listener);

    return () => {
      sub.unsubscribe();
    };
  }, [obs$, listener]);
};

// Reuse this array to avoid React triggering rerenders.
const defaultDeltas: any[] = [];

const useDeltas = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  deltas: Delta<A, S>[] = defaultDeltas
) => {
  const action$: Stream<A, never> = useSingleton(() => new Kefir.Stream());
  const state$: Property<S, never> = useMemo(
    () => action$.scan(reducer, initialState),
    [action$, reducer]
  );
  const [state, setState] = useState(initialState);

  useSubscribe(state$, setState);

  const delta$: Observable<A, never> = useMemo(
    () => Kefir.merge(deltas.map(delta => delta(action$, state$))),
    [...deltas, action$, state$]
  );
  const dispatch = useCallback(
    (action: A) => {
      (action$ as any)._emitValue(action);
    },
    [action$]
  );

  useSubscribe(delta$, dispatch);

  const root$ = useCallback(
    (root$: Observable<A, Error>) => root$.observe(dispatch),
    [dispatch]
  );

  return { state, root$, dispatch };
};

export default useDeltas;
