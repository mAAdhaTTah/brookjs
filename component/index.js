import R from 'ramda';
import assert from 'assert';
import { constant, Observable, merge, never } from 'kefir';
import downstreams from './downstreams';
import bindEvents, { DEPRECATED_EVENT_ATTRIBUTE } from '../events';
import renderGenerator from '../render';

let checked = false;

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Function} [config.combinator] - Called with component streams, returns combined stream.
 * @param {Function} [config.events] - `events$` stream generating function.
 * @param {Function} [config.render] - `render$` stream generating function.
 * @param {Function} [config.shouldUpdate] - Whether the component should rerender.
 * @param {Object[]} [config.subcomponents] - Subcomponent declarations.
 * @returns {factory} Component factory function.
 * @factory
 */
export default function component(config) {
    let {
        children = R.always(never()),
        combinator = R.pipe(R.values, merge),
        events = R.always(never()),
        onMount = R.always(never()),
        render = R.curryN(3, () => never()),
        subcomponents,
        shouldUpdate = R.T,
        template } = config;

    // Validate render$ stream generator.
    if (template) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('deprecated: use `render` instead of `template`');
            assert.equal(typeof template, 'function', '`template` should be a function');
        }

        render = renderGenerator(template);
    }

    try {
        assert.equal(typeof render({}), 'function', '`render` should be curried');
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            assert.equal(typeof render, 'function', '`render` should be a function');
            console.warn('deprecated: `render` should be curried');
        }

        render = R.curry(render);
    }

    // Validate events$ stream generator.
    if (typeof events === 'object') {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('deprecated: events should be a function');
        }

        events = bindEvents(events);
    }

    if (process.env.NODE_ENV !== 'production') {
        // Validate combinator
        assert.equal(typeof combinator, 'function', '`combinator` should be a function');

        assert.equal(typeof events, 'function', '`events` should be a function');

        // Validate onMount$ stream generator.
        assert.ok(typeof onMount === 'function', 'onMount should be a function');

        assert.equal(typeof render, 'function', '`render` should be a function');
        assert.equal(render.length, 3, '`render` should take 3 arguments');

        // Validate children$ stream generator.
        if (subcomponents) {
            console.warn('deprecated: replace `subcomponents` with `children` function');
            assert.ok(Array.isArray(subcomponents), '`subcomponents` should be an array');
        }

        assert.ok(children, '`children` should be a function');

        // Validate shouldUpdate filter.
        assert.ok(typeof shouldUpdate === 'function', 'shouldUpdate should be a function');
    }

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} props$ - Observable of component props.
     * @returns {Observable} Component instance.
     */
    return R.curry((el, props$) => {
        if (process.env.NODE_ENV !== 'production') {
            assert.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
            assert.ok(props$ instanceof Observable, '`props$` is not a `Kefir.Observable`');

            if (!checked) {
                const elements = document.querySelectorAll(`[${DEPRECATED_EVENT_ATTRIBUTE}]`);

                if (R.length(elements)) {
                    console.warn('deprecated: elements should use container attribute & hbs helpers', elements);
                }

                checked = true;
            }
        }

        if (!el._hasEl) {
            let warned = false;
            Object.defineProperty(el, 'el', {
                get: function() {
                    if (!warned) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.warn('deprecated: `el` is passed in directly');
                        }

                        warned = true;
                    }

                    return el;
                }
            });

            el._hasEl = true;
        }

        const render$$ = props$
            .slidingWindow(2)
            .map(R.ifElse(
                R.pipe(R.length, R.equals(2)),
                R.identity,
                R.pipe(R.head, R.repeat(R.__, 2))))
            .filter(R.apply(shouldUpdate))
            .map(R.apply(render(el)));

        const render$ = render$$
            .flatMapLatest();

        const events$ = render$$
            .map(render$ => render$
                .ignoreValues()
                .ignoreErrors()
                .beforeEnd(() => events(el)))
            .flatMapLatest()
            .merge(constant(events(el)))
            .flatMapLatest();

        const children$ = children(el, props$);

        let instance$ = combinator({ children$, events$, render$ });

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(instance$ instanceof Observable, '`instance$` is not a `Kefir.Observable`');
        }

        instance$ = instance$
            .merge(onMount(el, props$));

        if (subcomponents) {
            instance$ = instance$.merge(downstreams(subcomponents, el, props$));
        }

        return instance$;
    });
};
