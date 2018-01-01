import R from 'ramda';
import loader from '@std/esm';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { observeDelta } from 'brookjs';
import { run } from './actions';
import { envDelta, npmDelta, scaffoldDelta, storybookDelta, terminalDelta,
    testRunnerDelta, webpackDelta } from './deltas';
import { app, command, env, mocha, storybook, webpack } from './reducers';
import { glob, npm, scaffold, ui, WebpackService, StorybookService } from './services';

export default R.curry(function main (name, args, options, logger) {
    const store = createStore(
        combineReducers({ app, command, env, mocha, storybook, webpack }),
        applyMiddleware(observeDelta(
            envDelta({ process, require: loader(module, { esm: 'js', cjs: true }) }),
            npmDelta({ npm }),
            scaffoldDelta({ scaffold }),
            storybookDelta({ StorybookService }),
            terminalDelta({ ui: ui(logger) }),
            testRunnerDelta({ glob }),
            webpackDelta({ webpack: WebpackService })
        ))
    );

    store.dispatch(run(name, args, options));
});
