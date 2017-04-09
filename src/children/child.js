import assert from 'assert';
import R from 'ramda';
import { KEY_ATTRIBUTE } from '../constants';

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
export default function child({ container, createSourceStream, factory, modifyChildProps = R.identity, preplug = R.identity }) {
    if (process.env.NODE_ENV !== 'production') {
        if (createSourceStream) {
            assert.equal(typeof createSourceStream, 'function', `createSourceStream for ${container} should be a function`);
        } else {
            assert.equal(typeof factory, 'function', `factory for ${container} should be a function`);
        }
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
    return R.curry((element, props$) => {
        const keyAttr = element.getAttribute(KEY_ATTRIBUTE);

        return preplug((createSourceStream || factory)(element, modifyChildProps(props$, keyAttr)), keyAttr);
    });
}
