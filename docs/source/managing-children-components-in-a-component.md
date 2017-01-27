---
id: managing-children-components-in-a-component
title: Managing <code>children</code> Components in a Component
---

A Component should encapsulate a specific piece of functionality, making it easy to reuse them in other Components. The `children` module handles this functionality, managing the creation of child components and plugging their streams into the parent. It uses the child component's `data-brk-container` attribute to mount the component when it gets rendered into the DOM.

The `children` function accepts multiple configurations, depending on how much customization the component requires. The simplest configuration maps a child's `data-brk-container` attribute to its Component factory function. Given a child that looks like this:

```html
<button data-brk-container="button">Click me</button>
```

A parent component would mount the component like this:

```js
import { component, children } from 'brookjs';
import button from './button';

export default component({
    children: children({
        button: button
    })
});
```

When the component gets mounted, `children` calls the factory function with the child's element and the parent's `props$` stream. This works ideally if the child component doesn't need any custom props or behavior and the default events emitted by the component work fine.

However, most of the time, more customization will be required. `children` offers a number hooks to modify the way the child and parent are bound. The first is `modifyChildProps`, which gets called with the parent's `props$` stream and the child's `data-brk-key` attribute value, if present. The returned stream gets passed, along with the child's element, into the factory function, defined on `factory`:

```js
import { component, children } from 'brookjs';
import button from './button';

export default component({
    children: children({
        button: {
            factory: button,
            modifyChildProps: (props$, key) => props$.map(mapToChildProps)
        }
    })
});
```

Additionally, `preplug` provides access to the child `instance$` before it gets plugged into the parent, allowing it to by modified before it gets plugged into the parent stream. This is most commonly used to map a child's more generic actions to its contextual actions:

```js
import { component, children } from 'brookjs';
import button from './button';

export default component({
    children: children({
        button: {
            factory: button,
            modifyChildProps: (props$, key) => props$.map(mapToChildProps),
            preplug: (child$, key) => child$.map(action => {
                if (action.type === 'CLICK') {
                    action = Object.assign({}, action, { type: 'SUBMIT_CLICK'});
                }

                return action;
            })
        }
    })
});
```

## A Note About the `data-brk-key` Attribute

If a Component is going to be iterated over in a parent, the `data-brk-key` attribute is recommended for both performance and disambiguation reasons. If the child element doesn't have the attribute, the above two functions will be called with `null` as the key. The attribute is not required, but the `modifyChildProps` function otherwise has no way to modify the values emitted from child's `props$`. If there is only one instance of that child type, this isn't a problem, but multiple children need to be distinguished in order to provide the appropriate props.

The value of the attribute should be unique amongst children of the same type in a parent Component. The `render` module also uses this to reuse a Component when it's been moved to a new location but is otherwise the same instance. Rendering a Component with multiple children that share both a type and a key will result in unexpected behavior.
