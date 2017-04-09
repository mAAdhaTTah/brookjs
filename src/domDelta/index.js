import R from 'ramda';
import { constant, constantError, fromCallback, fromEvents, later, Observable } from 'kefir';

/**
 * Creates a new stream that emits whether the document is loaded.
 *
 * @returns {Observable<boolean>} Observable indicating whether document is loaded.
 */
const documentIsLoaded = () =>
    fromCallback(callback =>
        callback(
            document.readyState === 'complete' ||
            document.readyState === 'loaded' ||
            document.readyState === 'interactive'
        )
    );

/**
 * Creates a new delta for the DOM for the given configuration.
 *
 * @param {Element|Function} el - Element or function that returns Observable<Element>.
 * @param {Function} component - Component function.
 * @param {Function} view - View component.
 * @param {Function} selectProps - Select the props$ stream from the state$.
 * @returns {Delta} Delta function.
 */
export default function domDelta({ el, component, view, selectProps }) {
    if (component) {
        console.warn('`component` in `domDelta` is deprecated. use `view`.');
        view = component;
    }

    let precheck$ = constant('Configuration correct');

    if (typeof el === 'function') {
        el = el(document);

        if (!(el instanceof Observable)) {
            precheck$ = constantError(new TypeError(`type ${typeof el} returned from el is not valid`));
        }
    } else if (el instanceof Element) {
        el = constant(el);
    } else {
        precheck$ = constantError(new TypeError(`el of type ${typeof el} is not valid`));
    }

    if (typeof view !== 'function') {
        precheck$ = constantError(new TypeError(`component of type ${typeof el} is not valid`));
    }

    if (typeof selectProps !== 'function') {
        precheck$ = constantError(new TypeError(`selectProps of type ${typeof el} is not valid`));
    }

    return (actions$, state$) => precheck$
        .flatMap(documentIsLoaded)
        .flatMap(isLoaded =>
            isLoaded ?
                // ensures async consistency
                later(0, true) :
                fromEvents(document, 'DOMContentLoaded')
        )
        .flatMap(R.always(el))
        .take(1).takeErrors(1)
        .flatMap(el => view(el, selectProps(state$)));
}
