# brookjs/events

`brookjs/events` provides a factory function for generating `events$` stream factories for use in `brookjs/component`. It takes a configuration object and returns a function that accepts an `{Element} el` and returns an `events$` stream, as defined by the configuration object.

In addition, `brookjs/events` exposes some helper functions and constants for use in defining events in the configuration object.

# How to Use

`brookjs/events` exports a factory function for defining your `events$` stream.

```js
import { events } from 'brookjs';

export default events({
    'emitClick': event$ => event$.map(() => ({ type: 'CLICK_EVENT' }))
});
```

This should be an element decorated with a `data-brk-on{event}` attribute and contained within a `data-brk-container` attribute:

```html
<div data-brk-container="button">
    <button data-brk-onclick="emitClick">Click me!</button>
</div>

<!-- or placed on the same element -->

<button data-brk-container="button" data-brk-onclick="emitClick">Click me!</button>
```

This `event$` stream generated will emit an action with `type: CLICK_EVENT` and no payload:

```js
import button from './button';

const events$ = button(document.querySelector('[data-brk-container="button"]'));

events$.observe({ value: action => console.log(action) });
// { type: CLICK }

events$.emitClick.observe({ value: action => console.log(action) });
// { type: CLICK }
```

It also has a property for each of the substreams that make up the merged stream, allowing the calling code to create new streams from the pieces that make up the merged stream.

## Configuration Object

The configuration object defines which `data-attribute`s map to which functions, with the value of the attribute matching the key on the object.

* `{string}` key - Event name key. Should be found in the element with the following `data-attr`: `data-brk-on{event}="{key}"`

* `{Function}` value - Event adapter function. Will be passed the `event$` stream which emits `Event` values and should return new stream emitting [Flux Standard Action][fsa] representing the event.
