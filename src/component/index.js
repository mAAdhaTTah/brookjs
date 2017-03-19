import R from 'ramda';
import assert from 'assert';
import { Observable, merge, never } from 'kefir';
import { $$internals } from '../constants';

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
        assert.ok(typeof onMount === 'function', 'onMount should be a function');

        // Validate render function.
        assert.equal(typeof render, 'function', '`render` should be a function');
        assert.equal(typeof render({}), 'function', '`render` should be curried');
        assert.equal(render.length, 2, '`render` should take 2 arguments');

        // Validate children$ stream generator.
        assert.ok(children, '`children` should be a function');

        // Validate shouldUpdate filter.
        assert.ok(typeof shouldUpdate === 'function', 'shouldUpdate should be a function');
    }

    const internals = {

        /**
         * Creates a new source stream from the provided element and props stream.
         * A source stream emits the actions from the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createSourceStream(el, props$) {
            const onMount$ = onMount(el, props$);
            const events$ = events(el);
            const children$ = children(el, props$);

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(children$ instanceof Observable, '`children$` is not a `Kefir.Observable`');
                assert.ok(events$ instanceof Observable, '`events$` is not a `Kefir.Observable`');
                assert.ok(onMount$ instanceof Observable, '`onMount$` is not a `Kefir.Observable`');
            }

            const source$ = combinator({ onMount$, events$, children$ });

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(source$ instanceof Observable, '`source$` is not a `Kefir.Observable`');
            }

            return source$;
        },

        /**
         * Creates a new sink stream from the provided element and props stream.
         * A sink stream performs side effects on the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createSinkStream(el, props$) {
            const sink$ = render(el, props$);

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(sink$ instanceof Observable, '`sink$` is not a `Kefir.Observable`');
            }

            return sink$;
        }
    };

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} props$ - Observable of component props.
     * @returns {Observable} Component instance.
     */
    const componentFactory = R.curry((el, props$) => {
        if (process.env.NODE_ENV !== 'production') {
            assert.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
            assert.ok(props$ instanceof Observable, '`props$` is not a `Kefir.Observable`');
        }

        return merge([
            internals.createSinkStream(el, props$),
            internals.createSourceStream(el, props$)
        ]);
    });

    componentFactory[$$internals] = internals;

    return componentFactory;
};
