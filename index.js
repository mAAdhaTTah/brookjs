import { createStore } from 'redux';
import { pipe, identity } from 'ramda';

export { default as component } from './component';

export const BROOKJS_INIT = 'BROOKJS_INIT';

/**
 * Generates a `mount` function, which attached the provide configuration
 * values and uses them to mount an element and bootstrap the application.
 *
 * @param {Reducer<Object>} reducer - Reducer function.
 * @param {StoreEnhancer} enhancer - createStore enhancer function.
 * @param {Function} root - Root component factory.
 * @returns {mount} Starts the application.
 */
export function bootstrap({ reducer, enhancer, root }) {
    if (process.env.NODE_ENV !== 'production') {
        // To use devtools, install Chrome extension:
        // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
        enhancer = pipe(global.devToolsExtension ? global.devToolsExtension() : identity, enhancer);
    }

    return (el, state) => {
        const store = createStore(reducer, state, enhancer);
        const app = root(el, store);

        if (process.env.NODE_ENV !== 'production') {
            app.log('App');
        }

        let sub = app.observe({ value: store.dispatch });

        // @todo when Redux 4.0 is released use built-in init action:
        // https://github.com/reactjs/redux/pull/1702
        // We really shouldn't have to dispatch our own init action.
        setTimeout(() => store.dispatch({ type: BROOKJS_INIT }), 0);

        return sub;
    }
}
