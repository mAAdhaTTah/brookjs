import React from 'react';
import Kefir, { Observable, Pool } from 'kefir';
import * as PropTypes from 'prop-types';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import { Consumer, Provider } from './context';
import { Action } from 'redux';

const id = <T extends any>(x: T) => x;

type EventConfig = {
  [key: string]: (e$: Observable<Event, Error>) => Observable<Action, Error>;
};

type ObservableDict = { [key: string]: Observable<Action, Error> };

type ExtraProps<E extends object> = { [key in keyof E]: (e: Event) => void };

const toJunction = <
  E extends EventConfig,
  P extends {
    preplug: (source$: Observable<Action, Error>) => Observable<Action, Error>;
  }
>(
  events: E,
  combine: (
    combined$: Observable<Action, Error>,
    sources: ObservableDict,
    props: P
  ) => Observable<Action, Error> = id
) => (WrappedComponent: React.ComponentType<P & ExtraProps<E>>) =>
  class ToJunction extends React.Component<P> {
    static displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

    static defaultProps = {
      preplug: id
    };

    static propTypes = {
      preplug: PropTypes.func
    };

    root$: null | Pool<Action, Error>;
    events: ExtraProps<E>;
    sources: {
      list: Observable<Action, Error>[];
      dict: ObservableDict;
      merged: Observable<Action, Error>;
    };
    children$: Pool<Action, Error>;
    source$: any;

    constructor(props: P) {
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
      return this.props.preplug(
        combine(this.sources.merged, this.sources.dict, this.props)
      );
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

            return (
              <Provider value={this.children$}>
                <WrappedComponent {...this.events} {...this.props} />
              </Provider>
            );
          }}
        </Consumer>
      );
    }
  };

export default toJunction;
