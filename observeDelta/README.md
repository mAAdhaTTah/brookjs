# observeDelta

`observeDelta` is a Redux enhancer similar to the built-in `applyMiddleware`. Like `applyMiddleware`, `observeDelta` takes a varying number of source functions and returns a StoreEnhancer, wrapping Redux's `createStore` function.

When the store gets created, each source function will be called with two parameters: `actions$` and `state$`. These are Kefir streams, with the `actions$` stream emitting every action dispatched into the Store, and the `state$` emitting each new state after it changes. Each source function should return a Kefir stream. These `source$` streams are combined into a `delta$` stream with its values emitted into the Redux store.

Note that, unlike middleware, the actions will be emitted into `actions$` after the store's state has been updated. If you need to manipulate actions before they reach the Store's reducer, use middleware.

# Example

An example `source$` stream:

```js
import Kefir from 'kefir';

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

Applying the enhancer with the example:

```js
import { createStore } from 'redux';
import { observeDelta } from 'brookjs'
import reducer from './reducer';
import exampleSourceStream from './example'

const store = createStore(reducer, observeDelta(exampleSourceStream));

store.dispatch({ type: 'SAVE_THING', payload: { id: 1, name: 'The Thing to save' } });
```
