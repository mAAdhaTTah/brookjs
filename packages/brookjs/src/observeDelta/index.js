import Kefir from 'kefir';

/**
 * Accepts a varying number of types, and returns a function that
 * takes an Observable of actions and filters them based on the
 * types provided. Reads `action.type` to match.
 *
 * Intended to be used with Kefir's `thru` method.
 *
 * @param {string[]} types - Action types to filter by
 * @returns {function(*=): (*|this)} Observable filtering function.
 */
export function ofType(...types) {
    return obs$ => obs$.filter(action => {
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
    })
        .setName(obs$, 'ofType');
}

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
 * Exposes the returned subscription, allowing other middleware
 * to terminate the delta.
 *
 * @param {...Function} sources - Source-generating function.
 * @returns {Middleware} Enhanced create store function.
 */
export function observeDelta(...sources) {
    return store => {
        const actions$ = Kefir.pool();
        const state$ = Kefir.pool();

        store.subscription = Kefir.merge(sources.map(source => source(actions$, state$.toProperty(store.getState))))
            .flatMapErrors(err => Kefir.stream(emitter => {
                console.error('Error emitted into delta', err); // eslint-disable-line no-console
                emitter.end();
            }))
            .observe({ value: store.dispatch });

        return next => action => {
            const result = next(action);
            const state = store.getState();

            state$.plug(Kefir.constant(state));
            actions$.plug(Kefir.constant(result));

            return result;
        };
    };
}
