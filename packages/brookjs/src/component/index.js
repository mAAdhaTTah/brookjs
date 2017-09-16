import R from 'ramda';
import assert from 'assert';
import Kefir from '../kefir';
import { $$internals } from '../constants';

/**
 * Create a new Component with the provided configuration.
 *
 * @param {Function} children - `children$` generating function.
 * @param {Function} combinator - Called with component streams, returns combined stream.
 * @param {Function} events - `events$` stream generating function.
 * @param {Function} onMount - `onMount$` stream generating function.
 * @param {Function} render - `render$` stream generating function.
 * @returns {factory} Component factory function.
 * @factory
 */
export default function component({
    children = R.always(Kefir.never()),
    combinator = R.pipe(R.values, Kefir.merge),
    events = R.always(Kefir.never()),
    onMount = R.always(Kefir.never()),
    render = false
}) {
    if (process.env.NODE_ENV !== 'production') {
        // Validate combinator
        assert.equal(typeof combinator, 'function', '`combinator` should be a function');

        // Validate events function.
        assert.equal(typeof events, 'function', '`events` should be a function');

        // Validate onMount$ stream generator.
        assert.equal(typeof onMount, 'function', 'onMount should be a function');

        // Validate render function.
        if (render !== false) {
            assert.equal(typeof render, 'function', '`render` should be a function');
            assert.equal(typeof render({}), 'function', '`render` should be curried');
            assert.equal(render.length, 2, '`render` should take 2 arguments');
        }

        // Validate children$ stream generator.
        assert.equal(typeof children, 'function', '`children` should be a function');
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
            const children$ = children(el, props$, { useFactory: !render });

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(children$ instanceof Kefir.Observable, '`children$` is not a `Kefir.Observable`');
                assert.ok(events$ instanceof Kefir.Observable, '`events$` is not a `Kefir.Observable`');
                assert.ok(onMount$ instanceof Kefir.Observable, '`onMount$` is not a `Kefir.Observable`');
            }

            const source$ = combinator({ onMount$, events$, children$ });

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(source$ instanceof Kefir.Observable, '`source$` is not a `Kefir.Observable`');
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
            if (render === false) {
                return Kefir.never();
            }

            const sink$ = render(el, props$);

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(sink$ instanceof Kefir.Observable, '`sink$` is not a `Kefir.Observable`');
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
            assert.ok(props$ instanceof Kefir.Observable, '`props$` is not a `Kefir.Observable`');
        }

        return Kefir.merge([
            internals.createSinkStream(el, props$),
            internals.createSourceStream(el, props$)
        ]);
    });

    componentFactory[$$internals] = internals;

    return componentFactory;
};
