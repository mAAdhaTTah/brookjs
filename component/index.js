import R from 'ramda';
import assert from 'assert';
import { constant, Observable, merge, never } from 'kefir';

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
        render = R.curryN(3, R.always(never())),
        shouldUpdate = R.T } = config;

    if (process.env.NODE_ENV !== 'production') {
        // Validate combinator
        assert.equal(typeof combinator, 'function', '`combinator` should be a function');

        // Validate events function.
        assert.equal(typeof events, 'function', '`events` should be a function');

        // Validate onMount$ stream generator.
        assert.ok(typeof onMount === 'function', 'onMount should be a function');

        // Validate render function.
        assert.equal(typeof render, 'function', '`render` should be a function');
        assert.equal(typeof render({}), 'function', '`render` should be curried');
        assert.equal(render.length, 3, '`render` should take 3 arguments');

        // Validate children$ stream generator.
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

        const onMount$ = onMount(el, props$);

        let instance$ = combinator({ children$, events$, render$, onMount$ });

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(instance$ instanceof Observable, '`instance$` is not a `Kefir.Observable`');
        }

        return instance$;
    });
};
