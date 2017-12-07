---
id: helpers
title: Helpers
---

The helpers module isn't a separate module but a collection of functions to assist with common tasks in `brookjs`.

## `mapActionTo` {Function}

`mapActionTo` is a simple function designed to simplify the process of mapping child events to its parent's events. It modifies the action's `type` and maintains the previous source in the Action's `meta`.

```js
import { mapActionTo } from 'brookjs';

const child = {
    type: 'CHILD',
    payload: { value: true }
};

const parent = mapActionTo('CHILD', 'PARENT', child);

assert.deepEqual(parent, {
    type: 'PARENT',
    payload: { value: true },
    meta: { sources: ['CHILD'] }
});
```

If the source action doesn't match, the action is returned:

```js
import { mapActionTo } from 'brookjs';

const child = {
    type: 'OTHER_CHILD',
    payload: { value: true }
};

const parent = mapActionTo('CHILD', 'PARENT', child);

assert(parent === child);
```

This function is curried, so it can be used to map child events to their parent's actions using preplug:

```js
export default component({
    children: children({
        child: {
          factory: ChildComponent,
          preplug: instance$ => instance$.map(mapActionTo('CHILD', 'PARENT'))
        }
    })
});
```

### Parameters

* {string} source - Action type to modify.
* {string} dest - Action type to map.
* {Action} action - Action to modify.

### Returns

* {Action} Modified action if `type` matches, original action if it doesn't.
