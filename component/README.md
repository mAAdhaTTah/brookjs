# brookjs/component

`brookjs/component` creates factory functions of `Kefir.Observable`s to manage the lifecycle of a piece of an application's UI. They are designed to mount an already rendered DOM, with the server providing the DOM and a `Kefir.Observable` of component props.

`brookjs/component` factories can be composed of subcomponent, event, and render `Kefir.Observable` returning functions, as well as a `combinator` function, and returns a combined `Kefir.Observable` of values emitted from this combination. Each of these configuration options are optional. A component that doesn't do anything may not be particularly useful, but it is possible. 

# How to Use

`brookjs/component` is a factory function for defining your custom component. 

```js
import { component } from 'brookjs';
import Kefir from 'kefir';

const events = el => Kefir.fromEvents(el, 'click')
    .map(() => ({ type: 'COMPONENT_CLICK' }));

const render = (el, props, update) => Kefir.stream(emitter => {
   let loop = requestAnimationFrame(() => {
       if (state.disabled !== update.disabled) {
           el.disabled = update.disabled;
       }

       emitter.end();
   });
   
   return () => cancelAnimationFrame(loop);
});

const subcomponents = () => Kefir.never(); // coming soon!

export default component({ events, render, subcomponents });
```

Somewhere else, mount the component to its element and subscribe to its actions:

```js
import DummyComponent from './dummy';

const { __INITIAL_STATE__ } = global;

const app = DummyComponent(el.getElementById('app'), __INITIAL_STATE__);

let sub = app.observe({ value: action => console.log(action)});
```

It is recommended to break each configuration function out into a separate module, which you then import into the main component definition. This way, each individual stream factory can be tested in isolation without needing to test the framework.

Each of these configuration options have an associated module, which exports a factory function for generating each of these functions from another set of configuration options.

* [brookjs/render](../render/README.md)
* [brookjs/events](../events/README.md)

*Note: A factory function for `subcomponents` is currently on the roadmap for v0.1.0. The API is still being defined.*

## Configuration Object

The configuration object allows you to define the behavior of your component at various points in its lifecycle. All stream generating functions provide ways of emitting values into the component stream. All of the properties of the configuration object are optional.

**All functions must be curried.** `brookjs` relies on ramda for functional programming helpers, and highly recommend using the same. The `commonjs` build will use `babel-plugin-ramda` to ensure the build is no larger than it needs to be.

* `{Function}` events - `events$` stream returning function. Called whenever the previous `render$` stream ends, passing the component element `el` and allowing the component to rebind the events to the new DOM. The previous `events$` stream get unsubscribed, so ensure all cleanup code is declared correctly.
    * Parameters:
        * `{Element}` el - Component element to bind events to.
    * Returns:
        * `Kefir.Observable<FluxStandardAction>` - Observable emitting Flux Standard Action values.
* `{Object[]}` subcomponents - Configuration for each subcomponent.
    * *Note: `subcomponents` is not finalized and subject to change before v0.1.0.*
    * `{Function}` factory - Child's Component factory function. Should generate a component instance.
    * `{Function}` adapter *(optional)* - Called with state before instance creation & render. Called with the current state. Should return the state to be passed into the given component.
    * `{string}` selector *(optional)* - Child's query string. Used to query the child's element. If not provided, will use the provided element.
    * `{Function}` preplug *(optional)* - Called with the child instance before being plugged into stream. Provides a hook to modify the stream before it's plugged into the Downstreams stream.
* `{Function}` render - `render$` stream returning function. Called whenever the props change, passing the component element `el`, the previous `props`, and `next` props.
    * Parameters:
        * `{Element}` el - Component element.
        * `{Object}` props - Previous component props.
        * `{Object}` next - Next component props.
    * Returns:
        * `Kefir.Observable<FluxStandardAction>` - Observable emitting Flux Standard. Should ends when the element is updated, allowing the events to be rebound. Can aslo simply emit the component's actions, providing an extension point for React/virtual-dom based rendering streams.

            When the next `render$` stream is generated, the previous stream is unsubscribed, so ensure all cleanup code is declared correctly.`This is a great place to cut the previous animation short when the next props tell the component to animate differently.

**Note: At this time, consider anything undocumented to be unstable until `v0.1.0`.** 

  [fsa]: https://github.com/acdlite/flux-standard-action
