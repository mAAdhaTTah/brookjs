import Kefir from 'kefir';

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
export default function observeDelta(...sources) {
    return store => {
        const action$ = new Kefir.Stream();
        const state$ = new Kefir.Property();
        state$._currentEvent = store.getState();

        let emitting = false;
        let queue = [];

        store.subscription = Kefir.merge(
            sources.map(source => source(action$, state$))
        )
            .flatMapErrors(err => Kefir.stream(emitter => {
                // eslint-disable-next-line no-console
                console.error('Error emitted into delta', err);
                emitter.end();
            }))
            .observe({
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

            state$.plug(Kefir.constant(state));
            action$.plug(Kefir.constant(result));

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
