import R from 'ramda';
import assert from 'assert';
import { Observable, merge, never } from 'kefir';

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Object} config - Component configuration.
 * @param {Function} [config.combinator] - Called with component streams, returns combined stream.
 * @param {Function} [config.events] - `events$` stream generating function.
 * @param {Function} [config.render] - `render$` stream generating function.
 * @param {Function} [config.shouldUpdate] - Whether the component should rerender.
 * @returns {factory} Component factory function.
 * @factory
 */
export default function component(config) {
    let {
        children = R.always(never()),
        combinator = R.pipe(R.values, merge),
        events = R.always(never()),
        onMount = R.always(never()),
        render = R.curryN(2, R.always(never())),
        shouldUpdate = R.T } = config;

    if (process.env.NODE_ENV !== 'production') {
        // Validate combinator
        assert.equal(typeof combinator, 'function', '`combinator` should be a function');

        // Validate events function.
        assert.equal(typeof events, 'function', '`events` should be a function');

        // Validate onMount$ stream generator.
        assert.equal(typeof onMount, 'function', 'onMount should be a function');

        // Validate render function.
        assert.equal(typeof render, 'function', '`render` should be a function');
        assert.equal(typeof render({}), 'function', '`render` should be curried');
        assert.equal(render.length, 2, '`render` should take 2 arguments');

        // Validate children$ stream generator.
        assert.equal(typeof children, 'function', '`children` should be a function');

        // Validate shouldUpdate filter.
        assert.equal(typeof shouldUpdate, 'function', 'shouldUpdate should be a function');
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
        }

        const children$ = children(el, props$);
        const events$ = events(el);
        const render$ = render(el, props$
            .slidingWindow(2)
            .map(R.ifElse(
                R.pipe(R.length, R.equals(2)),
                R.identity,
                R.pipe(R.head, R.repeat(R.__, 2))))
            .filter(R.apply(shouldUpdate))
            .map(R.last));
        const onMount$ = onMount(el, props$);

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(children$ instanceof Observable, '`children$` is not a `Kefir.Observable`');
            assert.ok(events$ instanceof Observable, '`events$` is not a `Kefir.Observable`');
            assert.ok(render$ instanceof Observable, '`render$` is not a `Kefir.Observable`');
            assert.ok(onMount$ instanceof Observable, '`onMount$` is not a `Kefir.Observable`');
        }

        const instance$ = combinator({ children$, events$, render$, onMount$ });

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(instance$ instanceof Observable, '`instance$` is not a `Kefir.Observable`');
        }

        return instance$;
    });
};
