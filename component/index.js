import {
    __,
    always,
    apply,
    curry,
    equals,
    head,
    identity,
    ifElse,
    last,
    length,
    merge,
    once,
    pipe,
    prop,
    repeat,
    T,
    tap
} from 'ramda';
import assert from 'assert';
import $$observable from 'symbol-observable';
import { constant, fromESObservable, never, stream } from 'kefir';
import morphdom from 'morphdom';
import downstreams from './downstreams';
import bindEvents from './events/index';

const defaults = {
    events: {},
    shouldUpdate: T
};

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Object} config.events - Events mapping
 * @param {Function} config.render - Render function.
 * @param {Function} config.shouldUpdate - Whether the component should rerender.
 * @param {Object[]} [config.subcomponents] - Subcomponent declarations.
 * @param {Function} [config.template] - String-returning template function.
 * @factory
 */
export default function component(config) {
    let { events, onMount, render, subcomponents, shouldUpdate, template } = merge(defaults, config);

    assert.ok(typeof events === 'object', 'events is not an object');

    for (let key in events) {
        if (events.hasOwnProperty(key)) {
            assert.ok(typeof events[key] === 'function', `events[${key}] is not a function`);
        }
    }

    if (onMount) {
        assert.ok(typeof onMount === 'function', 'onMount should be a function');
    }

    assert.ok(typeof shouldUpdate === 'function', 'shouldUpdate should be a function');

    if (template) {
        assert.ok(typeof template === 'function', 'template should be a function');
    }

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} state$ - Initial component state or observable of state.
     * @returns {Observable} Component instance.
     */
    return function factory(el, state$) {
        assert.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
        assert.ok(typeof state$[$$observable] === 'function', 'state$ is not an Observable');

        state$ = fromESObservable(state$).toProperty();

        const api = { el };

        let events$ = state$
            .slidingWindow(2)
            .map(ifElse(pipe(length, equals(2)), identity, pipe(head, repeat(__, 2))))
            .filter(apply(shouldUpdate))
            .map(apply(Render))
            .withHandler(makeEventSwapper(events, el))
            .merge(constant(bindEvents(events, el)))
            .flatMapLatest();

        if (subcomponents) {
            events$ = events$.merge(downstreams(subcomponents, el, state$));
        }

        if (onMount) {
            events$ = events$.merge(onMount(api, state$));
        }

        return events$;

        function Render(prev, next) {
            let render$ = never();

            if (template) {
                render$ = render$.concat(stream(emitter => {
                    const loop = requestAnimationFrame(() => {
                        morphdom(el, template(next));

                        emitter.end();
                    });

                    return () => cancelAnimationFrame(loop);
                }));
            }

            if (render) {
                const r$ = render(api, prev, next) || {};

                // @todo add assert.ok
                if (r$[$$observable]) {
                    render$ = render$.concat(fromESObservable(r$));
                } else {
                    console.log('deprecated: `render` should return an Observable', el.className);
                }
            }

            return render$;
        }
    };
};

function makeEventSwapper(events, el) {
    let sub = { closed: true };
    let bind = () => bindEvents(events, el);

    return (emitter, event) => {
        if (event.type === 'value') {
            if (!sub.closed) {
                sub.unsubscribe();
            }

            const end = pipe(bind, emitter.value);
            sub = event.value.observe({ end });
        }
    };
}
