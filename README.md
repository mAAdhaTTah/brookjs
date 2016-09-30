# `brookjs`

[![Build Status](https://travis-ci.org/valtech-nyc/brookjs.svg?branch=master)](https://travis-ci.org/valtech-nyc/brookjs)

**Note: Early alpha. Expect breaking changes before version 0.1.0. See [semver](#semver) policy below.**

`brookjs` is framework for building functional, reactive JavaScript applications. The core of the library is built on [`kefir`][kefir] for Observables and [`ramda`][ramda] as a utility library. Everything else is designed to be as flexible as possible, allowing you to pick and choose which modules to use while designing them to work together seamlessly with common patterns. While not required, [`redux`][redux] is recommended for data management, with its `Symbol.observable` interop and significant community.

`brookjs` modules handle various aspects of an application, with the core of the library being the `component`, which handles the UI lifecycle, and the `observeDelta` Redux enhancer, which provides an observable-based hook for responding to state changes and actions and emitting new events into your Redux store. Additional components provide support for other necessary application functionality.

# How to Use

This section will be filled out after v0.1.0. For now, see "Using the Uncompiled Source" below.

# Using the Uncompiled Source

For now, `brookjs` is currently distributed as ES6 modules with ES6 features, so if you're using it, you'll need to include a build step with [`webpack`][webpack] or [`browserify`][browserify] and ensure the [`babel`][babel] configuration converts `brookjs` modules. In addition, `brookjs` takes advantage of some ES6 features that may require polyfills or babel transforms to work in older environments:

* `WeakMap`
* `Object.assign`
* `Array.from`

A distribution version will be provided with v0.1.0 which will include these transforms.

You can still install from github with npm:

```js
npm install --save valtech-nyc/brookjs#commitsha
```

Be sure the grab the latest commit sha from GitHub.

# Modules

* [combineActionReducers][] - Action-based state transitions.
* [component][] - Declarative UI lifecycle management.
* [observeDelta][] - Redux enhancer for streaming side effects.
* [util][] - Utility functions for standard patterns.

# Semver

`brookjs` modules adhere to [semver][]. However, as this hasn't been released on npm yet, expect breaking changes before `v0.1.0` and the first public release.

  [kefir]: http://rpominov.github.io/kefir/
  [ramda]: http://ramdajs.com/
  [redux]: http://redux.js.org/
  [combineActionReducers]: combineActionReducers/README.md
  [component]: component/README.md
  [observeDelta]: observeDelta/README.md
  [util]: util/README.md
  [webpack]: https://webpack.github.io/
  [browserify]: http://browserify.org/
  [babel]: https://babeljs.io/
  [semver]: http://semver.org/
