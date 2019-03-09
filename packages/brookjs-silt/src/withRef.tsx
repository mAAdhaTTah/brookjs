import React, { forwardRef, createRef } from 'react';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import Kefir, { Pool, Observable, Property } from 'kefir';
import { Consumer } from './context';
import { Action } from 'redux';

// Ref-forward function has 2 params.
const isRefForwarding = <T, P>(
  x: unknown
): x is React.RefForwardingComponent<T, P> =>
  typeof x === 'function' && x.length === 2;

const wrap = <T, P>(
  WrappedComponent: React.ComponentType<P> | React.RefForwardingComponent<T, P>
) => {
  if (isRefForwarding(WrappedComponent)) {
    return forwardRef(WrappedComponent);
  }

  return WrappedComponent;
};

const withRef$ = <P, E extends Element>(
  refback: (
    ref$: Property<E, never>,
    props$: Observable<P, never>
  ) => Observable<Action, Error>
) => (WrappedComponent: React.RefForwardingComponent<E, P>) =>
  class WithRef$ extends React.Component<P> {
    static displayName = wrapDisplayName(WrappedComponent, 'WithRef$');

    static Target = wrap(WrappedComponent);

    props$ = new Kefir.Stream<P, never>()
      .toProperty(() => this.props)
      .setName(`${WithRef$.displayName}#props$`);

    ref$ = new Kefir.Property<E, never>().setName(
      `${WithRef$.displayName}#ref$`
    );

    aggregated$?: Pool<Action, Error>;

    plugged$?: Observable<Action, Error>;

    componentWillUnmount() {
      this.aggregated$ &&
        this.plugged$ &&
        this.aggregated$.unplug(this.plugged$);
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
            if (this.plugged$ && this.aggregated$ !== aggregated$) {
              this.aggregated$ && this.aggregated$.unplug(this.plugged$);
              this.aggregated$ = aggregated$.plug(this.plugged$);
            }

            if (!this.plugged$) {
              this.aggregated$ = aggregated$.plug(
                (this.plugged$ = refback(this.ref$, this.props$))
              );
            }

            return (
              <WithRef$.Target
                {...this.props}
                ref={(el: E | null) => el && (this.ref$ as any)._emitValue(el)}
              />
            );
          }}
        </Consumer>
      );
    }
  };

export default withRef$;
