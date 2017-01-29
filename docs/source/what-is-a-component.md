---
id: what-is-a-component
title: What is a Component?
---

In simple terms, a Component in `brookjs` is a function that accepts an `Element` and a `Observable<props>` for that element and returns a `Observable<Action>`. `brookjs` is designed to be paired with [`redux`][redux], and Components can be streamed into a `redux` Store, with the Store's State streamed into the Component as its `props`.

A `brookjs` Component can be paired with a `redux` Store with the following glue code:

```js
import { createStore } from 'redux';
import Kefir from 'kefir';
import reducer from './reducer';
// app is a brookjs Component
import app from './app';

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(reducer);
    const props$ = Kefir.fromESObservable(store).toProperty(store.getState);

    const view$ = app(document.getElementById('app'), props$);

    const sub = view$.observe({ value: store.dispatch });
});
```

This is the basic idea behind `brookjs`: the best way to manage the lifecycle of an app is through to use of Observables. `brookjs` Components are defined through a set of lifecycle hooks, providing direct access to the underlying Observables to control how a Component behaves.

This tutorial will go through how to configure and modify the component through `brookjs`'s modules and the hooks they provide.

  [redux]: http://redux.js.org/
