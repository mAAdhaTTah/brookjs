import assert from 'assert';
import R from 'ramda';
import { merge, never, pool } from 'kefir';
import { NODE_ADDED, NODE_REMOVED } from './actions';
import mutations$ from './mutations';

const sources = new WeakMap();

const defaults = key => ({
    modifyChildProps: R.map(R.prop(key)),
    preplug: R.identity
});

let createInstance = R.curry((props$, { factory, modifyChildProps, preplug }, element) => {
    let instance$ = preplug(factory(element, modifyChildProps(props$)));
    sources.set(element, instance$);
    return instance$;
});

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
        /**
         * Set up utility functions.
         *
         * These functions are reused a few times, so we can
         * bind up the provided properties into functions so
         * we don't have to worry about them parameters later.
         */
        let createInstanceWithProps = createInstance(props$);
        let isChildNode = R.converge(R.or, [
            R.pipe(R.path(['payload', 'parent']), R.equals(el)),
            R.pipe(R.path(['payload', 'target']), R.equals(el)),
        ]);
        let isAddedChildNode = R.converge(R.and, [
            isChildNode,
            R.pipe(R.prop('type'), R.equals(NODE_ADDED))
        ]);
        let isRemovedChildNode = R.converge(R.and, [
            isChildNode,
            R.pipe(R.prop('type'), R.equals(NODE_REMOVED))
        ]);

        /**
         * Mixin object holds the pool stream for each key.
         *
         * Allows us to plug/unplug from each stream as
         * nodes are added and removed from the DOM.
         */
        let mixin = {};

        /**
         * Transform the configuration into an array of
         * streams, setting each key into the mixin object
         * to extend into the returned stream.
         *
         * @type {Array}
         */
        const streams = Object.keys(config).map(key => {
            let component$ = mixin[key] = pool();

            /**
             * Query all of the children for the configuration key.
             *
             * Filters out children that are under other containers.
             *
             * @todo use common container attribute
             */
            Array.from(el.querySelectorAll(`[data-brk-container="${key}"]`))
                .map(createInstanceWithProps(config[key]))
                .forEach(component$.plug.bind(component$));

            return component$;
        });

        streams.push(mutations$.filter(isAddedChildNode)
            .map(R.prop('payload'))
            .filter(({ key, node })=> {
                // We're going to side effect here
                // by updating the already-created
                // streams with the stream for the
                // new node.
                let component = config[key];

                if (component) {
                    mixin[key].plug(createInstanceWithProps(component, node));
                }

                // Returning false ensures no actions
                // are propagated down the stream.
                return false;
            })
        );

        streams.push(mutations$.filter(isRemovedChildNode)
            .map(R.prop('payload'))
            .filter(({ key, node })=> {
                // Side-effect. See above.
                let instance$ = sources.get(node);
                let components$ = mixin[key];

                if (instance$ && components$) {
                    components$.unplug(instance$);
                }

                return false;
            })
        );

        return Object.assign(Object.create(merge(streams)), mixin);
    });
}
