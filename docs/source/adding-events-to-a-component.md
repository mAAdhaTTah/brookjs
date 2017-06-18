---
id: adding-events-to-a-component
title: Adding <code>events</code> to a Component
---

Events on a `brookjs` component get defined with a combination of HTML attributes and a configuration object. This configuration object holds the functions that generate the `Observable<Action>` of the `events$` stream.

First, define the attribute on the HTML:

```html
<button data-brk-container="button"
        data-brk-key="1"
        data-brk-onclick="onButtonClick">
    Click Me
</button>
```

Using Handlebars:

```html
<button {{container "button"}}
        {{#if id}}{{key id}}{{/if}}
        {{event "click" "onButtonClick"}}>
    Click Me
</button>
```

Register the helper with the Handlebars runtime like this:

```js
import { eventAttribute } from 'brookjs'
import Handlebars from 'handlebars/runtime';

Handlebars.registerHelper('event', (event, key) =>
  new Handlebars.SafeString(eventAttribute(event, key))
);
```

Use the `events` module to declare the events on the Component:

```js
// app.js
import { Kefir, component, events } from 'brookjs';

export default component({
    onMount(/* el, props$ */) {
        return Kefir.constant({ type: 'MOUNT_APP' });
    },
    events: events({
        onButtonClick: event$ => event$.map((/* event */) => ({
            type: 'BUTTON_CLICK'
        }))
    })
});
```

`event$` is an `Observable<ProxyEvent>`, emitting a normalized wrapper around the browser's `Event`. In addition to the `Event` properties, the emitted `ProxyEvent` has two `brookjs`-specific properties: `decoratedTarget` (the element with the event attribute) and `containerTarget` (the container element for the event). This provides access to the DOM as required to pull additional information out for the event object.

The stream gets merged with the main Component stream, so the returned stream needs to be an `Observable<Action>`.

The events are bound with event delegation, requiring a single listener at the top of the DOM, and using the `data-brk-container` attribute to scope the event to its proper Component instance.

This also allows for control over the rate at which events are emitted, using `debounce` or `throttle`:

```js
// app.js
import { Kefir, component, events } from 'brookjs';

export default component({
    onMount(/* el, props$ */) {
        return Kefir.constant({ type: 'MOUNT_APP' });
    },
    events: events({
        onTyping: event$ => event$.debounce(250).map(event => ({
            type: 'TYPING',
            payload: {
                value: event.target.value
            }
        }))
    })
});
```
