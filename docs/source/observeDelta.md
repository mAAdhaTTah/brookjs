---
id: observeDelta
title: <code>observeDelta</code>
---

`observeDelta` is a Redux middleware for binding a set of delta source streams to a Redux store.

When the middleware gets applied, each source function will be called with two parameters: `actions$` and `state$`. These are `Kefir.Observable`s, with the `actions$` stream emitting every action dispatched through the application, and the `state$` emitting each new state after each action. Each source function should return a Kefir stream, which are combined into a `delta$` stream that emits actions into the Redux store.

Specifically, `state$` is a `Kefir.Property`, which means it retains its current value when it gets subscribed to. Additionally, note that the `state$` will have its value emitted before the `action$`, ensuring that any combination of the stream will have the latest state when the action is emitted.

# Example

An example `source$` stream:

```js
import { Kefir } from 'brookjs';

export default function exampleSourceStream(actions$, state$) {
    const save$ = actions$.filter(action => action.type === 'SAVE_THING');

    return save$.flatMap(action => {
        const request = fetch('some/url', {
            type: 'POST',
            body: JSON.stringify(action.payload)
        });

        return Kefir.fromPromise(request)
            .map(response => ({
                type: 'THING_SAVED',
                payload: response
            }));
    });
}
```

Applying the middleware with the example:

```js
import { applyMiddleware, createStore } from 'redux';
import { observeDelta } from 'brookjs'
import reducer from './reducer';
import exampleSourceStream from './example'

const store = createStore(reducer, applyMiddleware(observeDelta(exampleSourceStream)));

store.dispatch({ type: 'SAVE_THING', payload: { id: 1, name: 'The Thing to save' } });
```

If you need to get the state on every action, use `sampledBy`:

```js
import { Kefir } from 'brookjs';

export default function exampleSourceStream(actions$, state$) {
    const save$ = actions$.filter(action => action.type === 'SAVE_USER_BUTTON_CLICK');

    return state$.sampledBy(save$).flatMap(state => {
        const request = fetch('/api/user', {
            type: 'POST',
            body: JSON.stringify(state.user)
        });

        return Kefir.fromPromise(request)
            .map(response => ({
                type: 'USER_SAVED',
                payload: response
            }));
    });
}
```
