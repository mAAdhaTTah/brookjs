import React, { forwardRef } from 'react';
import Kefir, { Pool, Observable, Property } from 'kefir';
import { Action } from 'redux';
import { Consumer } from './context';
import { wrapDisplayName } from './wrapDisplayName';

// Ref-forward function has 2 params.
const isRefForwarding = <T, P>(
  x: unknown
): x is React.RefForwardingComponent<T, P> =>
  typeof x === 'function' && x.length === 2;

const wrap = <E, P>(
  WrappedComponent: React.ElementType<P> | React.RefForwardingComponent<E, P>
) => {
  if (isRefForwarding(WrappedComponent)) {
    return forwardRef(WrappedComponent);
  }

  return WrappedComponent;
};

export type Refback<P, E extends Element, R extends { type: string }> = (
  ref$: Property<E, never>,
  props$: Property<P, never>
) => Observable<R, Error>;

export const withRef$ = <P, E extends Element, R extends { type: string }>(
  refback: Refback<P, E, R>
) => (
  WrappedComponent: React.RefForwardingComponent<E, P> | React.ElementType<P>
) =>
  class WithRef$ extends React.Component<P> {
    static displayName =
      typeof WrappedComponent !== 'string'
        ? wrapDisplayName(WrappedComponent, 'WithRef$')
        : `WithRef(${WrappedComponent})`;

    static Target: any = wrap(WrappedComponent);

    props$ = new Kefir.Stream<P, never>()
      .toProperty(() => this.props)
      .setName(`${WithRef$.displayName}#props$`);

    ref$ = new Kefir.Property<E, never>().setName(
      `${WithRef$.displayName}#ref$`
    );

    aggregated$?: Pool<Action, Error>;

    plugged$?: Observable<Action, Error>;

    refback = (el: E | null) => el && (this.ref$ as any)._emitValue(el);

    componentWillUnmount() {
      if (this.plugged$) {
        this.aggregated$?.unplug(this.plugged$);
      }
    }

    componentDidMount() {
      this.emitProps();
    }

    componentDidUpdate() {
      this.emitProps();
    }

    emitProps() {
      (this.props$ as any)._emitValue(this.props);
    }

    render() {
      return (
        <Consumer>
          {aggregated$ => {
            if (aggregated$ != null) {
              if (this.plugged$ && this.aggregated$ !== aggregated$) {
                this.aggregated$ && this.aggregated$.unplug(this.plugged$);
                this.aggregated$ = aggregated$.plug(this.plugged$);
              }

              if (!this.plugged$) {
                this.aggregated$ = aggregated$.plug(
                  (this.plugged$ = refback(this.ref$, this.props$))
                );
              }
            } else {
              console.error(
                'Used `withRef$` outside of Silt context. Needs to be wrapped in `<RootJunction>`'
              );
            }

            // eslint-disable-next-line react/jsx-pascal-case
            return <WithRef$.Target {...this.props} ref={this.refback} />;
          }}
        </Consumer>
      );
    }
  };
