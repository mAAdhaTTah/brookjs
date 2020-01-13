import { Action, Reducer } from 'redux';
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import Kefir, { Observable, Property } from 'kefir';
import { upgradeReducer, EddyReducer } from 'brookjs';
import { Delta } from 'brookjs-types';

class Queue<T> extends Kefir.Stream<T, never> {
  private draining = false;
  private list: T[] = [];

  emit = (value: T) => {
    this.list.push(value);

    if (!this.draining) {
      this.drain();
    }
  };

  private drain() {
    this.draining = true;

    while (this.list.length) {
      (this as any)._dispatcher.dispatch({
        type: 'value',
        value: this.list.shift()
      });
    }

    this.draining = false;
  }
}

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

const useDeltas = <S, A extends Action<string>>(
  reducer: Reducer<S, A> | EddyReducer<S, A>,
  initialState: S,
  deltas: Delta<A, S>[] = defaultDeltas
) => {
  const action$: Queue<A> = useSingleton(() => new Queue());
  const state$: Property<S, never> = useMemo(
    () => action$.scan(upgradeReducer(reducer, action$.emit), initialState),
    // leaving out `initialState` cuz that only matters the first time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action$, reducer]
  );
  const [state, setState] = useState(initialState);

  useSubscribe(state$, setState);

  const delta$: Observable<A, never> = useMemo(
    () => Kefir.merge(deltas.map(delta => delta(action$, state$))),
    // leaving out `deltas` cuz we're spreading it instead.
    // we're doing this so people can pass in the `delta` as an array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deltas, action$, state$]
  );

  useSubscribe(delta$, action$.emit);

  const root$ = useCallback(
    (root$: Observable<A, Error>) => root$.observe(action$.emit),
    [action$]
  );

  return { state, root$, dispatch: action$.emit };
};

export default useDeltas;
