# brook-component

A `brook-component` describes the state and lifecycle of a piece of an application's UI. brook components are designed to mount an already rendered DOM, with the server providing the DOM and initial page state for a component to mount.

A brook component can be composed of smaller subcomponents, and returns a `Kefir.Observable` with a `render` function. When events are emitted from the DOM, the event objects are propagated down the stream. When the calling code wants to modify the component, it should call the component's `render` function with the updated `state`.

## Creating a Component

`brook-component` exports a curried function for defining your custom component.

```js
import Component from '../framework/component';

const DummyComponent = Component({
    events: {},
    children: [],
    render: function render(el, state, update) {}
});

export default DummyComponent;
```

### Configuration Options

All configuration options are technically optional, but they define the behavior of your component.

* `{Object}` events - Events hash with key & adapter `function`.
    * `{string}` key - Event name key. Should be found in the element with the following `data-attr`: `data-brk-event="{type}:{key}"`

        ```html
        <button data-brk-event="click:onClick">Click me!</button>
        ```

        The above HTML be mapped to this key:

        ```js
        events: {
            onClick: onClickAdapter
        }
        ```

    * `{Function}` value - Event adapter function. Will be passed the Event object and should return a [Flux Standard Action][fsa] representing the event.

        In the above example, `onClickAdapter` could look something like this:

        ```js
        const CLICK_EVENT = 'CLICK_EVENT';

        function onClickAdapter(ev) {
            return {
                type: CLICK_EVENT,
            };
        }
        ```

        See below for the adapters that come with `brook-component`.

* `{Object[]}` subcomponents - Configuration for each subcomponent.
    * `{Function}` factory - Child's Component factory function. Should generate a component instance.
    * `{Function}` adapter *(optional)* - Called with state before instance creation & render. Called with the current state. Should return the state to be passed into the given component.
    * `{string}` selector *(optional)* - Child's query string. Used to query the child's element. If not provided, will use the provided element.
    * `{Function}` preplug *(optional)* - Called with the child instance before being plugged into stream. Provides a hook to modify the stream before it's plugged into the Downstreams stream.
* `{Function}` render - Update the component's element on state change. Passed the element, the current state, and the updated state:
    ```js
    render: function render(el, state, update) {
        if (state.disabled !== update.disabled) {
            el.disabled = update.disabled;
        }
    }
    ```

## Event Adapters

`brook-component` comes with two Event Adapters and their corresponding event constants.

* **VALUE_CHANGE**
    * Used when the element emits a value. Automatically fetches the element's value and emits a `VALUE_CHANGE` action with a `value` key on the `payload`.
* **CHECKED_CHANGE**
    * Used when the element emits a checked boolean. Fetches whether the element is checked and emits a `CHECKED_CHANGE` action with a `checked` key on the `payload`.

### Example

```js
import { valueEvent } from '../framework/component/event';

// Exporting this so the consuming code can access directly.
export { VALUE_CHANGE } from '../framework/component/event';

const ValueComponent = Component({
    events: {
        onInput: valueEvent
    }
});

export default ValueComponent;
```

  [fsa]: https://github.com/acdlite/flux-standard-action
