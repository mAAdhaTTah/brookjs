# `brookjs`

[![Build Status](https://travis-ci.org/valtech-nyc/brookjs.svg?branch=master)](https://travis-ci.org/valtech-nyc/brookjs)[![npm](https://img.shields.io/npm/v/brookjs.svg)](https://www.npmjs.com/package/brookjs)[![Greenkeeper badge](https://badges.greenkeeper.io/valtech-nyc/brookjs.svg)](https://greenkeeper.io/)

A framework for building streaming applications.

___

## Requirements

`brookjs` is distributed on npm. In order to use it in a browser, bundle the application with [`webpack`][webpack] or [`browserify`][browserify]. In addition, `brookjs` uses new JavaScript features that require polyfills transforms in older environments, including:

* `Map` / `WeakMap`
* `Set` / `WeakSet`
* `Object.assign`
* `Array#includes`
* `String#includes`

With those polyfills, `brookjs` has been tested to work in the following browsers:

[![Build Status](https://saucelabs.com/browser-matrix/mAAdhaTTah.svg)](https://saucelabs.com/beta/builds/696506b874ed47e297f6773e9de66693)

## Quick Start

Install with npm:

```bash
npm install --save brookjs
```

By default, the `package.json` points to the CommonJS version (`cjs/`) for node compatibility, but an ES6 module version (`es/`) and a UMD version (`dist/`) are provided.

## Documentation

Full documentation for `brookjs` can be found [here][docs].

## Changelog

The changelog can be found [here][changelog].

  [webpack]: https://webpack.github.io/
  [browserify]: http://browserify.org/
  [babel]: https://babeljs.io/
  [semver]: http://semver.org/
  [docs]: https://valtech-nyc.github.io/brookjs/
  [changelog]: https://valtech-nyc.github.io/brookjs/changelog.html
