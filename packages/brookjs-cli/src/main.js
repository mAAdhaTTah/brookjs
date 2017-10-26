import R from 'ramda';
import loader from '@std/esm';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { observeDelta } from 'brookjs';
import { run } from './actions';
import { envDelta, npmDelta, scaffoldDelta, terminalDelta } from './deltas';
import { npm, scaffold, ui } from './services';
import { app, command, env, mocha } from './reducers';

export default R.curry(function main (name, args, options) {
    const store = createStore(
        combineReducers({ app, command, env, mocha }),
        applyMiddleware(observeDelta(
            envDelta({ process, require: loader(module, { esm: 'js' }) }),
            npmDelta({ npm }),
            scaffoldDelta({ scaffold }),
            terminalDelta({ ui })
        ))
    );

    store.dispatch(run(name, args, options));
});
