# `brookjs-combineActionReducers`

`combineActionReducers` is an alternate method for structuring your reducers. Can be used with Redux's `combineReducers` to eliminate long switch statements and encourage extracting each case into a testable function.

# How to Use

Assuming you have `brookjs` installed, you can destructure it off the main export:

```js
import { combineActionReducers } from 'brookjs';
import { ACTION_TYPE } from '../actions';
import actionTypeReducer from './actionTypeReducer';

export default combineActionReducers([
    [ACTION_TYPE, actionTypeReducer]
]);
```

`combineActionReducers` accepts an array of tuples, with the first value as the `action.type` for the reducer and the second value as the reducer function to call for that `action.type`. This syntax is inspired by ramda's [`cond`][cond].

An action reducer looks just like the reducer functions for `combineReducers`. The main difference is the function gets broken up by action. In redux, you'd do something like this:

 ```js
 export default reducer(state, { type, payload = {} }) {
     const { value } = payload;

     switch (type) {
         case ACTION_TYPE:
            return Object.assign({}, state, { value });
        case OTHER_ACTION_TYPE:
           return Object.assign({}, state, { value: !value });
        default:
            return state;
     }
 }
 ```

 Adding `combineActionReducers`, we can simplify thusly:

 ```js
import { combineActionReducers } from 'brookjs';

const actionTypeReducer = (state, { payload }) =>
    Object.assign({}, state, { value: payload.value });

const otherActionTypeReducer = (state, { payload }) =>
    Object.assign({}, state, { value: !payload.value });

 export default combineActionReducers([
     [ACTION_TYPE, actionTypeReducer],
     [OTHER_ACTION_TYPE, otherActionTypeReducer]
 ]);
 ```

 There are two advantages to structuring your reducers like this. First, the default case is handled for you, rather than needing to remember to return the current state. Secondly, each individual `actionReducer` is smaller, which makes it both easier to test and easier to reason about.

## Using with `combineReducers`

When using both `combineReducers` and `combineActionReducers`, use `combineReducers` to build up all of your branch reducers. At the point where you would normally write a long switch statement, swap out the reducer with `combineActionReducers`.

```js
import { combineReducers } from 'redux';
import { combineActionReducers } from 'brookjs';

// Normally, you'd import these so the names aren't so dopey.
const valueActionTypeReducer =
    (value, { payload }) => payload.value + value;

const valueOtherActionTypeReducer =
    (value, { payload }) => payload.value / 2 - value;

const value = combineActionReducers([
    [ACTION_TYPE, actionTypeReducer],
    [OTHER_ACTION_TYPE, otherActionTypeReducer]
]);

const disabledActionTypeReducer =
    (disabled, { payload }) => !disabled && payload.value > 50;

const disabledOtherActionTypeReducer =
    (disabled, { payload }) => disabled && payload.value < 10;

const disabled = combineActionReducers([
    [ACTION_TYPE, actionTypeReducer],
    [OTHER_ACTION_TYPE, otherActionTypeReducer]
]);

export default combineReducers({ value, disabled });
```

# Alternate Approaches

## Action Oriented Reducer

Instead of an easy-to-read way of defining long switch statements in subreducers, `combineActionCreators` can be used to structure the entire reducer. Doing so allows you to view the state as a set of transitions, rather than a series of values. While this view makes sense from a dev tools perspective, the development process, especially in brookjs, tends to be action oriented. Components are defined by the actions they emit and how they map their children's actions, and delta sources respond to and emit their own events.

If there's a bug in your application, you start at the lowest-level component and ensure it emits the action you expect. You then go to the state and see if it changes the way it's supposed to. If that's not the problem, you look at the UI props (now using `modifyState`) to ensure that's what you expect. Finally, you ensure the components render the way their supposed to, given that state.

Overall, the debugging flow through the application becomes very clear, and the first half of that process is all action oriented. If the bug needs to be fixed in multiple parts of the state, `combineReducers` would require you to update multiple functions/sub-reducers, whereas most bugs occur in response to an action.

## Denormalized State Escape Hatch

`combineActionReducers` can also help you normalize a state tree. If two pieces of state depend on each other, but don't exist in the same branch of the state tree, that value may be better off fetched from a selector function.`

Cross-key state dependency is a code smell; if one part of your state is depending upon another, the state isn't normalized, and properties that are merely the result of computing other properties don't belong in your state.

`combineActionReducers` allows you to centralize the logic for a given action with access to the whole state. Wrapping the reducer like this:

```js
import { combineActionReducer } from 'brookjs';
import combinedReducer from './reducer';

const actionReducer = combineActionReducer([
    [ACTION_TYPE, actionTypeReducer]
])

export default function reducer(state, action) {
    state = combinedReducer(state, action);
    return actionReducer(state, action);
}
```

`actionTypeReducer` will be passed the entire state, allowing the codependent logic to be centralized. The computed property can then be extracted into a selector function, and reused when mapping state to props.

  [main-readme]: ../README.md
  [cond]: http://ramdajs.com/0.22.1/docs/#cond
