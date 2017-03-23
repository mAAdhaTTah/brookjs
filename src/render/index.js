import assert from 'assert';
import { rafAction } from '../action';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import R from 'ramda';
import { stream } from 'kefir';
import morphdom from 'morphdom';

/**
 * Stream of requestAnimationFrame events.
 *
 * Used to schedule renders.
 *
 * @type {Kefir.Stream<T, S>}
 */
export const raf$ = stream(emitter => {
    let loop;
    let enabled = true;

    (function schedule() {
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
 * Creates a stream that updates the element to match the provded HTML.
 *
 * @param {Element} el - Element to update.
 * @param {string} html - HTML to update to.
 * @returns {Kefir.Observable} Render stream.
 */
export const renderFromHTML = R.curry((el, html) =>
    raf$.take(1).flatMap(() => stream(emitter => {
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
                /**
                 * Always update the top level element.
                 *
                 * We're making a few assumptions about the main element
                 * and its relationship to the returned template:
                 *
                 * 1. The container type of the template already matches
                 * the container type of the element. This should be matched
                 * correctly when the element is mounted.
                 *
                 * 2. The key of the template already matches the key of
                 * the element. If there is no key on either, then the
                 * attribute is `null`. This should be matched correctly
                 * using `modifyChildProps` to emit the props with the
                 * correct key, assuming the use of the default render.
                 *
                 * These assumptions get verified below outside of production.
                 */
                if (fromEl === el) {
                    if (process.env.NODE_ENV !== 'production') {
                        assert.equal(
                            el.getAttribute(CONTAINER_ATTRIBUTE),
                            fromEl.getAttribute(CONTAINER_ATTRIBUTE),
                            `The template ${CONTAINER_ATTRIBUTE} should match the root element ${CONTAINER_ATTRIBUTE}.`
                        );
                        assert.equal(
                            el.getAttribute(KEY_ATTRIBUTE),
                            fromEl.getAttribute(KEY_ATTRIBUTE),
                            `The template ${KEY_ATTRIBUTE} should match the root element ${KEY_ATTRIBUTE}.`
                        );
                    }

                    return true;
                }

                // Update anything that isn't a container.
                if (!fromEl.hasAttribute(CONTAINER_ATTRIBUTE)) {
                    return true;
                }

                /**
                 * If it is a container, we're going to do our own updating
                 * and tell morphdom to move on.
                 *
                 * If the container has changed, swap element ourselves.
                 * This is similar to how React handles it: If a subtree
                 * is a different component, it just prunes and replaces,
                 * since the subtree could be different in myriad different
                 * ways and a full diff would be computationally
                 * expensive. Additionally, this allows the MutationObserver
                 * to continue to only worry about add/remove operations
                 * instead of attribute mutations.
                 */
                if (fromEl.getAttribute(CONTAINER_ATTRIBUTE) !== toEl.getAttribute(CONTAINER_ATTRIBUTE) ||
                    fromEl.getAttribute(KEY_ATTRIBUTE) !== toEl.getAttribute(KEY_ATTRIBUTE)
                ) {
                    fromEl.parentNode.replaceChild(toEl, fromEl);
                }

                // Tell morphdom to move on.
                return false;

            }
        });

        emitter.end();
    })));

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
    return R.curry((el, props$) =>
        props$.map(template).flatMapLatest(renderFromHTML(el)));
}
