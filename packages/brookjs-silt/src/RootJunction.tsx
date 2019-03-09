import React from 'react';
import Kefir, { Subscription, Pool } from 'kefir';
import * as PropTypes from 'prop-types';
import { Provider } from './context';
import { Action } from 'redux';

export default class RootJunction extends React.Component<{
  root$: (p: Pool<Action, Error>) => Subscription | undefined;
  children: React.ReactNode;
}> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    root$: PropTypes.func.isRequired
  };

  root$: Pool<Action, Error> = Kefir.pool();
  sub?: Subscription;

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
