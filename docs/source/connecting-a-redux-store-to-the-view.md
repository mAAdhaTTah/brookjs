---
id: connecting-a-redux-store-to-the-view
title: Connecting a Redux Store to the View
---

Once the view layer is up and running, the next step is to mount the view into the application. The view layer will be mounted into a "delta". A delta is a function that takes a stream of `actions$` and a stream of `state$` from Redux and returns a new stream of actions that get emitted into the store. This is bound into the store through the `observeDelta` middleware.

`domDelta` is implemented as a function that returns a delta, and all userland deltas should be implemented this way. Mount the view into the middleware:

```js
import { observeDelta, domDelta } from 'brookjs';
import component from './component';

export const el = doc => fromCallback(cb => {
    cb(doc.getElementById('app'));
});

export const selectProps = state$ => state$.map(state => ({
    ...state,
    isProps: true
}));

export default observeDelta(
    domDelta({ el, component, selectProps })
)
```

The `selectProps` function maps a stream of state$ values from the Redux store to a stream of props$ for the dom delta. The `observeDelta` middleware can now be mounted into the store:

```js
import { createStore, applyMiddleware } from 'redux';
import deltaMiddleware from './delta';
import reducer from './reducer';

export default createStore(reducer, applyMiddleware(deltaMiddleware));
```

And the component will be called with the props$ returned from `selectProps`. The `el` can be either the element itself or a function that will be called with the document and should return a stream that emits the element. Because the `domDelta` won't be mounted until the `DOMContentLoaded` event has fired or the DOM has fully loaded, providing a stream allows the query process to be deferred until the DOM is ready.

To handle custom side effects, create a custom delta. To do so, create a function that takes an options object and returns a function that takes a stream of `actions$` and `state$`. The returned function should return its own stream of `actions$` that will be piped into the store.

Similar to [`redux-observable`][red-obs], the `actions$` stream has been enhanced with the `ofType` method, which filters the stream to only emit actions of the provided types. Multiple types can be provided.

```js
import Kefir from 'kefir';
import { SUBMIT_FORM, formSubmitSuccess, formSubmitFail } from './actions';

export default function ajaxDelta({ ajax }) {
    return (actions$, state$) => actions$.ofType(SUBMIT_FORM)
        .flatMap(action => ajax.post('/api', action.payload))
        .map(formSubmitted)
        .flatMapErrors(err => Kefir.constant(formSubmitFail(err)))
}
```

Providing the ajax service through the `ajaxDelta` options object keeps the delta pure, making it easier to test that the delta functions as expected without having to mock the XMLHttpRequest object itself. The `ajax` service itself can then be isolated and tested against the mock object, reducing the amount of work done by each set of unit tests.

  [red-obs]: https://redux-observable.js.org/docs/basics/Epics.html
