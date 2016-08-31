import assert from 'assert';
import R from 'ramda';
import { containerAttribute } from '../helpers';
import { constant, merge, pool } from 'kefir';
import { defaults, createInstance, getContainerNode, getInstanceForElement, keyMatches, isAddedChildNode, isRemovedChildNode } from './util';
import mutations$ from './mutations';

/**
 * Generates a function to create new children streams.
 *
 * @param {Object} config - Children configuration.
 * @returns {Function} Curried children stream generator.
 */
export default function children(config) {
    if (process.env.NODE_ENV !== 'production') {
        assert.equal(typeof config, 'object', '`config` should be an object');

        for (let key in config) {
            if (!config.hasOwnProperty(key)) {
                continue;
            }

            assert.ok(typeof config[key] === 'function' || typeof config[key] === 'object', `${key} should be a function or object`);
        }
    }

    /**
     * Normalize the configuration.
     *
     * This ensures that the developer can pass in a straight function
     * or a configuration object and the children$ stream will work
     * the same both ways.
     */
    for (let key in config) {
        if (typeof config[key] === 'function') {
            config[key] = R.merge(defaults(key), { factory: config[key] });
        } else {
            config[key] = R.merge(defaults(key), config[key]);
        }

        if (process.env.NODE_ENV !== 'production') {
            let { factory, modifyChildProps, preplug } = config[key];

            assert.equal(typeof factory, 'function', `factory for ${key} should be a function`);
            assert.equal(typeof modifyChildProps, 'function', `modifyChildProps for ${key} should be a function`);
            assert.equal(typeof preplug, 'function', `preplug for ${key} should be a function`);
        }

        config[key] = createInstance(config[key]);
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

        /**
         * Bind createInstance functions with props$ stream.
         */
        let boundConfig = R.map(createInstance => createInstance(props$), config);

        /**
         * Mixin object holds the pool stream for each key.
         *
         * Allows us to plug/unplug from each stream as
         * nodes are added and removed from the DOM.
         */
        const mixin = R.fromPairs(R.toPairs(boundConfig).map(([key, createInstanceWithProps]) => {
            let pool$ = pool();

            /**
             * Query all of the children for the configuration key.
             *
             * Filters out children that are under other containers.
             */
            const els$ = constant(Array.from(element.querySelectorAll(`[${containerAttribute(key)}]`)))
                .flatten()
                .filter(R.pipe(R.prop('parentNode'), getContainerNode, R.equals(element)))
                .map(createInstanceWithProps)
                .scan((source$, instance$) => source$.plug(instance$), pool$)
                .ignoreValues();

            const added$ = nodeAddedMutationPayload$
                .filter(keyMatches(key))
                .scan((source$, { node }) => source$.plug(createInstanceWithProps(node)), pool$)
                .ignoreValues();

            const removed$ = nodeRemovedMutationPayload$
                .filter(keyMatches(key))
                .scan((source$, { node }) => source$.unplug(getInstanceForElement(node)), pool$)
                .ignoreValues();

            return [key, merge([pool$, els$, added$, removed$])];
        }));

        return Object.assign(Object.create(merge(R.values(mixin))), mixin);
    });
}
