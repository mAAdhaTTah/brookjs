import { constant, fromESObservable, merge, pool } from 'kefir';

/**
 * Accepts a set of delta generator functions and returns a
 * StoreEnhancer, which generates the `deltas$` stream and
 * binds it to the store.
 *
 * Functions similar to middleware, but provides a way to respond
 * to events from, and emit events into, the application's central
 * redux store.
 *
 * The delta function takes an `actions$` stream and a `state$`
 * stream, and should return a new `delta$`, which gets observed by
 * the store. Note that the `actions$` stream will re-emit
 * events emitted from the returned `system$`.
 *
 * @param {...Function} sources - Source-generating function.
 * @returns {StoreEnhancer} Enhanced create store function.
 */
export default function observeDelta(...sources) {
    return createStore => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);
        const value = store.dispatch;
        const actions$ = pool();
        const dispatch = action => {
            const result = value(action);
            actions$.plug(constant(result));
            return result;
        };

        const sources$ = merge(
            sources.map(source =>
                source(actions$, fromESObservable(store))));

        actions$.plug(sources$);

        return Object.assign(sources$.observe({ value }), store, { dispatch });
    };
}
