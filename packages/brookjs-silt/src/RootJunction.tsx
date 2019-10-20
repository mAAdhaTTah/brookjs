import React from 'react';
import Kefir, { Subscription, Pool } from 'kefir';
import { Action } from 'redux';
import { Provider } from './context';

type Props<A> = {
  root$: (p: Pool<A, Error>) => Subscription | void;
  children: React.ReactNode;
};

export default class RootJunction<A extends Action> extends React.Component<
  Props<A>
> {
  root$: Pool<A, Error> = Kefir.pool();
  sub?: Subscription | void;

  componentDidMount() {
    this.sub = this.props.root$(this.root$);
  }

  componentDidUpdate(prevProps: Props<A>) {
    if (this.props.root$ !== prevProps.root$) {
      this.sub && this.sub.unsubscribe();
      this.sub = this.props.root$(this.root$);
    }
  }

  componentWillUnmount() {
    this.sub && this.sub.unsubscribe();
  }

  render() {
    return <Provider value={this.root$}>{this.props.children}</Provider>;
  }
}
