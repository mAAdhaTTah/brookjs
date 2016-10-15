# `brookjs`

[![Build Status](https://travis-ci.org/valtech-nyc/brookjs.svg?branch=master)](https://travis-ci.org/valtech-nyc/brookjs)

**Note: Early alpha. Expect breaking changes before version 0.1.0. See [semver](#semver) policy below.**

# Requirements

`brookjs` is distributed on GitHub as an ES6 module. In order to use it in a browser, bundle the application with [`webpack`][webpack] or [`browserify`][browserify] and ensure [`babel`][babel] transpiles `brookjs`. In addition, `brookjs` uses new JavaScript features that require polyfills transforms in older environments, including:

* `WeakMap`
* `Object.assign`
* `Array.from`
* `MutationObserver`

# Documentation

Full documentation for `brookjs` can be found [here][docs].

# Quick Start

You can install from github with npm:

```bash
npm install --save valtech-nyc/brookjs#<commitsha>
```

Grab the latest commit sha from GitHub and replace `<commitsha>` in the command above.

# Semver

`brookjs` modules adhere to [semver][]. Expect breaking changes before `v0.1.0` and the first public release to npm.

  [webpack]: https://webpack.github.io/
  [browserify]: http://browserify.org/
  [babel]: https://babeljs.io/
  [semver]: http://semver.org/
