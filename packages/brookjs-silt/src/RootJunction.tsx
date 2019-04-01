import React from 'react';
import Kefir, { Subscription, Pool } from 'kefir';
import { Action } from 'redux';
import { Provider } from './context';

export default class RootJunction<A extends Action> extends React.Component<{
  root$: (p: Pool<A, Error>) => Subscription | void;
  children: React.ReactNode;
}> {
  root$: Pool<A, Error> = Kefir.pool();
  sub?: Subscription | void;

  componentDidMount() {
    this.sub = this.props.root$(this.root$);
  }

  componentWillUnmount() {
    this.sub && this.sub.unsubscribe();
  }

  render() {
    return <Provider value={this.root$}>{this.props.children}</Provider>;
  }
}
