import assert from 'assert';
import R from 'ramda';
import Kefir from '../kefir';
import { $$internals, $$meta } from './constants';

export { default as children } from './children';
export { default as events } from './events';
export { default as render, renderFromHTML } from './render';
export { containerAttribute, blackboxAttribute,
    keyAttribute, eventAttribute, mapActionTo } from './helpers';
export { raf$ } from './rAF';

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
export function component({
    children = R.always(Kefir.never()),
    combinator = R.pipe(R.values, Kefir.merge),
    events = R.always(Kefir.never()),
    onMount = R.always(Kefir.never()),
    render = R.curryN(2, R.always(Kefir.never()))
}) {
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
    }

    const { modifyEffect$$ = R.identity } = (render[$$internals] || {});

    const internals = {

        /**
         * Creates a new source stream from the provided element and props stream.
         * A source stream emits the actions from the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @param {Observable<Observable<Eff>>} effect$$ - Stream of Observables of Effects.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createSourceStream(el, props$, effect$$) {
            const onMount$ = onMount(el, props$);
            const events$ = events(el);
            const children$ = children(el, props$, effect$$);

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(children$ instanceof Kefir.Observable, '`children$` is not a `Kefir.Observable`');
                assert.ok(events$ instanceof Kefir.Observable, '`events$` is not a `Kefir.Observable`');
                assert.ok(onMount$ instanceof Kefir.Observable, '`onMount$` is not a `Kefir.Observable`');
            }

            const source$ = combinator(
                Object.assign(
                    Object.create(Kefir.merge([onMount$, events$, children$])),
                    { onMount$, events$, children$ }
                )
            );

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(source$ instanceof Kefir.Observable, '`source$` is not a `Kefir.Observable`');
            }

            effect$$ = effect$$.thru(modifyEffect$$);

            const instance$ = Kefir.merge([
                effect$$.bufferWhile(effect$ => effect$[$$meta].type !== 'END')
                    .flatMap(effects$ => Kefir.merge(effects$)),
                source$
            ]);

            instance$[$$internals] = { effect$$ };

            return instance$;
        },

        /**
         * Creates a new sink stream from the provided element and props stream.
         * A sink stream performs side effects on the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createEffectsStream(el, props$) {
            const effect$$ = render(el, props$);

            if (process.env.NODE_ENV !== 'production') {
                assert.ok(effect$$ instanceof Kefir.Observable, '`effect$$` is not a `Kefir.Observable`');
            }

            return effect$$;
        }
    };

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} props$ - Observable of component props.
     * @returns {Observable} Component instance.
     */
    const factory = R.curry((el, props$) => {
        if (process.env.NODE_ENV !== 'production') {
            assert.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
            assert.ok(props$ instanceof Kefir.Observable, '`props$` is not a `Kefir.Observable`');
        }

        return internals.createSourceStream(
            el,
            props$,
            internals.createEffectsStream(el, props$)
        );
    });

    factory[$$internals] = internals;

    return factory;
}
