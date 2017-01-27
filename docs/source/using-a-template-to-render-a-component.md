---
id: using-a-template-to-render-a-component
title: Using a Template to <code>render</code> a Component
---

Now that a Component is emitting events, it needs to update the `Element` it's mounted to keep it in sync with the `Observable<props>`.  The `render` modules provides a interface for generating a render stream for a Component using a string-returning template function. This allows `brookjs` the flexibility the change, update, or swap out the underlying render implementation.

**Note: Any custom render implementations for a Component must use `onMount`, not `render`, as the API for `render` is subject to change.** Use the `render` module to ensure compatibility with future `brookjs` versions.

`brookjs` uses [`morphdom`][morphdom] to update the element from an HTML string, configured to take advantage of `brookjs`' custom attributes, allowing the Component to rely on Handlebars to render itself. Using a bundler like [`webpack`][webpack] and [`handlebars-loader`][hbs-loader] or [`browserify`][browserify] and [`hbsfy`][hbsfy], compile Handlebars imports to a Handlebars template function. Import that function into the Component module and pass it to `render`:

```js
// app.js
import Kefir from 'kefir';
import { component, events, render } from 'brookjs';
import template from './index.hbs';

export default component({
    onMount(/* el, props$ */) {
        return Kefir.constant({ type: 'MOUNT_APP' });
    },
    events: events({
        onButtonClick: event$ => event$.map((/* event */) => ({
            type: 'BUTTON_CLICK'
        }))
    }),
    render: render(template)
});
```

For now, that's it! Now the Component's element will rerender on the next value from the Component's `Observable<props>`. The provided template function gets called with the emitted `props`, and `morphdom` uses the returned HTML to update the element.

Note that `render` uses the `data-brk-container` attribute to determine the Component's boundary. This means it's important to ensure each Component has that attribute on its containing element, allowing an individual Component to render itself while parents ensure the node is still present and the same instance (as with iterated children).

Using the attribute also provides the benefit of allowing a Component to blackbox sections of itself that it know won't update by decorating it with the `data-brk-container` attribute. This way, morphdom will not descend into those sections of the DOM to reconcile with the provided template string.

## Roadmap

This modules needs to provide two lifecycle hooks is does not: running an Observable before or after `render` reconciles the DOM (a la `component{Will|Did}Update` in React), as well as before or after it adds or removes nodes during the reconciliation process, providing a easy-to-use abstraction over animating transitions in an application. Observables make it easy to compose complex animations as well as cancel them as new `props` flow into the Component. This is the vision for the `render` module.

  [morphdom]: https://github.com/patrick-steele-idem/morphdom
  [webpack]: https://webpack.js.org/
  [hbs-loader]: https://github.com/pcardune/handlebars-loader
  [browserify]: http://browserify.org/
  [hbsfy]: https://github.com/epeli/node-hbsfy
