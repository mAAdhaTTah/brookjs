import assert from 'assert';
import R from 'ramda';
import { $$internals, KEY_ATTRIBUTE } from '../constants';

/**
 * Create a new children stream instance from the given configuration, props$ stream & element.
 *
 * @param {string} container - Container key.
 * @param {Function} createSourceStream - Function that generates a source stream.
 * @param {Function} factory - Instance factory function.
 * @param {Function} modifyChildProps - Creates a new props$ stream for the child.
 * @param {Function} preplug - Modify the child instance stream.
 * @returns {Kefir.Observable} Child instance.
 */
export default function child({ container, factory, modifyChildProps = R.identity, preplug = R.identity }) {
    if (process.env.NODE_ENV !== 'production') {
        assert.equal(typeof factory, 'function', `factory for ${container} should be a function`);
        assert.equal(typeof modifyChildProps, 'function', `modifyChildProps for ${container} should be a function`);
        assert.equal(typeof preplug, 'function', `preplug for ${container} should be a function`);
    }

    /**
     * Create child stream mounted to the provided element & props$.
     *
     * @param {Element} element - Child element.
     * @param {Kefir.Observable} props$ - Child props stream.
     * @returns {Kefir.Observable} - Child stream instance.
     */
    return R.curry((element, props$, { useFactory = false }) => {
        const keyAttr = element.getAttribute(KEY_ATTRIBUTE);
        let func = factory;

        if (!useFactory && factory[$$internals]) {
            func = factory[$$internals].createSourceStream;
        }

        return preplug(func(element, modifyChildProps(props$, keyAttr)), keyAttr);
    });
}
