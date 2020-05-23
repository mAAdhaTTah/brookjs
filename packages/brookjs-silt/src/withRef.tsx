import React, { forwardRef, useCallback, useEffect } from 'react';
import Kefir, { Observable, Property } from 'kefir';
import { useCentralObservable } from './context';
import { wrapDisplayName } from './wrapDisplayName';
import { useSingleton } from './hooks';

// Ref-forward function has 2 params.
const isRefForwarding = <T, P>(
  x: unknown,
): x is React.RefForwardingComponent<T, P> =>
  typeof x === 'function' && x.length === 2;

const wrap = <E extends Element, P extends {}>(
  WrappedComponent: React.ElementType<P> | React.ForwardRefRenderFunction<E, P>,
): React.ElementType<P> | React.ForwardRefExoticComponent<P> => {
  if (isRefForwarding(WrappedComponent)) {
    return forwardRef(WrappedComponent) as React.ForwardRefExoticComponent<P>;
  }

  return WrappedComponent;
};

export type Refback<
  P extends {},
  E extends Element,
  R extends { type: string }
> = (
  ref$: Property<E, never>,
  props$: Property<P, never>,
) => Observable<R, never>;

const createProps$ = <P extends {}>() =>
  new Kefir.Property<P, never>().setName(`props$`);

const createRef$ = <E extends Element>() =>
  new Kefir.Property<E, never>().setName(`ref$`);

export const withRef$ = <
  P extends {},
  E extends Element,
  R extends { type: string }
>(
  refback: Refback<P, E, R>,
) => (
  WrappedComponent: React.ForwardRefRenderFunction<E, P> | React.ElementType<P>,
) => {
  // @TODO(mAAdhaTTah) why isn't this type working?
  const Target = wrap(WrappedComponent) as any;

  const WithRef$: React.FC<P> = props => {
    const props$ = useSingleton(createProps$ as () => Property<P, never>);
    const ref$ = useSingleton(createRef$ as () => Property<E, never>);
    const ref: React.RefCallback<E> = useCallback(
      el => void (el && (ref$ as any)._emitValue(el)),
      [ref$],
    );
    const central$ = useCentralObservable();

    useEffect(() => {
      (props$ as any)._emitValue(props);
    }, [props, props$]);

    useEffect(() => {
      if (central$ == null) {
        console.error(
          'Used `withRef$` with no Central Observable. Needs to be wrapped in `<RootJunction>`',
        );
        return;
      }

      const plugged$ = refback(ref$, props$);

      central$.plug(plugged$);

      return () => void central$.unplug(plugged$);
    }, [ref$, props$, central$]);

    return <Target {...props} ref={ref} />;
  };

  WithRef$.displayName = wrapDisplayName(WrappedComponent, 'WithRef$');

  return WithRef$;
};
