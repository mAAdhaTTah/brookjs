import assert from 'assert';
import R from 'ramda';
import { KEY_ATTRIBUTE } from '../constants';
import { setInstanceForElement } from './util';

/**
 * Create a new children stream instance from the given configuration, props$ stream & element.
 *
 * @param {string} container - Container key.
 * @param {Function} factory - Instance factory function.
 * @param {Function} modifyChildProps - Creates a new props$ stream for the child.
 * @param {Function} preplug - Modify the child instance stream.
 * @param {string} key - @deprecated.
 * @returns {Kefir.Observable} Child instance.
 */
export default function child({ container, factory, modifyChildProps = R.identity, preplug = R.identity, key }) {
    if (process.env.NODE_ENV !== 'production') {
        assert.equal(typeof factory, 'function', `factory for ${container} should be a function`);
        assert.equal(typeof modifyChildProps, 'function', `modifyChildProps for ${container} should be a function`);
        assert.equal(typeof preplug, 'function', `preplug for ${container} should be a function`);

        if (key) {
            console.warn(`Using key in children configuration is deprecated.
Use the second parameter to modifyChildProps.`);

            assert.equal(typeof key, 'string', `key for ${container} should be a string`);
        }
    }

    /**
     * Create child stream mounted to the provided element & props$.
     *
     * @param {Element} element - Child element.
     * @param {Kefir.Observable} props$ - Child props stream.
     * @returns {Kefir.Observable} - Child stream instance.
     */
    return R.curry((element, props$) => {
        const hasKey = element.hasAttribute(KEY_ATTRIBUTE);
        const keyAttr = element.getAttribute(KEY_ATTRIBUTE);
        const useKey = key && hasKey;

        let childProps$ = modifyChildProps(props$, keyAttr);

        if (useKey) {
            if ('@@key' === key) {
                childProps$ = childProps$.map(R.prop(element.getAttribute(KEY_ATTRIBUTE)));
            } else {
                childProps$ = childProps$.map(R.find(
                    R.pipe(R.path(key.split('.')), R.equals(element.getAttribute(KEY_ATTRIBUTE)))
                ));
            }

            // If the key isn't found, then the child is about to
            // be removed, so don't dispatch props down the stream.
            // @todo this seems suboptimal. how to handle iterated children?
            childProps$ = childProps$.filter(
                R.pipe(R.type, R.equals('Undefined'), R.not)
            );
        }

        let instance$ = preplug(factory(element, childProps$));

        if (useKey) {
            instance$ = instance$.map(action => Object.assign({}, action, {
                payload: Object.assign({}, action.payload, {
                    key: element.getAttribute(KEY_ATTRIBUTE)
                })
            }));
        }

        setInstanceForElement(element, instance$);

        return instance$;
    });
}
