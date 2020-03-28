import React from 'react';
import Kefir, { Subscription, Pool } from 'kefir';
import { Action } from 'redux';
import { Maybe } from 'brookjs-types';
import { Provider, Consumer } from './context';

type Props<A> = {
  root$?: (p: Pool<A, Error>) => Maybe<Subscription>;
  children: React.ReactNode;
};

export default class RootJunction<A extends Action> extends React.Component<
  Props<A>
> {
  childRoot$: Pool<A, Error> = Kefir.pool();
  sub?: Maybe<Subscription>;
  parentRoot$?: Maybe<Pool<A, Error>>;

  unplug() {
    this.parentRoot$?.unplug(this.childRoot$);
  }

  componentDidMount() {
    this.sub = this.props.root$?.(this.childRoot$);
  }

  componentDidUpdate(prevProps: Props<A>) {
    if (this.props.root$ !== prevProps.root$) {
      this.sub?.unsubscribe();
      this.sub = this.props.root$?.(this.childRoot$);
    }
  }

  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  render() {
    return (
      <Consumer>
        {parentRoot$ => {
          if (parentRoot$ != null) {
            if (this.parentRoot$ !== parentRoot$) {
              this.unplug();
              // @TODO(mAAdhaTTah) Constraint subtype issue
              this.parentRoot$ = parentRoot$.plug(this.childRoot$) as any;
            }
          }

          return (
            <Provider value={this.childRoot$}>{this.props.children}</Provider>
          );
        }}
      </Consumer>
    );
  }
}
