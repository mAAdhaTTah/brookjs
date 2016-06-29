import { fromESObservable, pool, stream } from 'kefir';
import { always, apply, curry, curryN, identity, last, once, pipe, prop, T, tap } from 'ramda';
import morphdom from 'morphdom';
import Downstreams from './downstreams';
import Events from './events';

const NOT_SUPPORTED_ERROR = 'Components with both subcomponents & events are not yet supported.';

const updateDOM = curryN(2, morphdom);

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
const Component = function Component({ events, onMount = identity, render = identity, shouldUpdate = T, subcomponents, template }, el, state$) {
    let downstreams;

    // We can't yet support both as we can't tell
    // whether a DOM node is from a child or itself.
    if (subcomponents && events) {
        throw new Error(NOT_SUPPORTED_ERROR);
    }

    const stream$ = pool();

    if (subcomponents) {
        downstreams = Downstreams(subcomponents, el, state$);

        stream$.plug(downstreams);
    }

    if (events) {
        stream$.plug(Events(events, el));
    }

    const api = Object.create(stream$);

    Object.defineProperty(api, 'el', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: el
    });

    state$ = fromESObservable(state$)
        .scan(([,prev], next) => ([prev || next, next]), [])
        .skip(1)
        .filter(apply(shouldUpdate));
    template = template ? pipe(template, updateDOM(el)) : identity;

    const events$ = stream(emitter => {
        let mounted = false;
        state$.onValue(function([prev, next]) {
            if (!mounted) {
                onMount(api, next);
                mounted = true;
            }
            render(api, prev || next, next);
        });

        const latest$ = state$.map(last);
        latest$.onValue(template);

        api.onValue(emitter.emit);

        return function unsubscribe() {
            state$.offValue(onMount);
            state$.offValue(render);
            latest$.offValue(template);
            api.offValue(emitter.emit);
        };
    }).toESObservable();

    const opts = { el };

    return Object.assign(Object.create(events$), opts);
};

export default curry(Component);
