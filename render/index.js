import assert from 'assert';
import { CONTAINER_ATTRIBUTE } from '../constants';
import R from 'ramda';
import { stream } from 'kefir';
import morphdom from 'morphdom';

/**
 * Generates a new rendering stream that ends after the element is updated.
 *
 * @param {Function} template - String-returning template function.
 * @returns {Function} Curried stream generating function.
 */
export default function render(template) {
    if (process.env.NODE_ENV !== 'production') {
        assert.equal(typeof template, 'function', '`template` should be a function');
    }

    /**
     * Render stream generator function.
     *
     * @param {HTMLElement} el - Element to render against.
     * @param {Object} prev - Previous state.
     * @param {Object} next - Next state.
     * @returns {Stream<void, void>} Rendering stream.
     * @factory
     */
    return R.curry((el, prev, next) => {
        return stream(emitter => {
            const loop = requestAnimationFrame(() => {
                const html = template(next);

                if (process.env.NODE_ENV !== 'production') {
                    assert.equal(typeof html, 'string', '`template` should return a string');
                }

                morphdom(el, html, {
                    onBeforeElUpdated: function blackboxContainer(fromEl, toEl) {
                        // Update the contents of the main element...
                        if (fromEl === el &&
                            // ... unless the Container attribute has changed.
                            el.getAttribute(CONTAINER_ATTRIBUTE) === toEl.getAttribute(CONTAINER_ATTRIBUTE)
                        ) {
                            return true;
                        }

                        // Update anything that isn't a container.
                        if (!fromEl.hasAttribute(CONTAINER_ATTRIBUTE)) {
                            return true;
                        }

                        const containerKey = fromEl.getAttribute(CONTAINER_ATTRIBUTE);

                        if (toEl.getAttribute(CONTAINER_ATTRIBUTE) === '') {
                            console.warn('deprecated: ensure rendered HTML includes container attribute', containerKey);
                            toEl.setAttribute(CONTAINER_ATTRIBUTE, containerKey);
                        }

                        // If the container has changed, swap element ourselves
                        // and tell morphdom to move on. This similar to
                        // how React handles it: If a subtree is a different
                        // component, it just prunes and replaces, since the
                        // subtree could be different in myriad different
                        // ways and a full diff would be computationally
                        // expensive. Additionally, this allows the
                        // MutationObserver to continue to only worry about
                        // add/remove operations instead of attribute mutations.
                        if (containerKey !== toEl.getAttribute(CONTAINER_ATTRIBUTE)) {
                            const parent = fromEl.parentNode;
                            parent.replaceChild(toEl, fromEl);
                            return false;
                        }

                        return true;

                    }
                });

                emitter.end();
            });

            return () => cancelAnimationFrame(loop);
        });
    });
};
