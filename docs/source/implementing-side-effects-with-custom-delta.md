---
id: implementing-side-effects-with-custom-delta
title: Implementing Side Effects with Custom Delta
---

To handle custom side effects, create a custom delta. To do so, create a function that takes an options object and returns a function that takes a stream of `actions$` and `state$`. The returned function should return its own stream of `actions$` that will be piped into the store.

Similar to [`redux-observable`][red-obs], the `actions$` stream has been enhanced with the `ofType` method, which filters the stream to only emit actions of the provided types. Multiple types can be provided.

```js
import { Kefir } from 'brookjs';
import { SUBMIT_FORM, formSubmitSuccess, formSubmitFail } from './actions';

export default function ajaxDelta({ ajax }) {
    return (actions$, state$) => actions$.ofType(SUBMIT_FORM)
        .flatMap(action => ajax.post('/api', action.payload))
        .map(formSubmitted)
        .flatMapErrors(err => Kefir.constant(formSubmitFail(err)))
}
```

Providing the ajax service through the `ajaxDelta` options object keeps the delta pure, making it easier to test that the delta functions as expected without having to mock the XMLHttpRequest object itself. The `ajax` service itself can then be isolated and tested against the mock object, reducing the amount of work done by each set of unit tests.

## Note About Immediate Actions

If you need to emit an action immediately, ensure you're not doing so on the synchronous generation of the delta stream, e.g. route parsing or cookie reading usually handled on application startup. If you do, you may run into odd behavior, as the delta has not yet been fully plugged together and may result in actions either not getting dispatched properly to other deltas or even the store itself. As recommended in ["bootstrapping the application"][bootstrapping], use an "INIT" action of some kind and respond to that to handle these initial reads.

  [red-obs]: https://redux-observable.js.org/docs/basics/Epics.html
  [bootstrapping]: bootstrapping-the-application.html
