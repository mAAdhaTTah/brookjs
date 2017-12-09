---
id: render
title: <code>render</code>
---

`render` provides a factory function for creating a `render$` stream. It accepts an HTML-string-returning `template` function and returns a curried function that accepts an `{Element} el` and an `{Kefir.Observable<props>} props$`, and returns a stream that emits `Effect` Observables which, when subscribed to, perform the side effect described on the `$meta`.

# How to Use

`render`'s default export is a factory function which takes a string- or vdom-returning template function:

```js
import { component, render } from 'brookjs';
import template from './template.hbs';

export default component({
    render: render(template)
});
```

This function can be used to generate a render stream:

```js
import render from './render';

const effect$$ = render(document.getElementById('app'), Kefir.constant({
    text: 'Hello world!'
}));

effect$$.observe({ value: effect$ => effect$.observe({}) });
```

When the `effect$` is observed, the side effect is run. This is handled by the `component` module and will never need to be managed by the consuming code.

## Importing Handlebars Templates

Currently, the recommendation is to use webpack with `handlebars-loader` or browserify with `hbsfy`. Both of these compile import handlebars templates to a string-returning template function. The results of this function can be passed to the brookjs-exported `render` function.

As the render process gets upgraded and optimized, this process will be moved to a brookjs loader, allowing better optimizations to the render algorithm.
