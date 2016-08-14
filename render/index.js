import assert from 'assert';
import { CONTAINER_ATTRIBUTE } from '../component/events';
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
        assert.equal(typeof template({}), 'string', '`template` should return a string');
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
    return R.curry(function renderGenerator(el, prev, next) {
        return stream(emitter => {
            const loop = requestAnimationFrame(() => {
                morphdom(el, template(next), {
                    onBeforeElUpdated: function blackboxContainer(fromEl) {
                        // Only update non-container elements.
                        return !fromEl.hasAttribute(CONTAINER_ATTRIBUTE);
                    }
                });

                emitter.end();
            });

            return () => cancelAnimationFrame(loop);
        });
    });
};
