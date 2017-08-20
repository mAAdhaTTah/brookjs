import { domDelta, observeDelta } from 'brookjs';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { init } from './actions';
import {} from './deltas';
import {} from './reducers';
import { selectProps } from './selectors';

const { __INITIAL_STATE__ } = global;

const compose = composeWithDevTools({
    name: '{{name}}'
});

const enhancer = compose(applyMiddleware(observeDelta(
    // Register your deltas here
    domDelta({ el, view, selectProps })
)));

const reducer = combineReducers({
    // Register your reducers here
});

const store = createStore(reducer, __INITIAL_STATE__, enhancer);

store.dispatch(init());
