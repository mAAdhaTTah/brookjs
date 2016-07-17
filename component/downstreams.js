import $$observable from 'symbol-observable';
import { fromESObservable, never, pool, stream } from 'kefir';
import { always, curry, identity, pipe, tap } from 'ramda';

/**
 * Create a combined stream & renderer for an array of child components.
 *
 * @param {Object[]} children - Array of child compoent definitions.
 * @param {Element} el - Parent component element.
 * @param {Observable} state$ - Current page state.
 * @returns {stream} Combined child streams.
 * @factory
 */
const Downstreams = function Downstreams(children, el, state$) {
    const events$ = pool();
    const plug = events$.plug.bind(events$);
    const unplug = events$.unplug.bind(events$);

    return stream(emitter => {
        // Map over the children definitions and turn
        // them into component instances.
        const instances = children.map(mapChildren);
        instances.forEach(plug);

        events$.onValue(emitter.value);

        return function unsubscribe() {
            events$.offValue(emitter.value);
            instances.forEach(unplug);
        };
    });

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
            return never();
        }

        let instance = preplug(factory(element, state$.map(adapter)));

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(instance instanceof Observable, '`instance` is not a `Kefir.Observable`');
        }

        return instance;
    }
};

export default curry(Downstreams);
