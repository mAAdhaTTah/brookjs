---
id: bootstrapping-the-application
title: Bootstrapping the Application
---

`brookjs` doesn't prescribe any particular way of starting up the application. In practice, a `brookjs` application is typically bootstrapped on the creation of the Redux store. Additionally, an initialization action is recommended to perform any side effects that need to take place immediately after the application has been bootstrapped.

With Redux, the store creation process looks like this:

```js
import R from 'ramda';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { domDelta } from 'brookjs';
import { init } from './action';
import { el, selectProps, view } from './dom';
import { myState } from './reducer';

const { __INITIAL_STATE__ } = global;

const applyDelta = R.compose(applyMiddleware, observeDelta);

const store = createStore(
    combineReducers({ myState }),
    __INITIAL_STATE__,
    applyDelta(domDelta({ el, selectProps, view }))
);

store.dispatch(init());
```

With this configuration, any delta that needs to handle something immediately should use the `INIT` action, ensuring the delta doesn't accidentally emit values before the Redux middleware has fully mounted. Doing so may run into this odd [Redux behavior][issue1240], and other deltas will not get the actions dispatched correctly.

The `init` action also treats the bootstrapping process as two distinct steps: creating the store, and initializing the application. From that perspective, the "side effect" that starts everything off is the first dispatch, which has its own sort of elegance.

There's no need to test this bootstrapping process. The application should be integration tested at this level.

  [issue1240]: https://github.com/reactjs/redux/issues/1240
