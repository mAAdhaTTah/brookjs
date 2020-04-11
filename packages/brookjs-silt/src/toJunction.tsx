import React from 'react';
import Kefir, { Observable, Pool, Stream } from 'kefir';
import { Action } from 'redux';
import { Consumer, Provider } from './context';
import { wrapDisplayName } from './wrapDisplayName';

const id = <T extends any>(x: T) => x;

type ObservableDict<E extends { [key: string]: any }> = {
  [K in keyof E]: Observable<Action, Error>;
} & {
  children$: Observable<Action, Error>;
};

type ProvidedProps<E extends { [key: string]: any }> = {
  [K in keyof E]: (e: E[K]) => void;
};

type WithProps<E extends { [key: string]: any }, P extends {}> = Omit<
  P,
  keyof E
> & {
  preplug?: (
    source$: Observable<Action<string>, Error>,
  ) => Observable<Action<string>, Error>;
};

export type Combiner<P extends {}, E extends { [key: string]: any } = {}> = (
  combined$: Observable<Action, Error>,
  sources: ObservableDict<E>,
  props: Readonly<WithProps<E, P>>,
) => Observable<Action, Error>;

type Events<E> = {
  [K in keyof E]: (
    obs$: Stream<E[K], never>,
  ) => Observable<Action<string>, never>;
};

export function toJunction(): <P extends {}>(
  WrappedComponent: React.ElementType<P>,
) => React.ComponentType<WithProps<{}, P>>;
export function toJunction<E extends { [key: string]: any }>(
  events: Events<E>,
): <P extends {}>(
  WrappedComponent: React.ElementType<P>,
) => React.ComponentType<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }, P extends {}>(
  events: Events<E>,
  combine: Combiner<P, Events<E>>,
): (
  WrappedComponent: React.ComponentType<P>,
) => React.ComponentType<WithProps<E, P>>;
export function toJunction<E extends { [key: string]: any }, P extends {}>(
  events: Events<E> = {} as Events<E>,
  combine: Combiner<P, E> = id,
) {
  return (
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<WithProps<E, P>> =>
    class ToJunction extends React.Component<WithProps<E, P>> {
      static displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

      root$: null | Pool<Action, Error>;
      events: ProvidedProps<E>;
      sources: {
        list: Observable<Action, Error>[];
        dict: ObservableDict<E>;
        merged: Observable<Action, Error>;
      };
      children$: Pool<Action, Error>;
      source$: Observable<Action, Error>;

      constructor(props: WithProps<E, P>) {
        super(props);
        this.root$ = null;
        this.events = {} as ProvidedProps<E>;

        this.children$ = Kefir.pool();

        this.sources = {
          list: [this.children$],
          dict: { children$: this.children$ } as any,
          merged: Kefir.never(),
        };

        for (const key in events) {
          const e$ = new Kefir.Stream<any, never>();
          this.events[key] = e => {
            (e$ as any)._emitValue(e);
          };
          this.sources.list.push(
            ((this.sources.dict as any)[key + '$'] = events[key](e$)),
          );
        }

        this.sources.merged = Kefir.merge(this.sources.list);
        this.source$ = this.createSource();
      }

      createSource() {
        const combined$ = combine(
          this.sources.merged,
          this.sources.dict,
          this.props,
        );

        if (this.props.preplug) {
          return this.props.preplug(combined$);
        }

        return combined$;
      }

      unplug() {
        this.root$?.unplug(this.source$);
      }

      componentWillUnmount() {
        this.unplug();
      }

      componentDidUpdate() {
        this.unplug();
        this.root$?.plug((this.source$ = this.createSource()));
      }

      render() {
        return (
          <Consumer>
            {root$ => {
              if (root$ != null) {
                if (this.root$ !== root$) {
                  this.unplug();
                  this.root$ = root$.plug(this.source$);
                }
              } else {
                console.error(
                  'Used `toJunction` with no Central Observable.. Needs to be wrapped in `<RootJunction>`',
                );
              }

              const props = {
                ...this.props,
                ...this.events,
                // @TODO(mAAdhaTTah) would be nice for this to type right.
              } as any;

              return (
                <Provider value={this.children$}>
                  <WrappedComponent {...props} />
                </Provider>
              );
            }}
          </Consumer>
        );
      }
    };
}
