---
id: using-a-template-to-render-a-component
title: Using a Template to <code>render</code> a Component
---

Now that a Component is emitting events, it needs to update the `Element` it's mounted to keep it in sync with the `Observable<props>`.  The `render` modules provides an interface for generating a render stream for a Component using a string-returning template function. This allows `brookjs` the flexibility the change, update, or swap out the underlying render implementation.

`brookjs` uses [`diffhtml`][diffhtml] to update the element from an HTML string, configured to take advantage of `brookjs`' custom attributes, allowing a Component to rely on any standard templating language to render itself. Assuming a bundler like [`webpack`][webpack] can import a string-returning Handlebars template function, pass it to `render`:

```js
// app.js
import { Kefir, component, events, render } from 'brookjs';
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

Note that `render` is responsible for the entire element it's provided, meaning [children components][children] do not explicitly use the templates passed to them but instead should be rendered as partials in the parent component. Use the templating language's rendering context to ensure each subcomponent has access to the props it needs to render properly. Using Handlebars, simple logic can be encoded into helpers, but avoid encoding too much logic into the template itself.

If a section of the DOM needs to be hidden from `diffhtml`, add `data-brk-blackbox="uniqueName"` as a data-attribute to the element. When `diffhtml` goes to update the DOM, any elements with that attribute will not be updated. A unique name is required in order to ensure the element isn't removed from the DOM. Make sure the element with the matching blackbox attribute is included in the rendered template or the element will get removed. We'll see later how to use this to implement custom component logic.

## Note about Handlebars

While currently, any string-returning template function can be used here, Handlebars is recommended as the preferred templating language. Helpers for non-JavaScript implemetations for `brookjs` is on the roadmap, aiding in server-side rendering in non-JavaScript back-ends. Both [Java][hbs.java] & [PHP][lightncandy] have fast and feature-complete implementations of Handlebars. Additionally, string-based template rendering is not long-term sustainable for performance reasons, so the Handlebars compilation step will eventually be replaced.

Feel free to use alternative templating languages, should you prefer them, but be aware that migration from said templating language to Handlebars may be required in the future. A migration path will be provided, as both string-based templating & an alternative method will be supported at the same time.

  [webpack]: https://webpack.js.org/
  [diffhtml]: https://github.com/tbranyen/diffhtml
  [children]: managing-children-components-in-a-component.html
  [hbs.java]: https://jknack.github.io/handlebars.java/
  [lightncandy]: https://github.com/zordius/lightncandy
