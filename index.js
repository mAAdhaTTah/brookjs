import { curry, identity, pipe } from 'ramda';
import { pool } from 'kefir';

/**
 * Create a new event with the custom type string.
 *
 * This is used for cross-browser consistency, since the IEs
 * still require us to use the deprecated factory functions.
 *
 * @param {string} type - Event type.
 * @returns {Event} Custom dispatchable event.
 */
export function createEvent(type) {
    var event;

    try {
        event = new Event(type, { bubbles: true });
    } catch (e) {
        event = document.createEvent('Event');
        event.initEvent(type, true, false);
    }

    return event;
}

/**
 * Create a combined stream & renderer for an array of child components.
 *
 * @param {Object[]} children - Array of child compoent definitions.
 * @param {Element} el - Parent component element.
 * @param {Object} state - Current page state.
 * @returns {stream} Combined child streams.
 * @factory
 */
export const Downstreams = curry(function Downstreams(children, el, state) {
    const stream = pool();
    const plug = stream.plug.bind(stream);

    // Map over the children definitions and turn
    // them into component instances.
    const renderers = children.map(mapToChildren);

    const api = Object.create(stream);

    api.render = function render(update) {
        renderers.forEach(renderer => renderer(update));

        state = update;

        return api;
    };

    return api;

    /**
     * Plugs child into stream returns child's render function.
     *
     * @param {Object} child - Child stream configuration.
     * @param {Function} child.adapter - Function to modify state before passing to child.
     * @param {Function} child.factory - Child's factory function.
     * @param {string} child.selector - Child's querySelector string.
     * @param {Function} child.preplug - Function to modify stream before being plugged in.
     * @returns {Function} Child's render function.
     */
    function mapToChildren({ adapter = identity, factory, selector, preplug = identity } = {}) {
        let element = el;

        if (selector) {
            element = el.querySelector(selector);
        }

        let instance = factory(element, adapter(state));

        // Plug into Downstream's pool
        pipe(preplug, plug)(instance);

        return pipe(adapter, instance.render);
    }
});
