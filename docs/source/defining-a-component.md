---
id: defining-a-component
title: Defining a Component
---

A Component is defined using the `component` function provided by `brookjs`. The function takes a configuration object and returns a Component function. Remember, a Component function is one that takes an `Element` and an `Observable<props>` and returns an `Observable<Action>`.

The `component` configuration object doesn't need anything to get started. It can take an empty object.

```js
// app.js
import { component } from 'brookjs';

export default component({});
```

When called, the returned `Observable<Action>` will neither emit an action nor update its `Element`. The first lifecycle hook we'll take a look at is `onMount`. It provides a direct line into Component factory function:

```js
// app.js
import { Kefir, component } from 'brookjs';

export default component({
    onMount(/* el, props$ */) {
        return Kefir.constant({ type: 'MOUNT_APP' });
    }
});
```

This is all that is needed for a basic Component; a Component can be implemented entirely bespoke, with a completely custom control over its behavior. As long as it adheres to the contract and returns an `Observable<Action>`, it's valid.
