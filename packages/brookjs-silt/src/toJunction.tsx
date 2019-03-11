import React from 'react';
import Kefir, { Observable, Pool } from 'kefir';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import { Action } from 'redux';
import { Consumer, Provider } from './context';
import { Omit } from 'yargs';

const id = <T extends any>(x: T) => x;

type EventConfig = {
  [key: string]: (e$: Observable<any, Error>) => Observable<Action, Error>;
};

type ObservableDict = { [key: string]: Observable<Action, Error> };

type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any
  ? U
  : never;

type ExtractValue<V> = V extends Observable<infer E, any> ? E : never;

type ExtraProps<E extends EventConfig> = {
  [K in keyof E]: (e: ExtractValue<FirstArgument<E[K]>>) => void
};

type WithPreplug<P extends object> = P & {
  preplug?: (source$: Observable<Action, Error>) => Observable<Action, Error>;
};

const toJunction = <P extends object, E extends EventConfig>(
  events: EventConfig,
  combine: (
    combined$: Observable<Action, Error>,
    sources: ObservableDict,
    props: Readonly<WithPreplug<Omit<P, keyof E>>>
  ) => Observable<Action, Error> = id
) => (WrappedComponent: React.ComponentType<P>) =>
  class ToJunction extends React.Component<WithPreplug<Omit<P, keyof E>>> {
    static displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

    root$: null | Pool<Action, Error>;
    events: ExtraProps<E>;
    sources: {
      list: Observable<Action, Error>[];
      dict: ObservableDict;
      merged: Observable<Action, Error>;
    };
    children$: Pool<Action, Error>;
    source$: any;

    constructor(props: WithPreplug<Omit<P, keyof E>>) {
      super(props);
      this.root$ = null;
      this.events = {} as ExtraProps<E>;

      this.children$ = Kefir.pool();

      this.sources = {
        list: [this.children$],
        dict: { children$: this.children$ },
        merged: Kefir.never()
      };

      for (const key in events) {
        const e$ = new Kefir.Stream<Event, Error>();
        this.events[key] = e => {
          (e$ as any)._emitValue(e);
        };
        this.sources.list.push(
          (this.sources.dict[key + '$'] = events[key](e$))
        );
      }

      this.sources.merged = Kefir.merge(this.sources.list);
      this.source$ = this.createSource();
    }

    createSource() {
      if (this.props.preplug) {
        return this.props.preplug(
          combine(this.sources.merged, this.sources.dict, this.props)
        );
      }

      return this.sources.merged;
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
            if (this.root$ !== root$) {
              this.unplug();
              this.root$ = root$.plug(this.source$);
            }

            const props = {
              ...this.events,
              ...this.props
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

export default toJunction;
