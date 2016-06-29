import { createStore } from 'redux';
import $$observable from 'symbol-observable';
import { pipe, identity } from 'ramda';
import { fromESObservable } from 'kefir';

export { default as component } from './component';

export const BROOKJS_INIT = 'BROOKJS_INIT';

export function bootstrap({ reducer, enhancer, root }) {
    if (process.env.NODE_ENV !== 'production') {
        // To use devtools, install Chrome extension:
        // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
        enhancer = pipe(global.devToolsExtension ? global.devToolsExtension() : identity, enhancer);
    }

    return function mount(el, state) {
        const store = createStore(reducer, state, enhancer);
        const store$ = store[$$observable]();

        const instance = fromESObservable(root(el, store$));

        if (process.env.NODE_ENV !== 'production') {
            instance.log('App');
        }

        instance.onValue(store.dispatch);

        // @todo when Redux 4.0 is released use built-in init action:
        // https://github.com/reactjs/redux/pull/1702
        // We really shouldn't have to dispatch our own init action.
        setTimeout(() => store.dispatch({ type: BROOKJS_INIT }), 0);
    }
}
