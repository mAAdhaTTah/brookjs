import assert from 'assert';
import R from 'ramda';
import { merge, never, pool } from 'kefir';
import mutations$, { NODE_ADDED, NODE_REMOVED } from './mutations';

const sources = new WeakMap();

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
            config[key] = {
                factory: config[key],
                adapter: R.map(R.prop(key))
            };
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

            let { factory, adapter } = component;

            if (process.env.NODE_ENV !== 'production') {
                assert.equal(typeof factory, 'function', `factory for ${key} should be a function`);
                assert.equal(typeof adapter, 'function', `adapter for ${key} should be a function`);
            }

            let component$ = mixin[key] = pool();

            // @todo use common container attribute
            Array.from(el.querySelectorAll(`[data-brk-container="${key}"]`))
                .forEach(element => {
                    let instance$ = factory(element, adapter(props$));
                    sources.set(element, instance$);
                    component$.plug(instance$);
                });

            return component$;
        });

        streams.push(mutations$.filter(
                R.pipe(R.path(['payload', 'parent']), R.equals(el))
            )
            .filter(
                R.pipe(R.prop('type'), R.equals(NODE_ADDED))
            )
            .flatMapLatest(({ payload })=> {
                // We're going to side effect here
                // by updating the already-created
                // streams with the stream for the
                // new node.
                let { key, node } = payload;
                let component = config[key];

                if (component) {
                    let { factory, adapter } = component;

                    let instance$ = factory(node, adapter(props$));
                    sources.set(node, instance$);
                    mixin[key].plug(instance$);
                }

                return never();
            })
        );

        streams.push(mutations$.filter(
                R.pipe(R.path(['payload', 'target']), R.equals(el))
            )
            .filter(
                R.pipe(R.prop('type'), R.equals(NODE_REMOVED))
            )
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
