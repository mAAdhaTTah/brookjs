import R, {
    __,
    apply,
    equals,
    head,
    identity,
    ifElse,
    length,
    merge,
    pipe,
    repeat
} from 'ramda';
import assert from 'assert';
import $$observable from 'symbol-observable';
import { constant, fromESObservable } from 'kefir';
import renderGenerator from './render';
import downstreams from './downstreams';
import bindEvents, { DEPRECATED_EVENT_ATTRIBUTE } from './events';

const defaults = {
    events: {},
    shouldUpdate: R.T
};

let checked = false;

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Object} config.events - Events mapping
 * @param {Function} config.render - Render function.
 * @param {Function} config.shouldUpdate - Whether the component should rerender.
 * @param {Object[]} [config.subcomponents] - Subcomponent declarations.
 * @param {Function} [config.template] - String-returning template function.
 * @returns {factory} Component factory function.
 * @factory
 */
export default function component(config) {
    let { events, onMount, render, subcomponents, shouldUpdate, template } = merge(defaults, config);

    if (process.env.NODE_ENV !== 'production') {
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
            assert.ok(typeof state$[$$observable] === 'function', 'state$ is not an Observable');

            if (!checked) {
                const elements = document.querySelectorAll(`[${DEPRECATED_EVENT_ATTRIBUTE}]`);

                if (elements.length) {
                    console.warn('deprecated: elements should use container attribute & hbs helpers', elements);
                }

                checked = true;
            }
        }

        state$ = fromESObservable(state$).toProperty();

        const api = { el };

        let events$ = state$
            .slidingWindow(2)
            .map(ifElse(pipe(length, equals(2)), identity, pipe(head, repeat(__, 2))))
            .filter(apply(shouldUpdate))
            .map(apply(renderGenerator({ api, el, template, render })))
            .map(render$ => render$
                    .ignoreValues()
                    .ignoreErrors()
                    .beforeEnd(() =>
                        bindEvents(events, el))
            )
            .flatMapLatest()
            .merge(constant(bindEvents(events, el)))
            .flatMapLatest();

        if (subcomponents) {
            events$ = events$.merge(downstreams(subcomponents, el, state$));
        }

        if (onMount) {
            events$ = events$.merge(onMount(api, state$));
        }

        return events$;
    };
};
