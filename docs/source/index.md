---
id: index
title: Meet <code>brookjs</code>
---

`brookjs` is framework for building functional, reactive JavaScript applications. The core of the library is built on [`kefir`][kefir] for Observables and [`ramda`][ramda] for functional utilities. No other dependencies are required, and the framework is designed to be as flexible as possible, allowing you to pick and choose which modules to use while designing them to work together seamlessly in common patterns. While not required, [`redux`][redux] is recommended for state management, with its `Symbol.observable` interop, solid developer tooling, and supportive community.

`brookjs` modules handle various aspects of an application, with the core of the library being the `component` module, handling the DOM lifecycle, and the `observeDelta` middleware, which provides an Observable-based managing side effects. Additional modules provide support for other application functionality.

  [kefir]: http://rpominov.github.io/kefir/
  [ramda]: http://ramdajs.com/
  [redux]: http://redux.js.org/
