import Kefir, { Stream, Property, Observable, Subscription } from 'kefir';
import { Middleware } from 'redux';

export interface Delta<A, S> {
  (action$: Stream<A, never>, state$: Property<S, never>): Observable<A, never>;
}

type Ext = {
  subscription: Subscription;
};

/**
 * Accepts a set of delta generator functions and returns a
 * Middlware function, which generates the `deltas$` stream
 * and binds it to the store.
 *
 * Provides an Observable-based way to respond to events from,
 * and emit events into, the application's central redux store.
 *
 * The delta function takes an `action$` stream and a `state$`
 * stream, and should return a new `delta$` stream, which gets
 * observed by the store. Note that the `action$` stream will
 * re-emit events emitted from the returned `delta$` stream.
 *
 * Exposes the returned subscription, allowing other middleware
 * to terminate the delta.
 *
 * @param {...Function} sources - Source-generating function.
 * @returns {Middleware} Enhanced create store function.
 */
export function observeDelta<A extends { type: string }, S>(
  ...sources: Delta<A, S>[]
): Middleware<Ext, S> {
  return store => {
    const action$: Stream<A, never> = new (Kefir as any).Stream().setName(
      'action$'
    );
    const state$: Property<S, never> = new (Kefir as any).Stream()
      .toProperty(store.getState)
      .setName('state$');

    let emitting = false;
    let queue: A[] = [];

    (store as any).subscription = Kefir.merge(
      sources.map(source => source(action$, state$))
    ).observe({
      error(err) {
        // eslint-disable-next-line no-console
        console.error('Error emitted into delta', err);
      },
      value(value) {
        if (emitting) {
          queue.push(value);
        } else {
          store.dispatch(value);
        }
      }
    });

    return next => action => {
      const result = next(action);
      const state = store.getState();

      emitting = true;

      (state$ as any)._emitValue(state);
      (action$ as any)._emitValue(result);

      emitting = false;

      if (queue.length) {
        const run = queue;
        queue = [];

        for (const action of run) {
          store.dispatch(action);
        }
      }

      return result;
    };
  };
}
