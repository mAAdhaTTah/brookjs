import React, { useMemo, useEffect } from 'react';
import Kefir, { Observable, Pool, Stream } from 'kefir';
import { Action } from 'redux';
import { Provider, useCentralObservable } from './context';
import { wrapDisplayName } from './wrapDisplayName';
import { useSingleton } from './hooks';

const id: Combiner = x => x;

type ObservableDict<E extends { [key: string]: any }> = {
  [K in keyof E]: Observable<Action, never>;
} & {
  children$: Observable<Action, never>;
};

type ProvidedProps<E extends { [key: string]: any }> = {
  [K in keyof E]: (e: E[K]) => void;
};

type WithProps<E extends { [key: string]: any }, P extends {}> = Omit<
  P,
  keyof E
> & {
  preplug?: (source$: Observable<Action, never>) => Observable<Action, never>;
};

export type Combiner = (
  combined$: Observable<Action, never>,
) => Observable<Action, never>;

type Events<E> = {
  [K in keyof E]: (
    obs$: Stream<E[K], never>,
  ) => Observable<Action<string>, never>;
};

export function toJunction<E extends { [key: string]: any }>(): <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) => React.FC<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }>(
  events: Events<E>,
): <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) => React.FC<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }>(
  events: Events<E>,
  combine: Combiner,
): <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) => React.FC<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }>(
  combine: Combiner,
): <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) => React.FC<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }>(
  _events: Events<E> | Combiner = {} as Events<E>,
  _combine: Combiner = id,
) {
  let events: Events<E>, combine: Combiner;

  if (typeof _events === 'function') {
    combine = _events;
    events = {} as Events<E>;
  } else {
    events = _events;
    combine = _combine;
  }

  return <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
    const ToJunction: React.FC<WithProps<E, P>> = ({ preplug, ...props }) => {
      const children$ = useSingleton(() => Kefir.pool() as Pool<Action, never>);

      const { combined$, eventCallbacks } = useMemo(() => {
        const eventCallbacks = {} as ProvidedProps<E>;
        const list: Observable<Action, never>[] = [children$];

        for (const key in events) {
          const e$ = new Kefir.Stream<any, never>();
          eventCallbacks[key] = e => {
            (e$ as any)._emitValue(e);
          };
          list.push(events[key](e$));
        }

        return { combined$: combine(Kefir.merge(list)), eventCallbacks };
      }, [children$]);

      const source$ = useMemo(() => preplug?.(combined$) ?? combined$, [
        combined$,
        preplug,
      ]);

      const central$ = useCentralObservable();

      useEffect(() => {
        if (central$ == null) {
          console.error(
            'Used `toJunction` with no Central Observable. Needs to be wrapped in `<RootJunction>`',
          );
        } else {
          central$.plug(source$);
        }

        return () => void central$?.unplug(source$);
      }, [central$, source$]);

      return (
        <Provider value={children$}>
          {/* TODO(mAAdhaTTah) would be nice for this to type right. */}
          <WrappedComponent {...(props as any)} {...eventCallbacks} />
        </Provider>
      );
    };

    ToJunction.displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

    return ToJunction;
  };
}
