import $$observable from 'symbol-observable';
import { fromESObservable, pool, stream } from 'kefir';
import { always, curry, identity, pipe, tap } from 'ramda';

/**
 * Create a combined stream & renderer for an array of child components.
 *
 * @param {Object[]} children - Array of child compoent definitions.
 * @param {Element} el - Parent component element.
 * @param {Object} state - Current page state.
 * @returns {stream} Combined child streams.
 * @factory
 */
const Downstreams = function Downstreams(children, el, state) {
    const stream$ = pool();
    const plug = stream$.plug.bind(stream$);

    // Map over the children definitions and turn
    // them into component instances.
    const renderers = children.map(mapChildren);

    const api = Object.create(stream$);

    if (state[$$observable]) {
        const state$ = state[$$observable]();
        const next = tap(update => renderers.forEach(render => render(update)));

        return stream(emitter => {
            const unsub = state$.subscribe({ next });
            api.onValue(emitter.emit);

            return function unsubscribe() {
                unsub();
                api.offValue(emitter.emit);
            };
        }).toESObservable();
    }

    api.render = pipe(
        tap(update => renderers.forEach(render => render(update))),
        always(api)
    );

    return api;

    /**
     * Plugs child into stream and returns child's render function.
     *
     * @param {Object} child - Child stream configuration.
     * @param {Function} child.adapter - Function to modify state before passing to child.
     * @param {Function} child.factory - Child's factory function.
     * @param {string} child.selector - Child's querySelector string.
     * @param {Function} child.preplug - Function to modify stream before being plugged in.
     * @returns {Function} Child's render function.
     */
    function mapChildren({ adapter = identity, factory, selector, preplug = identity }) {
        let element = el;

        if (selector) {
            element = el.querySelector(selector);
        }

        // If no element was found, abort.
        if (!element) {
            // For some weird reason, `identity` on its own isn't getting
            // compiled by webpack correctly. This seems to make it work
            // but it's a hack we should probably get rid of.
            return pipe(identity);
        }

        let instance = factory(element, state[$$observable] ?
            fromESObservable(state).map(adapter).toESObservable() :
            adapter(state));

        // Plug into Downstream's pool
        pipe(preplug, plug)(instance);

        return pipe(adapter, instance.render || identity);
    }
};

export default curry(Downstreams);
