# `brookjs-combineActionReducers`

`combineActionReducers` is an alternate method for structuring your reducers. Using `Redux`'s default `combineReducers`, I ran into two issues:

1. By sectioning off state by key, an individual reducer loses access to the rest of the state. If a piece of state needs to be set conditionally based on another piece of state, the reducer cannot read it.

    In my case, this was the result of an anti-pattern; the state wasn't normalized, so all of the UI logic lived in the reducer. This was resolved by exposing `modifyState` in the `bootrap` module, allowing us to modify the UI state stream and map the application state to the UI props, much like `mapStateToProps` in `react-redux`.

    `combineActionReducers` allows you to centralize the logic for a given action, functioning as a transition step between a denormalized state and a normalized one. Seeing how an action modifies the state enables

2. Outside of being a transition tool, `combineActionReducers` allows you to view the state as a set of transitions, rather than a series of states. While view makes sense from a dev tools perspective, the development process, especially in brookjs, tends to be action oriented. Components are defined by the actions they emit and how they map their children's actions, and delta sources respond to and emit their own events.

    If there's a bug in your application, you start at the lowest-level component and ensure it emits the action you expect. You then go to the state and see if it changes the way it's supposed to. If that's not the problem, you look at the UI props (now using `modifyState`) to ensure that's what you expect. Finally, you ensure the components render the way their supposed to, given that state.

    Overall, the debugging flow through the application is very clear, and the first half of that process is all action oriented. If the bug needs to be fixed in multiple parts of the state, `combineReducers` would require you to update multiple functions/sub-reducers. However, in my experience, you're much more likely to need to modify how the state changes in response to that action than needing to modify how the piece of substate changes in response to multiple actions at once.

Obviously, this is very much limited by my total experience with both Redux and `brookjs` so far, so this is a proof of concept to see if this approach makes sense for structuring a larger reducer. Even if this isn't the ideal pattern for building your entire reducer, you don't need to switch from one to the other, but both `combineReducers` and `combineActionReducers` can be used together. This is explained below.

# How to Use

Assuming you have `brookjs` installed (if not, see the main [README.md][main-readme]), you can destructure it off the main export:

```js
import { combineActionReducers } from 'brookjs';
import { ACTION_TYPE } from '../actions';
import actionTypeReducer from './actionTypeReducer';

export default combineActionReducers([
    [ACTION_TYPE, actionTypeReducer]
]);
```

`combineActionReducers` accepts an array of tuples, with the first value equaling the `action.type` value that maps to the reducer. The second value is the reducer function to call when the `action.type` maps to the current action. This syntax is inspired by ramda's [`cond`][cond].

An action reducer is the same type as the reducer functions passed to `combineReducers`, so it should feel familiar. The main difference is the function gets broken up by action. In redux, you'd do something like this:

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

 Adding `combineActionReducers`, we can simplify this thusly:

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

 There are two advantages to structuring your reducers like this. First, the default case is handled for you, rather than needing to remember to return the current state by default. Secondly, each individual `actionReducer` is smaller, which makes it both easier to test and easier to reason about.

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

const valueOtherActionTypeReducer =
    (disabled, { payload }) => disabled && payload.value < 10;

const disabled = combineActionReducers([
    [ACTION_TYPE, actionTypeReducer],
    [OTHER_ACTION_TYPE, otherActionTypeReducer]
]);

export default combineReducers({ value, disabled });
```

  [main-readme]: ../README.md
  [cond]: http://ramdajs.com/0.22.1/docs/#cond
