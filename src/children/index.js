import assert from 'assert';
import R from 'ramda';
import Kefir from '../kefir';
import child from './child';
import { containerAttribute } from '../helpers';
import { $$internals } from '../constants';
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

        for (const container in factories) {
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
    for (const container in factories) {
        let definition = factories[container];

        if (typeof definition === 'function') {
            definition = { factory: definition };
        }

        let createSourceStream = false;

        if (definition.factory[$$internals]) {
            ({ createSourceStream } = definition.factory[$$internals]);
        }

        factories[container] = child(Object.assign({ container, createSourceStream }, definition));
    }

    /**
     * Children stream generator function.
     *
     * @param {HTMLElement} el - Element to query against.
     * @param {Observable} props$ - Stream of props.
     * @return {Observable<T, S>} Children stream.
     * @factory
     */
    return R.curry((el, props$) => {
        const nodeAddedMutationPayload$ = mutations$.filter(isAddedChildNode(el))
            .map(R.prop('payload'));
        const nodeRemovedMutationPayload$ = mutations$.filter(isRemovedChildNode(el))
            .map(R.prop('payload'));
        const createElementRemoved = el => nodeRemovedMutationPayload$
            .filter(({ node }) => node === el);
        const mapToMixinPairs = R.map(([container, factory]) => {
            /**
             * Query all of the children for the configuration key.
             *
             * Filters out children that are under other containers.
             */
            const existingEl$ = Kefir.constant(el.querySelectorAll(`[${containerAttribute(container)}]`))
                .flatten()
                .filter(R.pipe(R.prop('parentNode'), getContainerNode, R.equals(el)));

            /**
             * Stream of added nodes from the MutationObserver.
             *
             * Filters out
             */
            const addedEl$ = nodeAddedMutationPayload$
                .filter(containerMatches(container))
                .map(R.prop('node'));

            const instance$ = Kefir.merge([existingEl$, addedEl$])
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

        return Object.assign(Object.create(Kefir.merge(R.values(mixin))), mixin);
    });
}
