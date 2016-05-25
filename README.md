# brook framework stubs

These are elements which wrap shared functionality in the codebase into a common structure. These pieces will eventually be extracted into their own framework.

## `createEvent`

This function takes an event type string and return an `Event` object. The `Event` object is just the built-in DOM Event object. The `createEvent` function provides a simple, cross-browser solution to event object creation.

## `Downstreams`

This is a curried function which accepts a `children` definition array, an Element `el`, and the current page `state` and returns a component. This component is a stream of all of the events coming out of the children plus a single render method, which renders all of its children.

The `children` definition array takes an array of objects. These objects provide a declarative interface for describing the children of a given component. Each of these definition objects takes these parameters:

| Parameter | Type     | Optional? | Purpose                                                                                                                                                |
|-----------|----------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| adapter   | Function | Yes       | Called with state before instance creation & render. Called with the current state. Should return the state to be passed into the given component.     |
| factory   | Function | No        | Child's Component factory function. Should generate a component instance.                                                                              |
| selector  | string   | Yes       | Child's query string. Used to query the child's element. If not provided, will use the provided element.                                               |
| preplug   | Function | Yes       | Called with the child instance before being plugged into stream. Provides a hook to modify the stream before it's plugged into the Downstreams stream. |
