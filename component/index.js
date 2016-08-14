import R, {
    __,
    apply,
    equals,
    head,
    identity,
    ifElse,
    length,
    pipe,
    repeat
} from 'ramda';
import assert from 'assert';
import { constant, Observable, never } from 'kefir';
import downstreams from './downstreams';
import bindEvents, { DEPRECATED_EVENT_ATTRIBUTE } from '../events';

let checked = false;

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Object} config.events - Events mapping
 * @param {Function} config.render - Stream-returning render function.
 * @param {Function} config.shouldUpdate - Whether the component should rerender.
 * @param {Object[]} [config.subcomponents] - Subcomponent declarations.
 * @returns {factory} Component factory function.
 * @factory
 */
export default function component(config) {
    let { events, onMount, render, subcomponents = [], shouldUpdate = R.T } = config;

    if (!render) {
        render = R.curryN(3, R.always(never()));
    }

    if (process.env.NODE_ENV !== 'production') {
        if (onMount) {
            assert.ok(typeof onMount === 'function', 'onMount should be a function');
        }

        if (typeof events === 'object') {
            console.warn('deprecated: events should be a function');
            events = bindEvents(events);
        }

        if (events) {
            assert.equal(typeof events, 'function', '`events` should be a function');
        }

        assert.equal(typeof render, 'function', '`render` should be a function');
        assert.equal(render.length, 3, '`render` should take 3 arguments');
        assert.equal(typeof render({}), 'function', '`render` should be curried');

        assert.ok(Array.isArray(subcomponents), '`subcomponent` should be an array');
        assert.ok(typeof shouldUpdate === 'function', 'shouldUpdate should be a function');
    }

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} state$ - Initial component state or observable of state.
     * @returns {Observable} Component instance.
     */
    return function factory(el, state$) {
        if (process.env.NODE_ENV !== 'production') {
            assert.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
            assert.ok(state$ instanceof Observable, '`instance` is not a `Kefir.Observable`');

            if (!checked) {
                const elements = document.querySelectorAll(`[${DEPRECATED_EVENT_ATTRIBUTE}]`);

                if (elements.length) {
                    console.warn('deprecated: elements should use container attribute & hbs helpers', elements);
                }

                checked = true;
            }
        }

        // BC with destructured impl
        el.el = el;

        let events$ = never();

        if (onMount) {
            events$ = events$.merge(onMount(el, state$));
        }

        state$ = state$
            .slidingWindow(2)
            .map(ifElse(pipe(length, equals(2)), identity, pipe(head, repeat(__, 2))))
            .filter(apply(shouldUpdate));

        let render$$ = state$
            .map(apply(render(el)));

        if (events) {
            render$$ = render$$
                .map(render$ => render$
                    .beforeEnd(() => events(el))
                )
                .flatMapLatest()
                .merge(constant(events(el)))
                .flatMapLatest();
        }

        events$ = events$.merge(render$$);

        if (subcomponents) {
            events$ = events$.merge(downstreams(subcomponents, el, state$));
        }

        return events$;
    };
};
