---
id: writing-a-components-html
title: Writing a Component's HTML
---

A Component's HTML does need to be defined with care. The first thing to note is the element root needs to be decorated with the "Container Attribute": `data-brk-container`. The container attribute is responsible for scoping `brookjs`' events, so it's important to ensure the attribute is placed on top of the element. This should be given a unique and easy-to-reference name.

Here's how this HTML could look:

```handlebars
<button data-brk-container="button">Click Me</button>
```

This could be rendered by any given templating language; `brookjs` recommends the uses [Mustache][mstc] / [Handlebars][hbs] throughout this tutorial, because there are a number of cross-platform implementations of these templating languages. Additionally, future optimizations to the rendering pipeline will assume a Handlebars context.

In the above case, a Handlebars helper can be used to render the container attribute:

```handlebars
<button {{container "button"}}>Click Me</button>
```

If a component will be rendered as part of a list or otherwise iterated over, a `data-brk-key` attribute should also be used.

```handlebars
<button data-brk-container="button"
        data-brk-key="1">
    Click Me
</button>
```

Using handlebars, this attribute can be displayed conditionally:

```handlebars
<button {{container "button"}}
        {{#if id}}{{key id}}{{/if}}>
    Click Me
</button>
```

Both of these helpers can be registered with the Handlebars runtime:

```js
import { containerAttribute, keyAttribute } from 'brookjs'
import Handlebars from 'handlebars/runtime';

Handlebars.registerHelper('container', key => new Handlebars.SafeString(containerAttribute(key)));
Handlebars.registerHelper('key', key => new Handlebars.SafeString(keyAttribute(key)));
```

Helpers for other Handlebars implementations are on the roadmap.

  [hbs]: http://handlebarsjs.com/
  [mstc]: http://mustache.github.io/
