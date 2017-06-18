---
id: render
title: <code>render</code>
---

`render` provides a factory function for creating a `render$` stream. It accepts an HTML-string-returning `template` function and returns a curried function that accepts an `{Element} el` and an `{Kefir.Observable<props>} props$`, and returns a stream that emits no actions and ends after the element is updated to match the return value of the `template` function.

# How to Use

`render`'s default export is a factory function which takes a string-returning template function:

```js
import { render } from 'brookjs';
import template from './template.hbs';

export default render(template);
```

This function can be used to generate a render stream:

```js
import render from './render';

const render$ = render(document.getElementById('app'), Kefir.constant({
    text: 'Hello world!'
}));

render$.observe({ end: () => console.log('Element updated') });
```

When the `render$` stream is observed, the element will be updated on every `props`, scheduling an update for the next `requestAnimationFrame`.

## Importing Handlebars Templates

Currently, the recommendation is to use webpack with `handlebars-loader` or browserify with `hbsfy`. Both of these compile import handlebars templates to a string-returning template function. The results of this function can be passed to the brookjs-exported `render` function.

As the render process gets upgraded and optimized, this process will be moved to a brookjs loader, allowing better optimizations to the render algorithm.
