---
id: what-is-a-component
title: What is a Component?
---

In simple terms, a Component in `brookjs` is a function that accepts an `Element` and an `Observable<props>` for that element and returns an `Observable<Action>`. `brookjs` is designed to be paired with [`redux`][redux], and Component actions can be streamed into a `redux` Store, with the Store's State streamed back into the Component as its `props`.

A `brookjs` Component can be paired with a `redux` Store with the following glue code (we'll see later how this gets wired up in a full-fledged application):

```js
import { createStore } from 'redux';
import { Kefir } from 'brookjs';
import reducer from './reducer';
// view is a brookjs Component
import view from './view';

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(reducer);
    const props$ = Kefir.fromESObservable(store).toProperty(store.getState);

    const view$ = view(document.getElementById('app'), props$);

    const sub = view$.observe({ value: store.dispatch });
});
```

This is the basic idea behind `brookjs`: the best way to manage the lifecycle of an app is through to use of Observables. `brookjs` Components are defined through a set of lifecycle hooks, providing direct access to the underlying Observables to control how a Component behaves.

This tutorial will go through how to configure and modify the component through `brookjs`'s modules and the hooks they provide.

  [redux]: http://redux.js.org/
