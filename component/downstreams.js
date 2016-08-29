import assert from 'assert';
import { merge, never, Observable } from 'kefir';
import R from 'ramda';

/**
 * Create a combined stream & renderer for an array of child components.
 *
 * @param {Object[]} children - Array of child component definitions.
 * @param {Element} el - Parent component element.
 * @param {Observable} state$ - Current page state.
 * @returns {stream} Combined child streams.
 * @factory
 */
export default function downstreams(children, el, state$) {
    if (process.env.NODE_ENV !== 'production') {
        assert.ok(state$ instanceof Observable, '`state$` is not a `Kefir.Observable`');
    }

    return merge(R.map(mapChildren, children));

    /**
     * Plugs child into stream and returns child's render function.
     *
     * @param {Object} child - Child stream configuration.
     * @param {Function} child.adapter - Function to modify state before passing to child.
     * @param {Function} child.factory - Child's factory function.
     * @param {string} child.selector - Child's querySelector string.
     * @param {Function} child.preplug - Function to modify stream before being plugged in.
     * @returns {Observable} Child instance.
     */
    function mapChildren({ adapter = R.identity, factory, selector, preplug = R.identity }) {
        let element = el;

        if (selector) {
            element = el.querySelector(selector);
        }

        // If no element was found, abort.
        if (!element) {
            return never();
        }

        let instance$ = preplug(factory(element, state$.map(adapter)));

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(instance$ instanceof Observable, '`preplug` did not return a `Kefir.Observable`');
        }

        return instance$;
    }
};
