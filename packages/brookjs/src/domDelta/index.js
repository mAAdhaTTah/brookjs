import * as R from 'ramda';
import Kefir from 'kefir';

/**
 * Creates a new stream that emits whether the document is loaded.
 *
 * @returns {Observable<boolean>} Observable indicating whether document is loaded.
 */
const documentIsLoaded = () =>
    Kefir.fromCallback(callback =>
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
 * @param {Function} view - View component.
 * @param {Function} selectProps - Select the props$ stream from the state$.
 * @returns {Delta} Delta function.
 */
export default function domDelta({ el, view, selectProps }) {
    let precheck$ = Kefir.constant('Configuration correct');

    if (typeof el === 'function') {
        el = el(document);

        if (!(el instanceof Kefir.Observable)) {
            precheck$ = Kefir.constantError(new TypeError(`type ${typeof el} returned from el is not valid`));
        }
    } else if (el instanceof Element) {
        el = Kefir.constant(el);
    } else {
        precheck$ = Kefir.constantError(new TypeError(`el of type ${typeof el} is not valid`));
    }

    if (typeof view !== 'function') {
        precheck$ = Kefir.constantError(new TypeError(`component of type ${typeof el} is not valid`));
    }

    if (typeof selectProps !== 'function') {
        precheck$ = Kefir.constantError(new TypeError(`selectProps of type ${typeof el} is not valid`));
    }

    return (actions$, state$) => precheck$
        .flatMap(documentIsLoaded)
        .flatMap(isLoaded =>
            isLoaded ?
                // ensures async consistency
                Kefir.later(0, true) :
                Kefir.fromEvents(document, 'DOMContentLoaded')
        )
        .flatMap(R.always(el))
        .take(1).takeErrors(1)
        .flatMap(el => view(el, selectProps(state$)));
}
