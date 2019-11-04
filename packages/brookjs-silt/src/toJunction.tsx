/* eslint-disable import/export */
/*
  disabled because overloads are broken:
  https://github.com/benmosher/eslint-plugin-import/issues/1357
*/
import React from 'react';
import Kefir, { Observable, Pool } from 'kefir';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import { Action } from 'redux';
import { Consumer, Provider } from './context';

const id = <T extends any>(x: T) => x;

export type EventConfig = {
  [key: string]: (e$: Observable<any, Error>) => Observable<Action, Error>;
};

type ObservableDict<E extends EventConfig> = {
  [key in keyof E]: Observable<Action, Error>;
} & {
  children$: Observable<Action, Error>;
};

type ExtractFirstArgumentValue<T> = T extends (
  arg1: Observable<infer E, any>,
  ...args: any[]
) => any
  ? E
  : never;

type ProvidedProps<E extends EventConfig> = {
  [K in keyof E]: (e: ExtractFirstArgumentValue<E[K]>) => void;
};

type WithProps<E extends EventConfig, P extends ProvidedProps<E>> = Omit<
  P,
  keyof E
> & {
  preplug?: (source$: Observable<Action, Error>) => Observable<Action, Error>;
};

export type Combiner<E extends EventConfig, P extends ProvidedProps<E>> = (
  combined$: Observable<Action, Error>,
  sources: ObservableDict<E>,
  props: Readonly<WithProps<E, P>>
) => Observable<Action, Error>;

export function toJunction<E extends EventConfig>(
  events: E
): <P extends ProvidedProps<E>>(
  WrappedComponent: React.ComponentType<P>
) => React.ComponentType<WithProps<E, P>>;
export function toJunction<E extends EventConfig, P extends ProvidedProps<E>>(
  events: E,
  combine: Combiner<E, P>
): (
  WrappedComponent: React.ComponentType<P>
) => React.ComponentType<WithProps<E, P>>;
export function toJunction<E extends EventConfig, P extends ProvidedProps<E>>(
  events: E,
  combine: Combiner<E, P> = id
) {
  return (
    WrappedComponent: React.ComponentType<P>
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
          merged: Kefir.never()
        };

        for (const key in events) {
          const e$ = new Kefir.Stream<Event, Error>();
          this.events[key] = e => {
            (e$ as any)._emitValue(e);
          };
          this.sources.list.push(
            ((this.sources.dict as any)[key + '$'] = events[key](e$))
          );
        }

        this.sources.merged = Kefir.merge(this.sources.list);
        this.source$ = this.createSource();
      }

      createSource() {
        const combined$ = combine(
          this.sources.merged,
          this.sources.dict,
          this.props
        );

        if (this.props.preplug) {
          return this.props.preplug(combined$);
        }

        return combined$;
      }

      unplug() {
        this.root$ && this.root$.unplug(this.source$);
      }

      componentWillUnmount() {
        this.unplug();
      }

      componentDidUpdate() {
        this.unplug();
        this.root$ && this.root$.plug((this.source$ = this.createSource()));
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
                // eslint-disable-next-line no-console
                console.error(
                  'Used `toJunction` outside of Silt context. Needs to be wrapped in `<RootJunction>`'
                );
              }

              const props = {
                ...this.props,
                ...this.events
              } as P;

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
