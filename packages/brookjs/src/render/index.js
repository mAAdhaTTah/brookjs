import assert from 'assert';
import R from 'ramda';
import { outerHTML, use } from 'diffhtml';
import { $$internals } from '../constants';
import { raf$ } from '../rAF';
import middleware from './middleware';

use(middleware());

/**
 * Creates a stream that updates the element to match the provided HTML.
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
    })
);

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

    const internals = {
        /**
         * Render sink stream generator function.
         *
         * @param {HTMLElement} el - Element to render against.
         * @param {Observable<T>} props$ - Stream of component props.
         * @returns {Stream<void, void>} Rendering stream.
         */
        createRenderSink: (el, props$) => props$.map(template)
            .flatMapLatest(renderFromHTML(el))
    };

    /**
     * Create combined render/animation stream.
     *
     * @param {HTMLElement} el - Element to render against.
     * @param {Observable<T>} props$ - Stream of component props.
     * @returns {Stream<void, void>} Rendering stream.
     */
    const renderFactory = R.curry(internals.createRenderSink);

    renderFactory[$$internals] = internals;

    return renderFactory;
}
