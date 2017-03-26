---
id: using-a-template-to-render-a-component
title: Using a Template to <code>render</code> a Component
---

Now that a Component is emitting events, it needs to update the `Element` it's mounted to keep it in sync with the `Observable<props>`.  The `render` modules provides a interface for generating a render stream for a Component using a string-returning template function. This allows `brookjs` the flexibility the change, update, or swap out the underlying render implementation.

**Note: Any custom render implementations for a Component must use `onMount`, not `render`, as the API for `render` is subject to change.** Use the `render` module to ensure compatibility with future `brookjs` versions.

`brookjs` uses [`morphdom`][morphdom] to update the element from an HTML string, configured to take advantage of `brookjs`' custom attributes, allowing a Component to rely on Handlebars to render itself. Using a bundler like [`webpack`][webpack] and [`handlebars-loader`][hbs-loader] or [`browserify`][browserify] and [`hbsfy`][hbsfy], compile Handlebars imports to a Handlebars template function. Import that function into the Component module and pass it to `render`:

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

For now, that's it! Now the Component's element will rerender on the next value from the Component's `Observable<props>`. The provided template function gets called with the emitted `props`, and `morpdom` uses the returned HTML to update the element.

Note that `render` is responsible for the entire element it's provided. Use the Handlebars rendering context to ensure each subcomponent has access to the props it needs to render properly, and any logic should be encoded in Handlebars helpers.

If a section of the DOM needs to be hidden from `morpdom`, add `data-brk-blackbox="uniqueName"` as a data-attribute to the element. When `morpdom` goes to update the DOM, any elements with that attribute will not be updated. A unique name is required in order to ensure the element isn't removed from the DOM. Make sure the element with the matching blackbox attribute is included in the rendered template or the element will get removed.


  [webpack]: https://webpack.js.org/
  [hbs-loader]: https://github.com/pcardune/handlebars-loader
  [browserify]: http://browserify.org/
  [morphdom]: https://github.com/patrick-steele-idem/morphdom
  [hbsfy]: https://github.com/epeli/node-hbsfy
