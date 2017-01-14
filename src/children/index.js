import assert from 'assert';
import R from 'ramda';
import { constant, merge } from 'kefir';
import child from './child';
import { containerAttribute } from '../helpers';
import { getContainerNode, containerMatches, isAddedChildNode, isRemovedChildNode
} from './util';
import mutations$ from './mutations';

/**
 * Generates a function to create new children streams.
 *
 * @param {Object} factories - Children configuration.
 * @returns {Function} Curried children stream generator.
 */
export default function children(factories) {
    if (process.env.NODE_ENV !== 'production') {
        assert.equal(typeof factories, 'object', '`factories` should be an object');

        for (let container in factories) {
            if (!factories.hasOwnProperty(container)) {
                continue;
            }

            assert.ok(typeof factories[container] === 'function' || typeof factories[container] === 'object', `${container} should be a function or object`);
        }
    }

    /**
     * Normalize the factories.
     *
     * This ensures that the developer can pass in a straight function
     * or a configuration object and the children$ stream will work
     * the same both ways.
     */
    for (let container in factories) {
        let definition = factories[container];

        if (typeof definition === 'function') {
            definition = { factory: child };
        }

        factories[container] = child(R.merge({ container }, definition));
    }

    /**
     * Children stream generator function.
     *
     * @param {HTMLElement} el - Element to query against.
     * @param {Observable} props$ - Stream of props.
     * @return {Observable<T, S>} Children stream.
     * @factory
     */
    return R.curry((element, props$) => {
        const nodeAddedMutationPayload$ = mutations$.filter(isAddedChildNode(element))
            .map(R.prop('payload'));
        const nodeRemovedMutationPayload$ = mutations$.filter(isRemovedChildNode(element))
            .map(R.prop('payload'));
        const createElementRemoved = el => nodeRemovedMutationPayload$
            .filter(({ node }) => node === el);
        const mapToMixinPairs = R.map(([container, factory]) => {
            /**
             * Query all of the children for the configuration key.
             *
             * Filters out children that are under other containers.
             */
            const existingEl$ = constant(element.querySelectorAll(`[${containerAttribute(container)}]`))
                .flatten()
                .filter(R.pipe(R.prop('parentNode'), getContainerNode, R.equals(element)));

            /**
             * Stream of added nodes from the MutationObserver.
             *
             * Filters out
             */
            const addedEl$ = nodeAddedMutationPayload$
                .filter(containerMatches(container))
                .map(R.prop('node'));

            const instance$ = merge([existingEl$, addedEl$])
                .flatMap(el => factory(el, props$)
                    .takeUntilBy(createElementRemoved(el)));

            return [container, instance$];
        });
        const mapFactoriesToMixin = R.pipe(R.toPairs, mapToMixinPairs, R.fromPairs);

        /**
         * Mixin object holds the pool stream for each key.
         *
         * Allows us to plug/unplug from each stream as
         * nodes are added and removed from the DOM.
         */
        const mixin = mapFactoriesToMixin(factories);

        return Object.assign(Object.create(merge(R.values(mixin))), mixin);
    });
}
