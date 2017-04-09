---
id: connecting-a-redux-store-to-the-view
title: Connecting a Redux Store to the View
---

Once the view layer is up and running, the next step is to mount the view into the application. The view layer will be mounted into a "delta". A delta is a function that takes a stream of `actions$` and a stream of `state$` from Redux and returns a new stream of actions that get emitted into the store. This is bound into the store through the `observeDelta` middleware.

`domDelta` is implemented as a function that returns a delta, and all userland deltas should be implemented this way. First, define the relevant functions for the :

```js
// dom.js
import Kefir from 'kefir';
import { observeDelta, domDelta, component } from 'brookjs';

const view = component({
    onMount() {
        return Kefir.constant({ type: 'MOUNT_VIEW' });
    }
});

export const el = doc => fromCallback(cb => {
    cb(doc.getElementById('app'));
});

export const selectProps = state$ => state$.map(state => ({
    ...state,
    isProps: true
}));
```

`selectProps` should be a function that maps a stream of state$ values from the Redux store to a stream of props$ for the dom delta. `el` should be either an `Element` or a stream-returning function that emits a single `Element` then ends. `view` should be the root component, responsible for rendering the entire DOM. These need to be passed into the configuration object for `domDelta`.

The `observeDelta` middleware can now be mounted into the store:

```js
import { createStore, applyMiddleware } from 'redux';
import deltaMiddleware from './dom';
import reducer from './reducer';

const deltaMiddleware = observeDelta(
    domDelta({ el, view, selectProps })
);

export default createStore(reducer, applyMiddleware(deltaMiddleware));
```

Because the `domDelta` won't be mounted until the `DOMContentLoaded` event has fired or the DOM has fully loaded, providing a stream allows the query process to be deferred until the DOM is ready.
