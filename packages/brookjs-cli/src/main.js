import R from 'ramda';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { observeDelta } from 'brookjs';
import { run } from './actions';
import { envDelta, npmDelta, scaffoldDelta, terminalDelta } from './deltas';
import { app, command, env } from './reducers';
import { npm, scaffold, ui } from './services';

export default R.curry(function main (name, args, options) {
    const store = createStore(
        combineReducers({ app, command, env }),
        applyMiddleware(observeDelta(
            envDelta({ process, require }),
            npmDelta({ npm }),
            scaffoldDelta({ scaffold }),
            terminalDelta({ ui })
        ))
    );

    store.dispatch(run(name, args, options));
});
