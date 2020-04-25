import { Action, Reducer } from 'redux';
import { useEffect, useCallback, useMemo, useState, useContext } from 'react';
import Kefir, { Observable, Property } from 'kefir';
import { upgradeReducer, EddyReducer } from 'brookjs-eddy';
import { Delta } from 'brookjs-types';
import { CentralObservableContext } from './context';
import { useSingleton, useSubscribe } from './hooks';

class Queue<T> extends Kefir.Stream<T, never> {
  private draining = false;
  private list: T[] = [];

  static create<A>() {
    return new Queue<A>();
  }

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
        value: this.list.shift(),
      });
    }

    this.draining = false;
  }
}

const defaultDelta: Delta<any, any> = () => Kefir.never();

export const useDelta = <S, A extends Action<string>>(
  reducer: Reducer<S, A> | EddyReducer<S, A>,
  initialState: S,
  delta: Delta<A, S> = defaultDelta,
) => {
  const action$ = useSingleton(Queue.create as () => Queue<A>);
  const state$: Property<S, never> = useMemo(
    () => action$.scan(upgradeReducer(reducer, action$.emit), initialState),
    // leaving out `initialState` cuz that only matters the first time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action$, reducer],
  );
  const [state, setState] = useState(initialState);

  useSubscribe(state$, setState);

  const delta$: Observable<A, never> = useMemo(() => delta(action$, state$), [
    delta,
    action$,
    state$,
  ]);

  useSubscribe(delta$, action$.emit);

  const central$ = useContext(CentralObservableContext);

  useEffect(() => {
    central$?.plug(action$);

    return () => void central$?.unplug(action$);
  }, [central$, action$]);

  const root$ = useCallback(
    (root$: Observable<A, Error>) => root$.observe(action$.emit),
    [action$],
  );

  return { state, root$, dispatch: action$.emit };
};
