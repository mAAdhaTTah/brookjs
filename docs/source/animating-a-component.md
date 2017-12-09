---
id: animating-a-component
title: Animating a Component
---

The animation API is the most complex aspect of `brookjs` but provides a lot of control and power over the fine details of how it handles its render logic. The second parameter passed to `render` is an animation callback. This callback is passed a stream of `effect$$`, which emits "effect" observables which represent the render side effect to take place. For example, a stream could emit an effect that represents a DOM node being inserted or removed from the DOM, or an attribute on a node changing. When observed, the side effect is run.

This `$meta` information can be used to control when particular effects are run, how long they're run, and what else happens before and after they run, allowing you to design and implement cancelable animations. This could be done as follows:

```js
import { component, render, Kefir } from 'brookjs';
import { hideElement, fadeInElement } from './effects';

export default component({
    render: render(template, effect$$ => effect$$.map(effect$ => {
        if (effect$.$meta.type === 'INSERT_NODE') {
            const { incoming } =  effect.$meta;

            return Kefir.concat([
                hideElement(incoming),
                effect$,
                fadeInElement(incoming)
            ])
                .takeUntilBy(
                    effect$$.filter(effect$ => effect$.$meta.outgoing === incoming)
                )
        }
    }))
})
```

Assuming `hideElement` & `fadeInElement` return observables that perform the expected side effect, this will fade in the incoming element, cancelling the animation of the incoming element is removed from the DOM.

Note also that the `effect$$` is `mapped` over. This will be your primary method for interacting with `effect$$`. **Do not** displace effects in time, e.g. `effect$$.delay`. Schedule effects for the future by replacing them with new effects that run later instead. Use `Kefir.later` and `flatMap` to achieve this. This is because the rendering engine needs to gather the effects before running them, and if they're not gathered at the same time, effects may not be run at the time expected.
