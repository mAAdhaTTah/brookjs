import assert from 'assert';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import R from 'ramda';
import { stream } from 'kefir';
import morphdom from 'morphdom';

/**
 * Emitted on requestAnimationFrame callbacks.
 *
 * @type {string}
 */
export const RAF = 'RAF';

/**
 * Create a new raf action.
 *
 * @param {number} time - rAF time.
 * @returns {Action} raf Action.
 */
export const rafAction = function rafAction(time) {
    return {
        type: RAF,
        payload: { time }
    };
};

/**
 * Stream of requestAnimationFrame events.
 *
 * Used to schedule renders.
 *
 * @type {Kefir.Stream<T, S>}
 */
export const raf$ = stream(emitter => {
    let loop;
    let enabled = false;

    (function schedule() {
        enabled = true;
        loop = requestAnimationFrame(time => {
            emitter.value(rafAction(time));

            if (enabled) {
                schedule();
            }
        });
    })();

    return () => {
        cancelAnimationFrame(loop);
        enabled = false;
    };
});

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
    return R.curry((el, prev, next) =>
        raf$.take(1)
            .flatMap(() => stream(emitter => {
                const html = template(next);

                if (process.env.NODE_ENV !== 'production') {
                    assert.equal(typeof html, 'string', '`template` should return a string');
                }

                morphdom(el, html, {
                    getNodeKey: function getNodeKey(el) {
                        if (el.hasAttribute && el.hasAttribute(CONTAINER_ATTRIBUTE) && el.hasAttribute(KEY_ATTRIBUTE)) {
                            return `${el.getAttribute(CONTAINER_ATTRIBUTE)}::${el.getAttribute(KEY_ATTRIBUTE)}`;
                        }

                        return '';
                    },
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

                        /**
                         * If it is a container, we're going to do our own updating
                         * and tell morphdom to move on.
                         */
                        const containerKey = fromEl.getAttribute(CONTAINER_ATTRIBUTE);

                        // In the current application, attributes aren't passed through
                        // the modified child props$ stream correctly, so make sure
                        // the container attribute doesn't change for now. This is
                        // deprecated behavior already.
                        if (toEl.getAttribute(CONTAINER_ATTRIBUTE) === '') {
                            if (process.env.NODE_ENV !== 'production') {
                                console.warn('deprecated: ensure rendered HTML includes container attribute', containerKey);
                            }

                            toEl.setAttribute(CONTAINER_ATTRIBUTE, containerKey);
                        }

                        // If the container has changed, swap element ourselves.
                        // This is similar to how React handles it: If a subtree
                        // is a different component, it just prunes and replaces,
                        // since the subtree could be different in myriad different
                        // ways and a full diff would be computationally
                        // expensive. Additionally, this allows the
                        // MutationObserver to continue to only worry about
                        // add/remove operations instead of attribute mutations.
                        if (containerKey !== toEl.getAttribute(CONTAINER_ATTRIBUTE)) {
                            fromEl.parentNode.replaceChild(toEl, fromEl);
                        }

                        // Tell morphdom to move on.
                        return false;

                    }
                });

                emitter.end();
            })));
};
