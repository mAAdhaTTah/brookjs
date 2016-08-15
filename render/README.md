#brookjs/render

`brookjs/render` provides a factory function for creating `render$` stream generator functions. It accepts an HTML-string-returning `template` function and returns a curried function that accepts an `{Element} el`, the previous `props`, and the `next` props and returns a stream that emits no actions and ends after the element is updated to match the return value of the `template` function.

# How to Use

`brookjs/render` exports a factory function to pass in your template function:

```js
import { render } from 'brookjs';
import template from './template.hbs';

export default render(template);
```

Later on, this function can be called to update the element provided to it:

```js
import appRender from './render'

const props = { disabled: true };
const next = { disabled: false };

const render$ = appRender(document.getElementById('app'), props, next);

let sub = render$.observe({ end: () => console.log('Element updated') });
```

When the `render$` is observed, the element update is scheduled for the next `requestAnimationFrame`. If the observation is unsubscribed before that frame fires, the update is unscheduled. Otherwise, the stream will end after the element is updated.
