import assert from 'assert';
import R from 'ramda';
import Kefir from '../../kefir';
import { CONTAINER_ATTRIBUTE, $$meta } from '../constants';
import { containerAttribute, getContainerNode } from '../helpers';
import child from './child';

/**
 * Generates a function to create new children streams.
 *
 * @param {Object} factories - Children configuration.
 * @returns {Function} Curried children stream generator.
 */
export default function children (factories) {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('brookjs#children has been deprecated. Please migrate to brookjs-silt (React-based components).');
        assert.equal(typeof factories, 'object', '`factories` should be an object');

        for (const container in factories) {
            if (!factories.hasOwnProperty(container)) {
                continue;
            }

            assert.ok(
                typeof factories[container] === 'function' ||
                    typeof factories[container] === 'object',
                `${container} should be a function or object`
            );
        }
    }

    /**
     * Normalize the factories.
     *
     * This ensures that the developer can pass in a straight function
     * or a configuration object and the children$ stream will work
     * the same both ways.
     */
    for (const container in factories) {
        let definition = factories[container];

        if (typeof definition === 'function') {
            definition = { factory: definition };
        }

        factories[container] = child(Object.assign({ container }, definition));
    }

    /**
     * Children stream generator function.
     *
     * @param {HTMLElement} el - Element to query against.
     * @param {Observable} props$ - Stream of props.
     * @param {Observable} effect$$ - Stream of effect$.
     * @returns {Observable<T, S>} Children stream.
     * @factory
     */
    return (el, props$, effect$$) => {
        const mapPairsToInstance$$ = R.map(([container, factory]) => {
            const existingEl$ = Kefir.constant(
                el.querySelectorAll(`[${containerAttribute(container)}]`)
            );

            /**
             * Stream of added nodes from the rendering pipeline.
             */
            const addedEl$ = effect$$.map(effect$ => {
                const { incoming } = effect$[$$meta];

                if (!incoming || !incoming.querySelectorAll) {
                    return [];
                }

                if (incoming.getAttribute &&
                    incoming.getAttribute(CONTAINER_ATTRIBUTE) === container) {
                    return [incoming];
                }

                return incoming.querySelectorAll(`[${containerAttribute(container)}]`);
            });

            return Kefir.merge([existingEl$, addedEl$]).flatten().filter(R.pipe(
                R.prop('parentNode'),
                getContainerNode,
                R.converge(R.or, [R.equals(null), R.equals(el)])
            )).map(el => {
                const remove$ = effect$$.filter(effect$ =>
                    effect$[$$meta].outgoing === el);

                const { source$, eff$$, children$ } = factory(el, props$, effect$$);

                return {
                    source$: source$.takeUntilBy(remove$),
                    eff$$: eff$$.takeUntilBy(remove$),
                    children$: children$.takeUntilBy(remove$)
                };
            });
        });

        return R.pipe(R.toPairs, mapPairsToInstance$$, Kefir.merge)(factories);
    };
}
