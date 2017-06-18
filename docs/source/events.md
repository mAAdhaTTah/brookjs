---
id: events
title: <code>events</code>
---

The `events` modules exports a factory method for declaring the behavior of an `events$` stream-generating factory. Designed to be used in the `component` module, it takes a configuration object and returns a factory function that accepts an `{Element} el` and returns an `events$` stream, as defined by the configuration object.

# How to Use

The `events` factory method takes a configuration object, with the key matching a value of a `data-attribute` and value providing a function to modify the event stream:

```js
import { events } from 'brookjs';

export default events({
    'emitClick': event$ => event$.map(e => ({ type: 'CLICK_EVENT' }))
});
```

This should be matched with an element decorated with a `data-brk-on{event}` attribute and contained within a `data-brk-container` attribute:

```html
<div data-brk-container="button">
    <button data-brk-onclick="emitClick">Click me!</button>
</div>

<!-- or placed on the same element -->

<button data-brk-container="button" data-brk-onclick="emitClick">Click me!</button>
```

Make sure, when declaring the HTML structure of a component, the top-level element has a `data-brk-container` attribute, as events are scoped by container. The emitted Event is a `ProxyEvent` around the underlying DOM `Event`. In addition to the basic `Event` properties, `ProxyEvent` provides a `decoratedTarget` (the element with the data attribute) and a `containerTarget` (the container element).

Using the factory function exported above, `events$` below will emit an action with `type: CLICK_EVENT` and no payload whenever the button is clicked:

```js
import button from './button';

const events$ = button(document.querySelector('[data-brk-container="button"]'));

events$.observe({ value: action => console.log(action) });
// { type: CLICK }

events$.emitClick.observe({ value: action => console.log(action) });
// { type: CLICK }
```

`events$` also has a property for each of the substreams that make up the merged stream, allowing the calling code to create new streams from the pieces that make up the merged stream.

## Configuration Object

The configuration object defines which `data-attribute`s map to which functions, with the value of the attribute matching the key on the object.

* `{string}` key - Event name key. Should be found in the element with the following `data-attr`: `data-brk-on{event}="{key}"`

* `{Function}` value - Event adapter function. Will be passed the `event$` stream which emits `Event` values and should return a stream.
