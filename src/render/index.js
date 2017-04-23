import assert from 'assert';
import R from 'ramda';
import Kefir from 'kefir';
import { outerHTML, use } from 'diffhtml/lib';
import { $$internals } from '../constants';
import { raf$ } from '../rAF';
import { registerElementAnimations } from './animations';
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
 * @param {Object} animations - Animation definitions.
 * @returns {Function} Curried stream generating function.
 */
export default function render(template, animations = {}) {
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
            .flatMapLatest(renderFromHTML(el)),

        createAnimationSink: (el, props$) => registerElementAnimations(el, animations)
            // props$ only emits a value right before it ends, ending the registration stream.
            // delay ensures we unregister the element after the last render has completed.
            .takeUntilBy(props$.ignoreValues().beforeEnd(() => raf$.take(1).delay(5)).flatMap(R.identity))
    };

    /**
     * Create combined render/animation stream.
     *
     * @param {HTMLElement} el - Element to render against.
     * @param {Observable<T>} props$ - Stream of component props.
     * @returns {Stream<void, void>} Rendering stream.
     */
    const renderFactory = (el, props$) => Kefir.merge([
        internals.createRenderSink(el, props$),
        internals.createAnimationSink(el, props$)
    ]);

    renderFactory[$$internals] = internals;

    return renderFactory;
}
