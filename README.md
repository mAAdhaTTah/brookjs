# brook framework stubs

These are elements which wrap shared functionality in the codebase into a common structure. These pieces will eventually be extracted into their own framework.

## `createEvent`

This function takes an event type string and return an `Event` object. The `Event` object is just the built-in DOM Event object. The `createEvent` function provides a simple, cross-browser solution to event object creation.
