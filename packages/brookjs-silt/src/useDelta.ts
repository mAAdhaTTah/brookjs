import { Action, Reducer } from 'redux';
import { useEffect, useCallback, useMemo, useState, useContext } from 'react';
import Kefir, { Observable } from 'kefir';
import { upgradeReducer, EddyReducer } from 'brookjs-eddy';
import { Delta } from 'brookjs-types';
import { CentralObservableContext } from './context';
import { useSingleton, useSubscribe } from './hooks';

class Queue<T> extends Kefir.Pool<T, never> {
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
  const loop$ = useSingleton(Queue.create as () => Queue<A>);

  useEffect(() => {
    const sub = loop$.observe(action$.emit);

    return () => sub.unsubscribe();
  }, [action$, loop$]);

  const state$ = useMemo(
    () => action$.scan(upgradeReducer(reducer, loop$.emit), initialState),
    // leaving out `initialState` cuz that only matters the first time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action$, reducer],
  );
  const [state, setState] = useState(initialState);

  useSubscribe(state$, setState);

  const delta$ = useMemo(() => delta(action$, state$), [
    delta,
    action$,
    state$,
  ]);

  useEffect(() => {
    const sub = delta$.observe(action$.emit);

    return () => sub.unsubscribe();
  }, [action$, delta$]);

  const central$ = useContext(CentralObservableContext);

  useEffect(() => {
    central$?.plug(loop$);

    return () => void central$?.unplug(loop$);
  }, [central$, loop$]);

  useEffect(() => {
    central$?.plug(delta$);

    return () => void central$?.unplug(delta$);
  }, [central$, delta$]);

  const root$ = useCallback(
    (root$: Observable<A, never>) => root$.observe(action$.emit),
    [action$],
  );

  return { state, root$, dispatch: action$.emit };
};
