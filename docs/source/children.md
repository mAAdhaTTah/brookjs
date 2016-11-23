---
id: children
title: <code>children</code>
---

`children` exports a function for plugging child components into a single, combined stream. It keeps the stream updated when components are added or removed using a `MutationObserver`, so if support for old environments is required, use a polyfill.

# How to Use

*Editor's Note: This whole process currently has to be handled manually, and is really the weakest part of the framework right now, as it's a really easy place to get things wrong. This will eventually be solved by handling this complexity with Handlebars-based templating.*

## Preparing the DOM

When setting up the HTML for a component, the top-level element should have a `data-brk-container` with a unique name.

```html
<div data-brk-container="kid">{{text}}</div>
```

A helper is provided to make this easy to integrate with handlebars:

```handlebars
<div {{container "kid"}}>{{text}}</div>
```

This needs to be registered with the Handlebars runtime:

```js
import { containerAttribute } from 'brookjs/hlepers'
import Handlebars from 'handlebars/runtime';

Handlebars.registerHelper('container', containerAttribute);
```

The compiled templates will now provide the required container attribute through the helper.

## Configuring the Stream

The `children` stream accepts a configuration object. The object's keys should match the container attribute for the given component. The value can be either a component factory function:

```js
import children from 'brookjs/children';
import kid from './kid';

export default children({ kid });
```

or a configuration object for that component, which defines the behavior of the child in relation to the parent:

```js
import children from 'brookjs/children';
import { mapActionTo } from 'brookjs/helpers';
import key from './key';

export default children({
    kid: {
        // only required value.
        // factory function for child taking el & props$
        factory: kid,
        // passed parents' `props$` stream.
        // return value is passed to child factory.
        modifyChildProps: props$ => props$.map(mapToChildProps),
        // passed each child instance to modify child stream
        // return value is plugged into combined string (hence `preplug`)
        preplug: kid$ => kid$.map(mapActionTo(CHILD_ACTION, PARENT_ACTION)),
        // optional; used to differentiate between multiple child instances
        // see below for details
        key: 'id'
    }
});
```

## Handling Multiple Child Instances

*Editor's Note: Yes, this needs to be simplified.*

If a single component will have multiple instances of a child component as a direct child, those instances must be differentiated, like in an iterated list. The `key` property ensures the child component gets the correct props from its parent.

First, an iterated child must have a `data-brk-key` attribute:

```handlebars
<div data-brk-container="child" data-brk-key="{{kidKey}}"></div>
```

In the parent, when rendering, pass in a key through Handlebars' partial properties:

```handlebars
<div data-brk-container="parent">
    {{#each kids}}
        {{> kid kidKey=this.id}}
    {{/each}}
</div>
```

Then, in the `children` stream, ensure the `props$` stream returned from `modifyChildProps` emits an `Array<childProps>`. The `children` factory will use the value provided for `key` to search the array for the matching object, whose `data-brk-key` matches `childProps[key]`.
