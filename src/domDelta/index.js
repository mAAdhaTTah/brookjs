import R from 'ramda';
import { constant, constantError, fromCallback, fromEvents } from 'kefir';

const documentIsLoaded = () =>
    fromCallback(callback =>
        callback(
            document.readyState === 'complete' ||
            document.readyState === 'loaded' ||
            document.readyState === 'interactive'
        )
    );

export default function domDelta({ el, component, selectProps }) {
    let precheck$ = constant('Configuration correct');

    if (typeof el === 'function') {
        el = el(document);
    } else if (el instanceof Element) {
        el = constant(el);
    } else {
        precheck$ = constantError(new TypeError(`el of type ${typeof el} is not valid`));
    }

    if (typeof component !== 'function') {
        precheck$ = constantError(new TypeError(`component of type ${typeof el} is not valid`));
    }

    if (typeof selectProps !== 'function') {
        precheck$ = constantError(new TypeError(`selectProps of type ${typeof el} is not valid`));
    }

    return (actions$, state$) => {
        return precheck$
            .flatMap(documentIsLoaded)
            .flatMap(isLoaded =>
                isLoaded ?
                    constant(true) :
                    fromEvents(document, 'DOMContentLoaded')
            )
            .flatMap(R.always(el))
            .take(1).takeErrors(1)
            .flatMap(el => component(el, selectProps(state$)));
    };
}
