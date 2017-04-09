import assert from 'assert';
import R from 'ramda';
import { stream } from 'kefir';
import morphdom from 'morphdom';
import { BLACKBOX_ATTRIBUTE, CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import { raf$ } from '../rAF';

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
                let key = '';

                // Ignore text nodes.
                if (el.nodeType === 3) {
                    return key;
                }

                if (el.hasAttribute(CONTAINER_ATTRIBUTE)) {
                    key = el.getAttribute(CONTAINER_ATTRIBUTE);

                    if (el.getAttribute(KEY_ATTRIBUTE)) {
                        key += `::${el.getAttribute(KEY_ATTRIBUTE)}`;
                    }
                }

                if (el.hasAttribute(BLACKBOX_ATTRIBUTE)) {
                    if (key) {
                        key += '::';
                    }

                    key += el.getAttribute(BLACKBOX_ATTRIBUTE);
                }

                return key;
            },
            onBeforeElUpdated: function blackboxContainer(fromEl) {
                // Update anything that isn't a container.
                return !fromEl.hasAttribute(BLACKBOX_ATTRIBUTE);
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
