import { pool } from 'kefir';
import { always, binary, curry, identity, pipe, prop, T, tap } from 'ramda';
import morphdom from 'morphdom';
import Downstreams from './downstreams';
import Events from './events';

const NOT_SUPPORTED_ERROR = 'Components with both subcomponents & events are not yet supported.';

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Object} config.events - Events mapping
 * @param {Function} config.render - Render function.
 * @param {Function} config.shouldUpdate - Whether the component should rerender.
 * @param {Object[]} config.subcomponents - Subcomponent declarations.
 * @param {Function} config.template - String-returning template function.
 * @param {Element} el - Component element.
 * @param {Object|Observable} [state] - Initial component state or observable of state.
 * @returns {stream} Component instance.
 * @factory
 */
const Component = function Component({ events, render = identity, shouldUpdate = T, subcomponents, template }, el, state = {}) {
    let downstreams;

    // We can't yet support both as we can't tell
    // whether a DOM node is from a child or itself.
    if (subcomponents && events) {
        throw new Error(NOT_SUPPORTED_ERROR);
    }

    const stream = pool();

    if (subcomponents) {
        downstreams = Downstreams(subcomponents, el, state);

        stream.plug(downstreams);
    }

    if (events) {
        stream.plug(Events(events, el));
    }

    const api = Object.create(stream);

    Object.defineProperty(api, 'el', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: el
    });

    if (template) {
        if (!state[$$observable]) {
            throw new Error('Needs observable');
        }

        const next = pipe(template, binary(morphdom(el)));
        const state$ = fromESObservable(state)
            .scan(({ prev = {} }, next) => ({ prev, next }), {})
            .filter(shouldUpdate)
            .map(prop('next'))
            .toESObservable();

        const events$ = stream(emitter => {
            const unsub = state$.subscribe({ next });
            api.onValue(emitter.emit);

            return function unsubscribe() {
                unsub();
                api.offValue(emitter.emit);
            };
        }).toESObservable();

        const opts = { el };

        return Object.assign(Object.create(events$), opts);
    }

    /**
     * Updates the components subcomponents & component.
     *
     * @type {Function}
     */
    api.render = pipe(
        tap(downstreams ? downstreams.render : identity),
        tap(update => render(api, state, update)),
        update => state = update,
        always(api)
    );

    return api;
};

export default curry(Component);
