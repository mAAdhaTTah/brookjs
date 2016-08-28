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

    for (let key in config) {
        if (typeof config[key] === 'function') {
            config[key] = R.merge(defaults(key), { factory: config[key] });
        } else {
            config[key] = R.merge(defaults(key), config[key]);
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
        let mixin = {};

        const streams = Object.keys(config).map(key => {
            let component = config[key];

            let { factory, modifyChildProps, preplug } = component;

            if (process.env.NODE_ENV !== 'production') {
                assert.equal(typeof factory, 'function', `factory for ${key} should be a function`);
                assert.equal(typeof modifyChildProps, 'function', `modifyChildProps for ${key} should be a function`);
                assert.equal(typeof preplug, 'function', `preplug for ${key} should be a function`);
            }

            let component$ = mixin[key] = pool();

            // @todo use common container attribute
            Array.from(el.querySelectorAll(`[data-brk-container="${key}"]`))
                .forEach(element => {
                    let instance$ = preplug(factory(element, modifyChildProps(props$)));
                    sources.set(element, instance$);
                    component$.plug(instance$);
                });

            return component$;
        });

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

        streams.push(mutations$.filter(isAddedChildNode)
            .flatMapLatest(({ payload })=> {
                // We're going to side effect here
                // by updating the already-created
                // streams with the stream for the
                // new node.
                let { key, node } = payload;
                let component = config[key];

                if (component) {
                    let { factory, modifyChildProps, preplug } = component;

                    let instance$ = preplug(factory(node, modifyChildProps(props$)));
                    sources.set(node, instance$);
                    mixin[key].plug(instance$);
                }

                return never();
            })
        );

        streams.push(mutations$.filter(isRemovedChildNode)
            .flatMapLatest(({ payload })=> {
                // Side-effect. See above.
                let { key, node } = payload;
                console.log(node);

                let instance$ = sources.get(node);
                let components$ = mixin[key];

                if (instance$ && components$) {
                    components$.unplug(instance$);
                }

                return never();
            })
        );

        return Object.assign(Object.create(merge(streams)), mixin);
    });
}
