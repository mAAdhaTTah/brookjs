import { pool } from 'kefir';
import { always, curry, identity, pipe, tap } from 'ramda';
import Downstreams from './downstreams';
import Events from './events';

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Object} config.events - Events mapping
 * @param {Function} config.render - Render function.
 * @param {Object[]} config.subcomponents - Subcomponent declarations.
 * @param {Element} el - Component element.
 * @param {Object} [state] - Initial component state.
 * @returns {stream} Component instance.
 * @factory
 */
const Component = function Component({ events, render = identity, subcomponents }, el, state = {}) {
    let downstreams, dom;

    const stream = pool();

    if (subcomponents) {
        downstreams = Downstreams(subcomponents, el, state);

        stream.plug(downstreams);
    }

    if (events) {
        dom = Events(events, el);

        stream.plug(dom);
    }

    const api = Object.create(stream);

    /**
     * Updates the components subcomponents & component.
     *
     * @type {Function}
     */
    api.render = pipe(
        tap(downstreams ? downstreams.render : identity),
        tap(update => render(el, state, update)),
        update => state = update,
        always(api)
    );

    return api;
};

export default curry(Component);
