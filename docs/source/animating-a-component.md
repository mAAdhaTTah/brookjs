---
id: animating-a-component
title: Animating a Component
---

`brookjs` provides lifecycle hooks for managing the changes that can take place on a component. Enable those hooks by adding a data attribute to the element you want to animate in your component's HTML:

```handlebars
<div data-brk-container="parent">
    <ul>
        {{#each option}}
            <li data-brk-animate="listItem" class="{{class}}">{{text}}</li>
        {{/each}}
    </ul>
</div>
```

Now, the `li` element can be animated by passing in a configuration object as the second parameter to the render function:

```js
import { component, render } from 'brookjs';
import template from './index.hbs';

export default component({
    render: render(template, {
        listItem: {
            attached: (effect$, { container, parent, target }) => effect$,
            detached: (effect$, { container, parent, target }) => effect$,
            replaced: (effect$, { container, parent, incoming, outgoing }) => effect$,
            attributechanged: effect$ => effect$,
            textchanged: effect$ => effect$
        }
    })
});
```

When the given event occurs, the corresponding function receives an Observable, representing the side effect about to take place, and an optional `meta` object, which holds information about the side effect. The callback can wrap the provided effect and return a new Observable, allowing DOM modifications to the element both before and after the change takes place.

Note that the attached & detached lifecycle hooks run before a corresponding replace hook, and the `effect$` Observable passed to replace is the result of merging the effects returned by attached and detached.
