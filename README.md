# `brookjs`

[![Build Status](https://travis-ci.org/valtech-nyc/brookjs.svg?branch=master)](https://travis-ci.org/valtech-nyc/brookjs)

# Requirements

`brookjs` is distributed on npm. In order to use it in a browser, bundle the application with [`webpack`][webpack] or [`browserify`][browserify]. In addition, `brookjs` uses new JavaScript features that require polyfills transforms in older environments, including:

* `WeakMap`
* `Object.assign`
* `MutationObserver`

`Object.assign` & `Array.from` are transpiled with a pair of babel plugins, so polyfills for `WeakMap` & `MutationObserver` are required.

# Documentation

Full documentation for `brookjs` can be found [here][docs].

# Quick Start

Install with npm:

```bash
npm install --save brookjs
```

By default, the `package.json` points to the CommonJS version (`cjs/`) for node compatibility, but an ES6 module version (`es/`) and a UMD version (`dist/`) are provided.

  [webpack]: https://webpack.github.io/
  [browserify]: http://browserify.org/
  [babel]: https://babeljs.io/
  [semver]: http://semver.org/
  [docs]: https://valtech-nyc.github.io/brookjs/
