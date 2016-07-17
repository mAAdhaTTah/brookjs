import { constant, fromESObservable, merge, pool } from 'kefir';

/**
 * Accepts a set of system generator functions and returns a
 * StoreEnhancer, which generates the `systems$` stream and
 * binds it to the store.
 *
 * Functions similar to middleware, but provides a way to respond
 * to events from, and emit events into, the application's central
 * redux store.
 *
 * The system function takes an `actions$` stream and a `state$`
 * stream, and should return a new `system$`, which gets observed by
 * the store. Note that the `actions$` stream will re-emit
 * events emitted from the returned `system$`.
 *
 * @param {...Function} systems - System-generating function.
 * @returns {StoreEnhancer} Enhanced create store function.
 */
export default function enhancer(...systems) {
    return createStore => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);
        const _dispatch = store.dispatch;
        const actions$ = pool();
        const value = action => {
            const result = _dispatch(action);
            actions$.plug(constant(result));
            return result;
        };

        const systems$ = merge(
            systems.map(system =>
                system(actions$, fromESObservable(store))));

        actions$.plug(systems$);

        return Object.assign({}, store, { dispatch: value }, systems$.observe({ value }));
    };
}
