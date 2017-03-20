import assert from 'assert';
import { rafAction } from '../action';
import { outerHTML, use } from 'diffhtml';
import R from 'ramda';
import { stream } from 'kefir';
import renderMiddleware from './middleware';

use(renderMiddleware());

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
 * Creates a stream that updates the element to match the provded HTML.
 *
 * @param {Element} el - Element to update.
 * @param {string} html - HTML to update to.
 * @returns {Kefir.Observable} Render stream.
 */
export const renderFromHTML = R.curry((el, html) =>
    raf$.take(1).flatMap(() => {
        if (process.env.NODE_ENV !== 'production') {
            assert.equal(typeof html, 'string', '`template` should return a string');
        }

        return outerHTML(el, html);
    }));

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
