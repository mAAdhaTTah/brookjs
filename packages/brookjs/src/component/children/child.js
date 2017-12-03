import assert from 'assert';
import R from 'ramda';
import { $$internals, KEY_ATTRIBUTE } from '../constants';

/**
 * Create a new children stream instance from the given configuration, props$ stream & element.
 *
 * @param {string} container - Container key.
 * @param {Function} createInstance - Function that generates a source stream.
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
     * @param {Element} el - Child element.
     * @param {Kefir.Observable} props$ - Child props stream.
     * @param {Observable} effect$$ - Stream of effect$.
     * @returns {Kefir.Observable} - Child stream instance.
     */
    return (el, props$, effect$$) => {
        const keyAttr = el.getAttribute(KEY_ATTRIBUTE);
        let instance$ = factory[$$internals].createInstance(el, modifyChildProps(props$, keyAttr), effect$$);

        // We need to hold onto the effect$$ so
        // preplug can modify the stream the normal way
        // without losing access to it.
        const eff$ = instance$.effect$$;
        instance$ = preplug(instance$, keyAttr);
        instance$.effect$$ = eff$;

        return instance$;
    };
}
