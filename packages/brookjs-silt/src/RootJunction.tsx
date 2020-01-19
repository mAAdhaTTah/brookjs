import React from 'react';
import Kefir, { Subscription, Pool } from 'kefir';
import { Action } from 'redux';
import { Maybe } from 'brookjs-types';
import { Provider } from './context';

type Props<A> = {
  root$?: (p: Pool<A, Error>) => Maybe<Subscription>;
  children: React.ReactNode;
};

export default class RootJunction<A extends Action> extends React.Component<
  Props<A>
> {
  root$: Pool<A, Error> = Kefir.pool();
  sub?: Maybe<Subscription>;

  componentDidMount() {
    this.sub = this.props.root$?.(this.root$);
  }

  componentDidUpdate(prevProps: Props<A>) {
    if (this.props.root$ !== prevProps.root$) {
      this.sub?.unsubscribe();
      this.sub = this.props.root$?.(this.root$);
    }
  }

  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  render() {
    return <Provider value={this.root$}>{this.props.children}</Provider>;
  }
}
