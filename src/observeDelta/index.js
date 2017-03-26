import { constant, merge, pool, stream } from 'kefir';

/**
 * Accepts a set of delta generator functions and returns a
 * Middlware function, which generates the `deltas$` stream
 * and binds it to the store.
 *
 * Provides an Observable-based way to respond to events from,
 * and emit events into, the application's central redux store.
 *
 * The delta function takes an `actions$` stream and a `state$`
 * stream, and should return a new `delta$` stream, which gets
 * observed by the store. Note that the `actions$` stream will
 * re-emit events emitted from the returned `delta$` stream.
 *
 * Exposes the returned subscription, allowing
 *
 * @param {...Function} sources - Source-generating function.
 * @returns {Middleware} Enhanced create store function.
 */
export default function observeDelta(...sources) {
    const actions$ = pool();
    const state$ = pool();

    /**
     * Filter the actions$ stream to just emit actions of
     * the provided types.
     *
     * @param {Array<string>} types - Action types to filter.
     * @returns {Observable<Action>} Stream of filtered actions.
     */
    actions$.ofType = function ofType(...types) {
        return this.filter(action => {
            const type = action.type;
            const len = types.length;

            if (len === 1) {
                return type === types[0];
            } else {
                for (let i = 0; i < len; i++) {
                    if (types[i] === type) {
                        return true;
                    }
                }
            }
            return false;
        });
    };

    return store => {
        store.subscription = merge(sources.map(source => source(actions$, state$.toProperty(store.getState))))
            .flatMapErrors(err => stream(emitter => {
                console.error('Error emitted into delta', err);
                emitter.end();
            }))
            .observe({ value: store.dispatch });

        return next => action => {
            const result = next(action);
            const state = store.getState();

            state$.plug(constant(state));
            actions$.plug(constant(result));

            return result;
        };
    };
}
