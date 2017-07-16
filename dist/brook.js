(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["brook"] = factory();
	else
		root["brook"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 51);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _isPlaceholder = __webpack_require__(15);


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2
             : _curry1(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var _isPlaceholder = __webpack_require__(15);


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ANIMATE_ATTRIBUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BLACKBOX_ATTRIBUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return CONTAINER_ATTRIBUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return KEY_ATTRIBUTE; });
/* unused harmony export BLUR */
/* unused harmony export CHANGE */
/* unused harmony export CLICK */
/* unused harmony export CONTEXTMENU */
/* unused harmony export CUT */
/* unused harmony export DBLCLICK */
/* unused harmony export FOCUS */
/* unused harmony export FOCUSIN */
/* unused harmony export FOCUSOUT */
/* unused harmony export INPUT */
/* unused harmony export KEYDOWN */
/* unused harmony export KEYPRESS */
/* unused harmony export KEYUP */
/* unused harmony export LOAD */
/* unused harmony export MOUSEDOWN */
/* unused harmony export MOUSEUP */
/* unused harmony export PASTE */
/* unused harmony export RESIZE */
/* unused harmony export SELECT */
/* unused harmony export SUBMIT */
/* unused harmony export TOUCHCANCEL */
/* unused harmony export TOUCHEND */
/* unused harmony export TOUCHSTART */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return SUPPORTED_EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return CAPTURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return EVENT_ATTRIBUTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $$internals; });
var _CAPTURE, _EVENT_ATTRIBUTES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * HTML attribute animate directive.
 *
 * For tagging a section of DOM to be animated.
 *
 * @type {string}
 */
var ANIMATE_ATTRIBUTE = 'data-brk-animate';

/**
 * HTML attribute blackbox directive.
 *
 * For tagging a section of DOM to not update.
 *
 * @type {string}
 */
var BLACKBOX_ATTRIBUTE = 'data-brk-blackbox';

/**
 * HTML attribute container directive.
 *
 * For tagging a section of DOM as a component's container.
 *
 * @type {string}
 */
var CONTAINER_ATTRIBUTE = 'data-brk-container';

/**
 * HTML attribute key directive.
 *
 * For tagging a component that appears multiple times.
 *
 * @type {string}
 */
var KEY_ATTRIBUTE = 'data-brk-key';

/**
 * Supported event constants.
 *
 * @type {string}
 */
var BLUR = 'blur';
var CHANGE = 'change';
var CLICK = 'click';
var CONTEXTMENU = 'contextmenu';
var CUT = 'cut';
var DBLCLICK = 'dblclick';
var FOCUS = 'focus';
var FOCUSIN = 'focusin';
var FOCUSOUT = 'focusout';
var INPUT = 'input';
var KEYDOWN = 'keydown';
var KEYPRESS = 'keypress';
var KEYUP = 'keyup';
var LOAD = 'load';
var MOUSEDOWN = 'mousedown';
var MOUSEUP = 'mouseup';
var PASTE = 'paste';
var RESIZE = 'resize';
var SELECT = 'select';
var SUBMIT = 'submit';
var TOUCHCANCEL = 'touchcancel';
var TOUCHEND = 'touchend';
var TOUCHSTART = 'touchstart';

var SUPPORTED_EVENTS = [BLUR, CHANGE, CLICK, CONTEXTMENU, CUT, DBLCLICK, FOCUS, FOCUSIN, FOCUSOUT, INPUT, KEYDOWN, KEYPRESS, KEYUP, LOAD, MOUSEDOWN, MOUSEUP, PASTE, RESIZE, SELECT, SUBMIT, TOUCHCANCEL, TOUCHEND, TOUCHSTART];

/**
 * Whether the event listener should be captured.
 *
 * @type {Object}
 */
var CAPTURE = (_CAPTURE = {}, _defineProperty(_CAPTURE, BLUR, true), _defineProperty(_CAPTURE, CHANGE, true), _defineProperty(_CAPTURE, CLICK, false), _defineProperty(_CAPTURE, CONTEXTMENU, false), _defineProperty(_CAPTURE, CUT, false), _defineProperty(_CAPTURE, DBLCLICK, false), _defineProperty(_CAPTURE, FOCUS, true), _defineProperty(_CAPTURE, FOCUSIN, true), _defineProperty(_CAPTURE, FOCUSOUT, true), _defineProperty(_CAPTURE, INPUT, true), _defineProperty(_CAPTURE, KEYDOWN, false), _defineProperty(_CAPTURE, KEYPRESS, false), _defineProperty(_CAPTURE, KEYUP, false), _defineProperty(_CAPTURE, LOAD, true), _defineProperty(_CAPTURE, MOUSEDOWN, false), _defineProperty(_CAPTURE, MOUSEUP, false), _defineProperty(_CAPTURE, PASTE, false), _defineProperty(_CAPTURE, RESIZE, true), _defineProperty(_CAPTURE, SELECT, true), _defineProperty(_CAPTURE, SUBMIT, true), _defineProperty(_CAPTURE, TOUCHCANCEL, true), _defineProperty(_CAPTURE, TOUCHEND, true), _defineProperty(_CAPTURE, TOUCHSTART, true), _CAPTURE);

/**
 * Event attribute prefixer.
 *
 * @param {string} name - Event name.
 * @returns {string} HTML attribute
 */
var prefix = function prefix(name) {
  return 'data-brk-' + name;
};

/**
 * HTML attribute event directives.
 *
 * @type {Object}
 */
var EVENT_ATTRIBUTES = (_EVENT_ATTRIBUTES = {}, _defineProperty(_EVENT_ATTRIBUTES, BLUR, prefix('onblur')), _defineProperty(_EVENT_ATTRIBUTES, CLICK, prefix('onclick')), _defineProperty(_EVENT_ATTRIBUTES, CHANGE, prefix('onchange')), _defineProperty(_EVENT_ATTRIBUTES, CONTEXTMENU, prefix('oncontextmenu')), _defineProperty(_EVENT_ATTRIBUTES, CUT, prefix('oncut')), _defineProperty(_EVENT_ATTRIBUTES, DBLCLICK, prefix('ondblclick')), _defineProperty(_EVENT_ATTRIBUTES, FOCUS, prefix('onfocus')), _defineProperty(_EVENT_ATTRIBUTES, FOCUSIN, prefix('onfocusin')), _defineProperty(_EVENT_ATTRIBUTES, FOCUSOUT, prefix('onfocusout')), _defineProperty(_EVENT_ATTRIBUTES, INPUT, prefix('oninput')), _defineProperty(_EVENT_ATTRIBUTES, KEYDOWN, prefix('onkeydown')), _defineProperty(_EVENT_ATTRIBUTES, KEYPRESS, prefix('onkeypress')), _defineProperty(_EVENT_ATTRIBUTES, KEYUP, prefix('onkeyup')), _defineProperty(_EVENT_ATTRIBUTES, LOAD, prefix('onload')), _defineProperty(_EVENT_ATTRIBUTES, MOUSEDOWN, prefix('onmousedown')), _defineProperty(_EVENT_ATTRIBUTES, MOUSEUP, prefix('mouseup')), _defineProperty(_EVENT_ATTRIBUTES, RESIZE, prefix('resize')), _defineProperty(_EVENT_ATTRIBUTES, PASTE, prefix('onpaste')), _defineProperty(_EVENT_ATTRIBUTES, SELECT, prefix('onselect')), _defineProperty(_EVENT_ATTRIBUTES, SUBMIT, prefix('onsubmit')), _defineProperty(_EVENT_ATTRIBUTES, TOUCHCANCEL, prefix('ontouchcancel')), _defineProperty(_EVENT_ATTRIBUTES, TOUCHEND, prefix('ontouchend')), _defineProperty(_EVENT_ATTRIBUTES, TOUCHSTART, prefix('ontouchstart')), _EVENT_ATTRIBUTES);

var $$internals = Symbol('@@brookjs/internals');

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateCache", function() { return StateCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeCache", function() { return NodeCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransitionCache", function() { return TransitionCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MiddlewareCache", function() { return MiddlewareCache; });
// Associates DOM Nodes with state objects.
var StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = new Map();

// Cache transition functions.
var TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kefir__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kefir___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_kefir__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var ActionObservable = function (_Kefir$Pool) {
    _inherits(ActionObservable, _Kefir$Pool);

    function ActionObservable() {
        _classCallCheck(this, ActionObservable);

        return _possibleConstructorReturn(this, (ActionObservable.__proto__ || Object.getPrototypeOf(ActionObservable)).apply(this, arguments));
    }

    _createClass(ActionObservable, [{
        key: 'ofType',

        /**
         * Filter the actions$ stream to just emit actions of
         * the provided types.
         *
         * @param {Array<string>} types - Action types to filter.
         * @returns {Observable<Action>} Stream of filtered actions.
         */
        value: function ofType() {
            for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
                types[_key] = arguments[_key];
            }

            return this.filter(function (action) {
                var type = action.type;
                var len = types.length;

                if (len === 1) {
                    return type === types[0];
                } else {
                    for (var i = 0; i < len; i++) {
                        if (types[i] === type) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }
    }]);

    return ActionObservable;
}(__WEBPACK_IMPORTED_MODULE_0_kefir___default.a.Pool);

function actions() {
    return new ActionObservable();
}

Object.assign(__WEBPACK_IMPORTED_MODULE_0_kefir___default.a, { ActionObservable: ActionObservable, actions: actions });

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_kefir___default.a);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var curryN = __webpack_require__(29);


/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _dispatchable = __webpack_require__(26);
var _map = __webpack_require__(27);
var _reduce = __webpack_require__(19);
var _xmap = __webpack_require__(68);
var curryN = __webpack_require__(29);
var keys = __webpack_require__(10);


/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      var double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */
module.exports = _curry2(_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map(fn, functor);
  }
}));


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony default export */ __webpack_exports__["a"] = (typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["protectVTree"] = protectVTree;
/* harmony export (immutable) */ __webpack_exports__["unprotectVTree"] = unprotectVTree;
/* harmony export (immutable) */ __webpack_exports__["cleanMemory"] = cleanMemory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pool__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__caches__ = __webpack_require__(3);



var memory = __WEBPACK_IMPORTED_MODULE_0__pool__["a" /* default */].memory,
    protect = __WEBPACK_IMPORTED_MODULE_0__pool__["a" /* default */].protect,
    unprotect = __WEBPACK_IMPORTED_MODULE_0__pool__["a" /* default */].unprotect;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree(vTree) {
  unprotect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  var isBusy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  __WEBPACK_IMPORTED_MODULE_1__caches__["StateCache"].forEach(function (state) {
    return isBusy = state.isRendering || isBusy;
  });

  // TODO Pause GC in between renders.
  //if (isBusy) {
  //  return;
  //}

  memory.allocated.forEach(function (vTree) {
    return memory.free.add(vTree);
  });
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  __WEBPACK_IMPORTED_MODULE_1__caches__["NodeCache"].forEach(function (node, descriptor) {
    if (!memory.protected.has(descriptor)) {
      __WEBPACK_IMPORTED_MODULE_1__caches__["NodeCache"].delete(descriptor);
    }
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _has = __webpack_require__(16);
var _isArguments = __webpack_require__(54);


/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
module.exports = (function() {
  // cover IE < 9 keys issues
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = (function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
  }());

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  return typeof Object.keys === 'function' && !hasArgsEnumBug ?
    _curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    _curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, nIdx;
      var ks = [];
      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });
}());


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(17);
var _pipe = __webpack_require__(62);
var reduce = __webpack_require__(18);
var tail = __webpack_require__(65);


/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 */
module.exports = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length,
                reduce(_pipe, arguments[0], tail(arguments)));
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(70);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createTree;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_pool__ = __webpack_require__(22);
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}




var CreateTreeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].CreateTreeHookCache;
var assign = Object.assign;
var isArray = Array.isArray;

var fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes) {
  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (var i = 0; i < input.length; i++) {
      var newTree = createTree(input[i]);
      if (!newTree) {
        continue;
      }
      var isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        var _childNodes;

        (_childNodes = childNodes).push.apply(_childNodes, _toConsumableArray(newTree.childNodes));
      } else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  var isObject = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';

  // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
  if (input && isObject && 'parentNode' in input) {
    attributes = {};
    childNodes = [];

    // When working with a text node, simply save the nodeValue as the
    // initial value.
    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    }
    // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (var _i = 0; _i < input.attributes.length; _i++) {
          var _input$attributes$_i = input.attributes[_i],
              name = _input$attributes$_i.name,
              value = _input$attributes$_i.value;

          // If the attribute's value is empty, seek out the property instead.

          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (var _i2 = 0; _i2 < input.childNodes.length; _i2++) {
          childNodes.push(createTree(input.childNodes[_i2]));
        }
      }
    }

    var _vTree = createTree(input.nodeName, attributes, childNodes);
    __WEBPACK_IMPORTED_MODULE_0__util_caches__["NodeCache"].set(_vTree, input);
    return _vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    return input;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes].concat(rest);
  }

  // Allocate a new VTree from the pool.
  var entry = __WEBPACK_IMPORTED_MODULE_1__util_pool__["a" /* default */].get();
  var isTextNode = input === '#text';
  var isString = typeof input === 'string';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    var _nodes = arguments.length === 2 ? attributes : childNodes;
    var nodeValue = isArray(_nodes) ? _nodes.join('') : _nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragmentName || typeof input !== 'string') {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  var useAttributes = isArray(attributes) || (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) !== 'object';
  var nodes = useAttributes ? attributes : childNodes;
  var nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (var _i3 = 0; _i3 < nodeArray.length; _i3++) {
      var newNode = nodeArray[_i3];
      var _isArray = Array.isArray(newNode);

      // Merge in arrays.
      if (_isArray) {
        for (var _i4 = 0; _i4 < newNode.length; _i4++) {
          entry.childNodes.push(newNode[_i4]);
        }
      }
      // Merge in fragments.
      else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
          for (var _i5 = 0; _i5 < newNode.childNodes.length; _i5++) {
            entry.childNodes.push(newNode.childNodes[_i5]);
          }
        }
        // Assume objects are vTrees.
        else if (newNode && (typeof newNode === 'undefined' ? 'undefined' : _typeof(newNode)) === 'object') {
            entry.childNodes.push(newNode);
          }
          // Cover generate cases where a user has indicated they do not want a
          // node from appearing.
          else if (newNode) {
              entry.childNodes.push(createTree('#text', null, newNode));
            }
    }
  }

  if (attributes && (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  var vTree = entry;

  CreateTreeHookCache.forEach(function (fn, retVal) {
    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(vTree)) {
      vTree = retVal;
    }
  });

  return vTree;
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function _isPlaceholder(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(39);
var _reduce = __webpack_require__(19);


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *                -               -10
 *               / \              / \
 *              -   4           -6   4
 *             / \              / \
 *            -   3   ==>     -3   3
 *           / \              / \
 *          -   2           -1   2
 *         / \              / \
 *        0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */
module.exports = _curry3(_reduce);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var _isArrayLike = __webpack_require__(24);
var _xwrap = __webpack_require__(63);
var bind = __webpack_require__(64);


module.exports = (function() {
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
  return function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  };
}());


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig s -> {s: a} -> a | Undefined
 * @param {String} p The property name
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 */
module.exports = _curry2(function prop(p, obj) { return obj[p]; });


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// A modest size.
var size = 10000;

var free = new Set();
var allocate = new Set();
var _protect = new Set();
var shape = function shape() {
  return {
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: {}
  };
};

// Creates a pool to query new or reused values from.
var memory = { free: free, allocated: allocate, protected: _protect };

// Prime the free memory pool with VTrees.
for (var i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
var freeValues = free.values();

// Cache VTree objects in a pool which is used to get
/* harmony default export */ __webpack_exports__["a"] = ({
  size: size,
  memory: memory,

  get: function get() {
    var _freeValues$next = freeValues.next(),
        _freeValues$next$valu = _freeValues$next.value,
        value = _freeValues$next$valu === undefined ? shape() : _freeValues$next$valu,
        done = _freeValues$next.done;

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.


    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },
  protect: function protect(value) {
    allocate.delete(value);
    _protect.add(value);
  },
  unprotect: function unprotect(value) {
    if (_protect.has(value)) {
      _protect.delete(value);
      free.add(value);
    }
  }
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _equals = __webpack_require__(57);


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
module.exports = _curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _isArray = __webpack_require__(20);
var _isString = __webpack_require__(40);


/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
module.exports = _curry1(function isArrayLike(x) {
  if (_isArray(x)) { return true; }
  if (!x) { return false; }
  if (typeof x !== 'object') { return false; }
  if (_isString(x)) { return false; }
  if (x.nodeType === 1) { return !!x.length; }
  if (x.length === 0) { return true; }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__(20);


/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
module.exports = function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__(20);
var _isTransformer = __webpack_require__(67);


/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
module.exports = function _dispatchable(methodNames, xf, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!_isArray(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = {
  init: function() {
    return this.xf['@@transducer/init']();
  },
  result: function(result) {
    return this.xf['@@transducer/result'](result);
  }
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(17);
var _curry1 = __webpack_require__(1);
var _curry2 = __webpack_require__(0);
var _curryN = __webpack_require__(69);


/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var sumArgs = (...args) => R.sum(args);
 *
 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _identity = __webpack_require__(74);


/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      var obj = {};
 *      R.identity(obj) === obj; //=> true
 * @symb R.identity(a) = a
 */
module.exports = _curry1(_identity);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isChildNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isAddedChildNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isRemovedChildNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return containerMatches; });
/* harmony export (immutable) */ __webpack_exports__["c"] = getContainerNode;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return dedupeListOfMutationActions; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_reduce__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_reduce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_reduce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_flatten__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_flatten___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_flatten__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_map__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda_src_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_groupWith__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_groupWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_groupWith__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_prop__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_prop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ramda_src_prop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_and__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_and___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ramda_src_and__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ramda_src_equals__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ramda_src_path__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ramda_src_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_ramda_src_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ramda_src_or__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ramda_src_or___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_ramda_src_or__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ramda_src_converge__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ramda_src_converge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_ramda_src_converge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__actions__ = __webpack_require__(44);















var isChildNode = function isChildNode(el) {
    return __WEBPACK_IMPORTED_MODULE_10_ramda_src_converge___default()(__WEBPACK_IMPORTED_MODULE_9_ramda_src_or___default.a, [__WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_7_ramda_src_path___default()(['payload', 'parent']), __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default()(el)), __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_7_ramda_src_path___default()(['payload', 'target']), __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default()(el))]);
};

var isAddedChildNode = function isAddedChildNode(el) {
    return __WEBPACK_IMPORTED_MODULE_10_ramda_src_converge___default()(__WEBPACK_IMPORTED_MODULE_5_ramda_src_and___default.a, [isChildNode(el), __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_4_ramda_src_prop___default()('type'), __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default()(__WEBPACK_IMPORTED_MODULE_12__actions__["a" /* NODE_ADDED */]))]);
};

var isRemovedChildNode = function isRemovedChildNode(el) {
    return __WEBPACK_IMPORTED_MODULE_10_ramda_src_converge___default()(__WEBPACK_IMPORTED_MODULE_5_ramda_src_and___default.a, [isChildNode(el), __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_4_ramda_src_prop___default()('type'), __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default()(__WEBPACK_IMPORTED_MODULE_12__actions__["b" /* NODE_REMOVED */]))]);
};

var containerMatches = function containerMatches(container) {
    return __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_4_ramda_src_prop___default()('container'), __WEBPACK_IMPORTED_MODULE_6_ramda_src_equals___default()(container));
};

/**
 * Returns the container node of the provided node.
 *
 * @param {Node} parent - Parent node to check.
 * @returns {null|Node} Parent containr node.
 */
function getContainerNode(parent) {
    if (!parent) {
        return null;
    }

    if (parent.hasAttribute && parent.hasAttribute(__WEBPACK_IMPORTED_MODULE_11__constants__["e" /* CONTAINER_ATTRIBUTE */])) {
        return parent;
    }

    return getContainerNode(parent.parentNode);
}

/**
 * Adds the provided action to the array if it's not a duplicate,
 * and removes Actions that cancel each other out.
 *
 * @param {Array<Action>} acc - List of accumulated actions.
 * @param {Action} action - Next action to add.
 * @returns {Array<Action>} New list of actions.
 */
function accumulateUniqueNodes(acc, action) {
    var listOfNodes = acc.map(__WEBPACK_IMPORTED_MODULE_7_ramda_src_path___default()(['payload', 'node']));
    var indexOfNode = listOfNodes.indexOf(action.payload.node);

    if (indexOfNode !== -1) {
        // Since there are only two types of actions, if they
        // don't match here but have the same node, it means
        // one was an `ADDED` and one was a `REMOVED`, so they
        // cancel each other out, so remove both.
        if (acc[indexOfNode].type !== action.type) {
            acc.splice(indexOfNode, 1);
        }

        return acc;
    }

    return acc.concat(action);
}

var dedupeListOfMutationActions = __WEBPACK_IMPORTED_MODULE_8_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_3_ramda_src_groupWith___default()(function (a, b) {
    return a.payload.node === b.payload.node;
}), __WEBPACK_IMPORTED_MODULE_2_ramda_src_map___default()(__WEBPACK_IMPORTED_MODULE_3_ramda_src_groupWith___default()(function (a, b) {
    return a.type === b.type;
})), __WEBPACK_IMPORTED_MODULE_2_ramda_src_map___default()(function (actions) {
    // If only one type, than use it.
    if (actions.length === 1) {
        return actions[0];
    }

    if (actions[0].length === actions[1].length) {
        return [];
    }

    if (actions[0].length > actions[1].length) {
        return actions[0][0];
    }

    return actions[1][0];
}), __WEBPACK_IMPORTED_MODULE_1_ramda_src_flatten___default.a, __WEBPACK_IMPORTED_MODULE_0_ramda_src_reduce___default()(accumulateUniqueNodes, []));

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Internals; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tree_create__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_create__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tasks_parse_new_tree__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tasks_reconcile_trees__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_internals__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_parse__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__inner_html__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__outer_html__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__transaction__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__html__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__release__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__use__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__transition__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__version__ = __webpack_require__(131);
/* unused harmony reexport VERSION */
/* unused harmony reexport addTransitionState */
/* unused harmony reexport removeTransitionState */
/* unused harmony reexport release */
/* unused harmony reexport createTree */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_11__use__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_7__outer_html__["a"]; });
/* unused harmony reexport innerHTML */
/* unused harmony reexport html */















// At startup inject the HTML parser into the default set of tasks.
__WEBPACK_IMPORTED_MODULE_8__transaction__["b" /* defaultTasks */].splice(__WEBPACK_IMPORTED_MODULE_8__transaction__["b" /* defaultTasks */].indexOf(__WEBPACK_IMPORTED_MODULE_3__tasks_reconcile_trees__["a" /* default */]), 0, __WEBPACK_IMPORTED_MODULE_2__tasks_parse_new_tree__["a" /* default */]);

var api = {
  VERSION: __WEBPACK_IMPORTED_MODULE_13__version__["a" /* __VERSION__ */],
  addTransitionState: __WEBPACK_IMPORTED_MODULE_12__transition__["a" /* addTransitionState */],
  removeTransitionState: __WEBPACK_IMPORTED_MODULE_12__transition__["b" /* removeTransitionState */],
  release: __WEBPACK_IMPORTED_MODULE_10__release__["a" /* default */],
  createTree: __WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */],
  use: __WEBPACK_IMPORTED_MODULE_11__use__["a" /* default */],
  outerHTML: __WEBPACK_IMPORTED_MODULE_7__outer_html__["a" /* default */],
  innerHTML: __WEBPACK_IMPORTED_MODULE_6__inner_html__["a" /* default */],
  html: __WEBPACK_IMPORTED_MODULE_9__html__["a" /* default */]
};

// This is an internal API exported purely for middleware and extensions to
// leverage internal APIs that are not part of the public API. There are no
// promises that this will not break in the future. We will attempt to minimize
// changes and will supply fallbacks when APIs change.
//
// Note: The HTML parser is only available in this mode.
var Internals = Object.assign(__WEBPACK_IMPORTED_MODULE_4__util_internals__["a" /* default */], api, { parse: __WEBPACK_IMPORTED_MODULE_5__util_parse__["a" /* default */], defaultTasks: __WEBPACK_IMPORTED_MODULE_8__transaction__["b" /* defaultTasks */], tasks: __WEBPACK_IMPORTED_MODULE_8__transaction__["c" /* tasks */], createNode: __WEBPACK_IMPORTED_MODULE_1__node_create__["a" /* default */] });

// Attach a circular reference to `Internals` for ES/CJS builds.
api.Internals = Internals;

// Automatically hook up to DevTools if they are present.
if (typeof devTools !== 'undefined') {
  Object(__WEBPACK_IMPORTED_MODULE_11__use__["a" /* default */])(devTools(Internals));
  console.info('diffHTML DevTools Found and Activated...');
}



/* unused harmony default export */ var _unused_webpack_default_export = (api);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createNode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_process__ = __webpack_require__(8);



var CreateNodeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].CreateNodeHookCache;

var namespace = 'http://www.w3.org/2000/svg';

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @param {Boolean} - Is their a root SVG element?
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree) {
  var ownerDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var isSVG = arguments[2];

  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    if (!vTree) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  var existingNode = __WEBPACK_IMPORTED_MODULE_0__util_caches__["NodeCache"].get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  var nodeName = vTree.nodeName,
      _vTree$rawNodeName = vTree.rawNodeName,
      rawNodeName = _vTree$rawNodeName === undefined ? nodeName : _vTree$rawNodeName,
      _vTree$childNodes = vTree.childNodes,
      childNodes = _vTree$childNodes === undefined ? [] : _vTree$childNodes;

  isSVG = isSVG || nodeName === 'svg';

  // Will vary based on the properties of the VTree.
  var domNode = null;

  CreateNodeHookCache.forEach(function (fn, retVal) {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNode = retVal;
    }
  });

  if (!domNode) {
    // Create empty text elements. They will get filled in during the patch
    // process.
    if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue);
    }
    // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
        domNode = ownerDocument.createDocumentFragment();
      }
      // Support SVG.
      else if (isSVG) {
          domNode = ownerDocument.createElementNS(namespace, rawNodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(rawNodeName);
          }
  }

  // Add to the domNodes cache.
  __WEBPACK_IMPORTED_MODULE_0__util_caches__["NodeCache"].set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (var i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument, isSVG));
  }

  return domNode;
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parse;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tree_create__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pool__ = __webpack_require__(22);
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser




var hasNonWhitespaceEx = /\S/;
var doctypeEx = /<!.*>/i;
var attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
var spaceEx = /[^ ]/;
var tokenEx = /__DIFFHTML__([^_]*)__/;
var tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

var assign = Object.assign;

var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var selfClosing = new Set(['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

var kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};

var kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
var interpolateValues = function interpolateValues(currentParent, string) {
  var _currentParent$childN;

  var supplemental = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // If this is text and not a doctype, add as a text node.
  if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
    return currentParent.childNodes.push(Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])('#text', string));
  }

  var childNodes = [];
  var parts = string.split(tokenEx);
  var length = parts.length;

  for (var i = 0; i < parts.length; i++) {
    var value = parts[i];

    if (!value) {
      continue;
    }

    // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.
    if (i % 2 === 1) {
      var innerTree = supplemental.children[value];
      if (!innerTree) {
        continue;
      }
      var isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push.apply(childNodes, _toConsumableArray(innerTree.childNodes));
      } else {
        childNodes.push(innerTree);
      }
    } else if (!doctypeEx.test(value)) {
      childNodes.push(Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])('#text', value));
    }
  }

  (_currentParent$childN = currentParent.childNodes).push.apply(_currentParent$childN, childNodes);
};

/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {Object} rawAttrs - DOM Node Attributes
 * @param {Object} supplemental - Interpolated data from a tagged template
 * @return {Object} vTree
 */
var HTMLElement = function HTMLElement(nodeName, rawAttrs, supplemental) {
  var match = null;

  // Support dynamic tag names like: `<${MyComponent} />`.
  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental);
  }

  var attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (var _match; _match = attrEx.exec(rawAttrs || '');) {
    var name = _match[1];
    var value = _match[6] || _match[5] || _match[4] || _match[1];
    var tokenMatch = value.match(tokenEx);

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (tokenMatch && tokenMatch.length) {
      var parts = value.split(tokenEx);
      var length = parts.length;

      var hasToken = tokenEx.exec(name);
      var newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (var i = 0; i < parts.length; i++) {
        var _value = parts[i];

        if (!_value) {
          continue;
        }

        // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.
        if (i % 2 === 1) {
          if (attributes[newName]) {
            attributes[newName] += supplemental.attributes[_value];
          } else {
            attributes[newName] = supplemental.attributes[_value];
          }
        } else {
          if (attributes[newName]) {
            attributes[newName] += _value;
          } else {
            attributes[newName] = _value;
          }
        }
      }
    } else if (tokenMatch = tokenEx.exec(name)) {
      var nameAndValue = supplemental.attributes[tokenMatch[1]];
      var _hasToken = tokenEx.exec(value);
      var getValue = _hasToken ? supplemental.attributes[_hasToken[1]] : value;

      attributes[nameAndValue] = value === '""' ? '' : getValue;
    } else {
      attributes[name] = value === '""' ? '' : value;
    }
  }

  return Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])(nodeName, attributes, []);
};

/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Object} supplemental - Dynamic interpolated data values
 * @param {Object} options - Contains options like silencing warnings
 * @return {Object} - Parsed Virtual Tree Element
 */
function parse(html, supplemental) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var root = Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])('#document-fragment', null, []);
  var stack = [root];
  var currentParent = root;
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  // Look through the HTML markup for valid tags.
  for (var match, text; match = tagEx.exec(html);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        if (text) {
          interpolateValues(currentParent, text, supplemental);
        }
      }
    }

    var matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      var string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex;

    // This is a comment (TODO support these).
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      var attrs = {};

      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental)) - 1];

      stack.push(currentParent);

      if (blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        var closeMarkup = '</' + match[2] + '>';
        var index = html.indexOf(closeMarkup, tagEx.lastIndex);
        var length = match[2].length;

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        var newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
        var nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        var markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        var caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, caret + '\nPossibly invalid markup. Saw ' + match[2] + ', expected ' + nodeName + '...\n        ');

        // Throw an error message if the markup isn't what we expected.
        throw new Error('\n\n' + markup.join('\n'));
      }

      var tokenMatch = tokenEx.exec(match[2]);

      // </ or /> or <br> etc.
      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[4] === '/' && tokenMatch) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        // Not self-closing, so seek out the next match.
        else if (tokenMatch) {
            var value = supplemental.tags[tokenMatch[1]];

            if (currentParent.rawNodeName === value) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              break;
            }
          }

        if (currentParent.rawNodeName === match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        } else {
          var tag = kElementsClosedByClosing[currentParent.rawNodeName];

          // Trying to close current tag, and move on
          if (tag) {
            if (tag[match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              continue;
            }
          }

          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  // Find any last remaining text after the parsing completes over tags.
  var remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  if (remainingText) {
    interpolateValues(currentParent, remainingText, supplemental);
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    var head = { before: [], after: [] };
    var body = { after: [] };
    var HTML = root.childNodes[0];

    var beforeHead = true;
    var beforeBody = true;

    // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.
    HTML.childNodes = HTML.childNodes.filter(function (el) {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') beforeHead = false;
        if (el.nodeName === 'body') beforeBody = false;

        return true;
      }
      // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
          if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
        }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      var headInstance = Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])('head', null, []);
      var existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    } else {
      var _existing = HTML.childNodes[0].childNodes;

      _existing.unshift.apply(_existing, head.before);
      _existing.push.apply(_existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      var bodyInstance = Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])('body', null, []);
      var _existing2 = bodyInstance.childNodes;

      _existing2.push.apply(_existing2, body.after);
      HTML.childNodes.push(bodyInstance);
    } else {
      var _existing3 = HTML.childNodes[1].childNodes;
      _existing3.push.apply(_existing3, body.after);
    }
  }

  // Reset regular expression positions per parse.
  attrEx.lastIndex = 0;
  tagEx.lastIndex = 0;

  return root;
}

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = decodeEntities;
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

// Support loading diffHTML in non-browser environments.
var g = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : window;
var element = g.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(14)))

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = escape;
/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/[&<>]/g, function (match) {
    return "&#" + match.charCodeAt(0) + ";";
  });
}

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultTasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return tasks; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_memory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_make_measure__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_process__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tasks_schedule__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tasks_should_update__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tasks_reconcile_trees__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tasks_sync_trees__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__tasks_patch_node__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tasks_end_as_promise__ = __webpack_require__(126);
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}












var defaultTasks = [__WEBPACK_IMPORTED_MODULE_4__tasks_schedule__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__tasks_should_update__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__tasks_reconcile_trees__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__tasks_sync_trees__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__tasks_patch_node__["a" /* default */], __WEBPACK_IMPORTED_MODULE_9__tasks_end_as_promise__["a" /* default */]];

var tasks = {
  schedule: __WEBPACK_IMPORTED_MODULE_4__tasks_schedule__["a" /* default */], shouldUpdate: __WEBPACK_IMPORTED_MODULE_5__tasks_should_update__["a" /* default */], reconcileTrees: __WEBPACK_IMPORTED_MODULE_6__tasks_reconcile_trees__["a" /* default */], syncTrees: __WEBPACK_IMPORTED_MODULE_7__tasks_sync_trees__["a" /* default */], patchNode: __WEBPACK_IMPORTED_MODULE_8__tasks_patch_node__["a" /* default */], endAsPromise: __WEBPACK_IMPORTED_MODULE_9__tasks_end_as_promise__["a" /* default */]
};

var Transaction = function () {
  _createClass(Transaction, null, [{
    key: 'create',
    value: function create(domNode, markup, options) {
      return new Transaction(domNode, markup, options);
    }
  }, {
    key: 'renderNext',
    value: function renderNext(state) {
      if (!state.nextTransaction) {
        return;
      }

      // Create the next transaction.
      var nextTransaction = state.nextTransaction,
          promises = state.nextTransaction.promises;

      var resolver = promises && promises[0];

      state.nextTransaction = undefined;
      nextTransaction.aborted = false;

      // Remove the last task, this has already been executed (via abort).
      nextTransaction.tasks.pop();

      // Reflow this transaction.
      Transaction.flow(nextTransaction, nextTransaction.tasks);

      // Wait for the promises to complete if they exist, otherwise resolve
      // immediately.
      if (promises && promises.length > 1) {
        Promise.all(promises.slice(1)).then(function () {
          return resolver.resolve();
        });
      } else if (resolver) {
        resolver.resolve();
      }
    }
  }, {
    key: 'flow',
    value: function flow(transaction, tasks) {
      var retVal = transaction;

      // Execute each "task" serially, passing the transaction as a baton that
      // can be used to share state across the tasks.
      for (var i = 0; i < tasks.length; i++) {
        // If aborted, don't execute any more tasks.
        if (transaction.aborted) {
          return retVal;
        }

        // Run the task.
        retVal = tasks[i](transaction);

        // The last `returnValue` is what gets sent to the consumer. This
        // mechanism is crucial for the `abort`, if you want to modify the "flow"
        // that's fine, but you must ensure that your last task provides a
        // mechanism to know when the transaction completes. Something like
        // callbacks or a Promise.
        if (retVal !== undefined && retVal !== transaction) {
          return retVal;
        }
      }
    }
  }, {
    key: 'assert',
    value: function assert(transaction) {
      if (__WEBPACK_IMPORTED_MODULE_3__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
        if (_typeof(transaction.domNode) !== 'object') {
          throw new Error('Transaction requires a DOM Node mount point');
        }

        if (transaction.aborted && transaction.completed) {
          throw new Error('Transaction was previously aborted');
        }

        if (transaction.completed) {
          throw new Error('Transaction was previously completed');
        }
      }
    }
  }, {
    key: 'invokeMiddleware',
    value: function invokeMiddleware(transaction) {
      var tasks = transaction.tasks;

      __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].forEach(function (fn) {
        // Invoke all the middleware passing along this transaction as the only
        // argument. If they return a value (must be a function) it will be added
        // to the transaction task flow.
        var result = fn(transaction);

        if (result) {
          tasks.push(result);
        }
      });
    }
  }]);

  function Transaction(domNode, markup, options) {
    _classCallCheck(this, Transaction);

    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = __WEBPACK_IMPORTED_MODULE_0__util_caches__["StateCache"].get(domNode) || {
      measure: Object(__WEBPACK_IMPORTED_MODULE_2__util_make_measure__["a" /* default */])(domNode, markup)
    };

    this.tasks = [].concat(options.tasks);

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    __WEBPACK_IMPORTED_MODULE_0__util_caches__["StateCache"].set(domNode, this.state);
  }

  _createClass(Transaction, [{
    key: 'start',
    value: function start() {
      if (__WEBPACK_IMPORTED_MODULE_3__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
        Transaction.assert(this);
      }

      var domNode = this.domNode,
          measure = this.state.measure,
          tasks = this.tasks;

      var takeLastTask = tasks.pop();

      this.aborted = false;

      // Add middleware in as tasks.
      Transaction.invokeMiddleware(this);

      // Measure the render flow if the user wants to track performance.
      measure('render');

      // Push back the last task as part of ending the flow.
      tasks.push(takeLastTask);

      return Transaction.flow(this, tasks);
    }

    // This will immediately call the last flow task and terminate the flow. We
    // call the last task to ensure that the control flow completes. This should
    // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
    // `return someValue` to provide the most accurate performance reading. This
    // doesn't matter practically besides that.

  }, {
    key: 'abort',
    value: function abort() {
      var state = this.state;

      this.aborted = true;

      // Grab the last task in the flow and return, this task will be responsible
      // for calling `transaction.end`.
      return this.tasks[this.tasks.length - 1](this);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      var state = this.state,
          domNode = this.domNode,
          options = this.options;
      var measure = state.measure;
      var inner = options.inner;

      measure('finalize');

      this.completed = true;

      // Mark the end to rendering.
      measure('finalize');
      measure('render');

      // Trigger all `onceEnded` callbacks, so that middleware can know the
      // transaction has ended.
      this.endedCallbacks.forEach(function (callback) {
        return callback(_this);
      });
      this.endedCallbacks.clear();

      // Cache the markup and text for the DOM node to allow for short-circuiting
      // future render transactions.
      state.previousMarkup = domNode.outerHTML;
      state.isRendering = false;

      // Clean up memory before rendering the next transaction, however if
      // another transaction is running concurrently this will be delayed until
      // the last render completes.
      Object(__WEBPACK_IMPORTED_MODULE_1__util_memory__["cleanMemory"])();

      // Try and render the next transaction if one has been saved.
      Transaction.renderNext(state);

      return this;
    }
  }, {
    key: 'onceEnded',
    value: function onceEnded(callback) {
      this.endedCallbacks.add(callback);
    }
  }]);

  return Transaction;
}();

/* harmony default export */ __webpack_exports__["a"] = (Transaction);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var keys = __webpack_require__(10);


/**
 * Returns a list of all the enumerable own properties of the supplied object.
 * Note that the order of the output array is not guaranteed across different
 * JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own properties.
 * @see R.valuesIn, R.keys
 * @example
 *
 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
 */
module.exports = _curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;
  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }
  return vals;
});


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _curry2 = __webpack_require__(0);
var _isPlaceholder = __webpack_require__(15);


/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3
             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _curry1(function(_c) { return fn(a, b, _c); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
             : fn(a, b, c);
    }
  };
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__animateAttribute__ = __webpack_require__(75);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__animateAttribute__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blackboxAttribute__ = __webpack_require__(76);
/* unused harmony reexport blackboxAttribute */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__containerAttribute__ = __webpack_require__(77);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__containerAttribute__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__keyAttribute__ = __webpack_require__(78);
/* unused harmony reexport keyAttribute */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__eventAttribute__ = __webpack_require__(79);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_4__eventAttribute__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mapActionTo__ = __webpack_require__(80);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_5__mapActionTo__["a"]; });







/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var _isArrayLike = __webpack_require__(24);


/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */
module.exports = function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _map = __webpack_require__(27);
var curryN = __webpack_require__(29);
var max = __webpack_require__(86);
var pluck = __webpack_require__(87);
var reduce = __webpack_require__(18);


/**
 * Accepts a converging function and a list of branching functions and returns
 * a new function. When invoked, this new function is applied to some
 * arguments, each branching function is applied to those same arguments. The
 * results of each branching function are passed as arguments to the converging
 * function to produce the return value.
 *
 * @func
 * @memberOf R
 * @since v0.4.2
 * @category Function
 * @sig (x1 -> x2 -> ... -> z) -> [(a -> b -> ... -> x1), (a -> b -> ... -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} after A function. `after` will be invoked with the return values of
 *        `fn1` and `fn2` as its arguments.
 * @param {Array} functions A list of functions.
 * @return {Function} A new function.
 * @see R.useWith
 * @example
 *
 *      var average = R.converge(R.divide, [R.sum, R.length])
 *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
 *
 *      var strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
 *      strangeConcat("Yodel") //=> "YODELyodel"
 *
 * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
 */
module.exports = _curry2(function converge(after, fns) {
  return curryN(reduce(max, 0, pluck('length', fns)), function() {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function(fn) {
      return fn.apply(context, args);
    }, fns));
  });
});


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NODE_ADDED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return nodeAdded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NODE_REMOVED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return nodeRemoved; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__);



/**
 * Node added action constant.
 *
 * @type {string}
 */
var NODE_ADDED = 'NODE_ADDED';

/**
 * Creates a new NODE_ADDED action.
 *
 * @param {Node} target - Mutation target.
 * @param {Node} node - Node added.
 * @returns {Action} Node added action.
 */
var nodeAdded = __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default()(function nodeAdded(target, node) {
  return {
    type: NODE_ADDED,
    payload: { target: target, node: node }
  };
});

/**
 * Node removed action constant.
 *
 * @type {string}
 */
var NODE_REMOVED = 'NODE_REMOVED';

/**
 * Creates a new NODE_REMOVED action.
 *
 * @param {Node} target - Mutation target.
 * @param {Node} node - Node removed.
 * @returns {Action} Node removed action.
 */
var nodeRemoved = __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default()(function nodeRemoved(target, node) {
  return {
    type: NODE_REMOVED,
    payload: { target: target, node: node }
  };
});

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);


/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      var t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
module.exports = _curry1(function always(val) {
  return function() {
    return val;
  };
});


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = reconcileTrees;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_memory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tree_create__ = __webpack_require__(13);




function reconcileTrees(transaction) {
  var state = transaction.state,
      domNode = transaction.domNode,
      markup = transaction.markup,
      options = transaction.options;
  var previousMarkup = state.previousMarkup;
  var inner = options.inner;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.

  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      Object(__WEBPACK_IMPORTED_MODULE_1__util_memory__["unprotectVTree"])(state.oldTree);
    }

    state.oldTree = Object(__WEBPACK_IMPORTED_MODULE_2__tree_create__["a" /* default */])(domNode);
    __WEBPACK_IMPORTED_MODULE_0__util_caches__["NodeCache"].set(state.oldTree, domNode);
    Object(__WEBPACK_IMPORTED_MODULE_1__util_memory__["protectVTree"])(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    transaction.newTree = Object(__WEBPACK_IMPORTED_MODULE_2__tree_create__["a" /* default */])(markup);
  }

  // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.
  if (inner) {
    var oldTree = transaction.oldTree,
        newTree = transaction.newTree;
    var rawNodeName = oldTree.rawNodeName,
        nodeName = oldTree.nodeName,
        attributes = oldTree.attributes;

    var isUnknown = typeof newTree.rawNodeName !== 'string';
    var isFragment = newTree.nodeType === 11;
    var children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = Object(__WEBPACK_IMPORTED_MODULE_2__tree_create__["a" /* default */])(nodeName, attributes, children);
  }
}

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export marks */
/* unused harmony export prefix */
var marks = new Map();
var prefix = 'diffHTML';
var DIFF_PERF = 'diff_perf';

var hasSearch = typeof location !== 'undefined';
var hasArguments = typeof process !== 'undefined' && process.argv;
var nop = function nop() {};

/* harmony default export */ __webpack_exports__["a"] = (function (domNode, vTree) {
  // Check for these changes on every check.
  var wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  var wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  var wantsPerfChecks = wantsSearch || wantsArguments;

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return function (name) {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = domNode.host.constructor.name + ' ' + name;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = vTree.rawNodeName.name + ' ' + name;
    }

    var endName = name + '-end';

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      var totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(prefix + ' ' + name + ' (' + totalMs + 'ms)', name, endName);
    }
  };
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addTransitionState;
/* harmony export (immutable) */ __webpack_exports__["b"] = removeTransitionState;
/* harmony export (immutable) */ __webpack_exports__["c"] = runTransitions;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_process__ = __webpack_require__(8);
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}




// Available transition states.
var stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) {
  return __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].set(stateName, new Set());
});

function addTransitionState(stateName, callback) {
  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error('Invalid state name \'' + stateName + '\'');
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !stateNames.includes(stateName)) {
      throw new Error('Invalid state name \'' + stateName + '\'');
    }
  }

  // Remove all transition callbacks from state.
  if (!callback && stateName) {
    __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {
      __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (var i = 0; i < stateNames.length; i++) {
          __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var set = __WEBPACK_IMPORTED_MODULE_0__util_caches__["TransitionCache"].get(setName);
  var promises = [];

  if (!set.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set.forEach(function (callback) {
    var retVal = callback.apply(undefined, args);

    // Is a `thennable` object or Native Promise.
    if ((typeof retVal === 'undefined' ? 'undefined' : _typeof(retVal)) === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    var element = args[0];

    [].concat(_toConsumableArray(element.childNodes)).forEach(function (childNode) {
      promises.push.apply(promises, _toConsumableArray(runTransitions.apply(undefined, [setName, childNode].concat(_toConsumableArray(args.slice(1))))));
    });
  }

  return promises;
}

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RAF */
/* unused harmony export rafAction */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return raf$; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);


/**
 * Emitted on requestAnimationFrame callbacks.
 *
 * @type {string}
 */
var RAF = 'RAF';

/**
 * Create a new raf action.
 *
 * @param {number} time - rAF time.
 * @returns {Action} raf Action.
 */
function rafAction(time) {
    return {
        type: RAF,
        payload: { time: time }
    };
}

/**
 * Stream of requestAnimationFrame events.
 *
 * Used to schedule renders.
 *
 * @type {Kefir.Stream<T, S>}
 */
var raf$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
    var loop = void 0;
    var enabled = true;

    (function schedule() {
        loop = requestAnimationFrame(function (time) {
            emitter.value(rafAction(time));

            if (enabled) {
                schedule();
            }
        });
    })();

    return function () {
        cancelAnimationFrame(loop);
        enabled = false;
    };
});

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = registerElementAnimations;
/* harmony export (immutable) */ __webpack_exports__["b"] = wrapEffect;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(2);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




var animated = new Map();

var meta = {
    'attached': function attached(container, target, parent) {
        return { container: container, target: target, parent: parent };
    },
    'detached': function detached(container, target, parent) {
        return { container: container, target: target, parent: parent };
    },
    'replaced': function replaced(container, outgoing, parent, incoming) {
        return { container: container, parent: parent, incoming: incoming, outgoing: outgoing };
    }
};

/**
 * Register a container element with its animation configuration.
 *
 * @param {Element} el - Container element to register.
 * @param {Object} animations - Animations to register to this element.
 * @returns {Observable} Stream to register & unregister from
 */
function registerElementAnimations(el, animations) {
    return __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function () {
        animated.set(el, animations);
        return function () {
            return animated.delete(el);
        };
    });
}

/**
 * Generates a new effect$ by passing the provided effect$ to any
 * appropriately registered animation configuration.
 *
 * @param {string} type - Animation type.
 * @param {Observable} effect$ - Side effect-wrapping observable.
 * @param {Element} container - Container element for effect.
 * @param {Element} target - Element effect is operating on.
 * @param {Object} args - Extra args to pass to the meta function.
 * @returns {Observable} New side effect-wrapping observable.
 */
function wrapEffect(type, effect$, container, target) {
    if (target.nodeType === 3) {
        target = target.parentNode;

        // Handle orphan text nodes.
        if (!target) {
            return effect$;
        }
    }

    if (!target.hasAttribute(__WEBPACK_IMPORTED_MODULE_1__constants__["b" /* ANIMATE_ATTRIBUTE */])) {
        return effect$;
    }

    var name = target.getAttribute(__WEBPACK_IMPORTED_MODULE_1__constants__["b" /* ANIMATE_ATTRIBUTE */]);
    var animations = animated.get(container);

    if (!animations) {
        return effect$;
    }

    var config = animations[name];

    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object') {
        return effect$;
    }

    var callback = config[type];

    if (typeof callback !== 'function') {
        return effect$;
    }

    for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
        args[_key - 4] = arguments[_key];
    }

    return callback(effect$, typeof meta[type] === 'function' ? meta[type].apply(meta, [container, target].concat(args)) : {});
}

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__children__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__combineActionReducers__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__component__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__domDelta__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__events__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__observeDelta__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__render__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__rAF__ = __webpack_require__(49);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Kefir", function() { return __WEBPACK_IMPORTED_MODULE_0__kefir__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "children", function() { return __WEBPACK_IMPORTED_MODULE_1__children__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineActionReducers", function() { return __WEBPACK_IMPORTED_MODULE_2__combineActionReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "component", function() { return __WEBPACK_IMPORTED_MODULE_3__component__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "events", function() { return __WEBPACK_IMPORTED_MODULE_5__events__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "domDelta", function() { return __WEBPACK_IMPORTED_MODULE_4__domDelta__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "observeDelta", function() { return __WEBPACK_IMPORTED_MODULE_6__observeDelta__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "animateAttribute", function() { return __WEBPACK_IMPORTED_MODULE_7__helpers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "containerAttribute", function() { return __WEBPACK_IMPORTED_MODULE_7__helpers__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "eventAttribute", function() { return __WEBPACK_IMPORTED_MODULE_7__helpers__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mapActionTo", function() { return __WEBPACK_IMPORTED_MODULE_7__helpers__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return __WEBPACK_IMPORTED_MODULE_8__render__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "raf$", function() { return __WEBPACK_IMPORTED_MODULE_9__rAF__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "renderFromHTML", function() { return __WEBPACK_IMPORTED_MODULE_8__render__["b"]; });













/* harmony default export */ __webpack_exports__["default"] = ({ Kefir: __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */], children: __WEBPACK_IMPORTED_MODULE_1__children__["a" /* default */], combineActionReducers: __WEBPACK_IMPORTED_MODULE_2__combineActionReducers__["a" /* default */], component: __WEBPACK_IMPORTED_MODULE_3__component__["a" /* default */], events: __WEBPACK_IMPORTED_MODULE_5__events__["a" /* default */], domDelta: __WEBPACK_IMPORTED_MODULE_4__domDelta__["a" /* default */],
    observeDelta: __WEBPACK_IMPORTED_MODULE_6__observeDelta__["a" /* default */], containerAttribute: __WEBPACK_IMPORTED_MODULE_7__helpers__["b" /* containerAttribute */], eventAttribute: __WEBPACK_IMPORTED_MODULE_7__helpers__["c" /* eventAttribute */],
    mapActionTo: __WEBPACK_IMPORTED_MODULE_7__helpers__["d" /* mapActionTo */], render: __WEBPACK_IMPORTED_MODULE_8__render__["a" /* default */], raf$: __WEBPACK_IMPORTED_MODULE_9__rAF__["a" /* raf$ */], renderFromHTML: __WEBPACK_IMPORTED_MODULE_8__render__["b" /* renderFromHTML */] });

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*! Kefir.js v3.7.1
 *  https://github.com/rpominov/kefir
 */

(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Kefir = global.Kefir || {})));
}(this, function (exports) { 'use strict';

	function createObj(proto) {
	  var F = function () {};
	  F.prototype = proto;
	  return new F();
	}

	function extend(target /*, mixin1, mixin2...*/) {
	  var length = arguments.length,
	      i = void 0,
	      prop = void 0;
	  for (i = 1; i < length; i++) {
	    for (prop in arguments[i]) {
	      target[prop] = arguments[i][prop];
	    }
	  }
	  return target;
	}

	function inherit(Child, Parent /*, mixin1, mixin2...*/) {
	  var length = arguments.length,
	      i = void 0;
	  Child.prototype = createObj(Parent.prototype);
	  Child.prototype.constructor = Child;
	  for (i = 2; i < length; i++) {
	    extend(Child.prototype, arguments[i]);
	  }
	  return Child;
	}

	var NOTHING = ['<nothing>'];
	var END = 'end';
	var VALUE = 'value';
	var ERROR = 'error';
	var ANY = 'any';

	function concat(a, b) {
	  var result = void 0,
	      length = void 0,
	      i = void 0,
	      j = void 0;
	  if (a.length === 0) {
	    return b;
	  }
	  if (b.length === 0) {
	    return a;
	  }
	  j = 0;
	  result = new Array(a.length + b.length);
	  length = a.length;
	  for (i = 0; i < length; i++, j++) {
	    result[j] = a[i];
	  }
	  length = b.length;
	  for (i = 0; i < length; i++, j++) {
	    result[j] = b[i];
	  }
	  return result;
	}

	function find(arr, value) {
	  var length = arr.length,
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    if (arr[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function findByPred(arr, pred) {
	  var length = arr.length,
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    if (pred(arr[i])) {
	      return i;
	    }
	  }
	  return -1;
	}

	function cloneArray(input) {
	  var length = input.length,
	      result = new Array(length),
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    result[i] = input[i];
	  }
	  return result;
	}

	function remove(input, index) {
	  var length = input.length,
	      result = void 0,
	      i = void 0,
	      j = void 0;
	  if (index >= 0 && index < length) {
	    if (length === 1) {
	      return [];
	    } else {
	      result = new Array(length - 1);
	      for (i = 0, j = 0; i < length; i++) {
	        if (i !== index) {
	          result[j] = input[i];
	          j++;
	        }
	      }
	      return result;
	    }
	  } else {
	    return input;
	  }
	}

	function map(input, fn) {
	  var length = input.length,
	      result = new Array(length),
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    result[i] = fn(input[i]);
	  }
	  return result;
	}

	function forEach(arr, fn) {
	  var length = arr.length,
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    fn(arr[i]);
	  }
	}

	function fillArray(arr, value) {
	  var length = arr.length,
	      i = void 0;
	  for (i = 0; i < length; i++) {
	    arr[i] = value;
	  }
	}

	function contains(arr, value) {
	  return find(arr, value) !== -1;
	}

	function slide(cur, next, max) {
	  var length = Math.min(max, cur.length + 1),
	      offset = cur.length - length + 1,
	      result = new Array(length),
	      i = void 0;
	  for (i = offset; i < length; i++) {
	    result[i - offset] = cur[i];
	  }
	  result[length - 1] = next;
	  return result;
	}

	function callSubscriber(type, fn, event) {
	  if (type === ANY) {
	    fn(event);
	  } else if (type === event.type) {
	    if (type === VALUE || type === ERROR) {
	      fn(event.value);
	    } else {
	      fn();
	    }
	  }
	}

	function Dispatcher() {
	  this._items = [];
	  this._spies = [];
	  this._inLoop = 0;
	  this._removedItems = null;
	}

	extend(Dispatcher.prototype, {
	  add: function (type, fn) {
	    this._items = concat(this._items, [{ type: type, fn: fn }]);
	    return this._items.length;
	  },
	  remove: function (type, fn) {
	    var index = findByPred(this._items, function (x) {
	      return x.type === type && x.fn === fn;
	    });

	    // if we're currently in a notification loop,
	    // remember this subscriber was removed
	    if (this._inLoop !== 0 && index !== -1) {
	      if (this._removedItems === null) {
	        this._removedItems = [];
	      }
	      this._removedItems.push(this._items[index]);
	    }

	    this._items = remove(this._items, index);
	    return this._items.length;
	  },
	  addSpy: function (fn) {
	    this._spies = concat(this._spies, [fn]);
	    return this._spies.length;
	  },


	  // Because spies are only ever a function that perform logging as
	  // their only side effect, we don't need the same complicated
	  // removal logic like in remove()
	  removeSpy: function (fn) {
	    this._spies = remove(this._spies, this._spies.indexOf(fn));
	    return this._spies.length;
	  },
	  dispatch: function (event) {
	    this._inLoop++;
	    for (var i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
	      spies[i](event);
	    }

	    for (var _i = 0, items = this._items; _i < items.length; _i++) {

	      // cleanup was called
	      if (this._items === null) {
	        break;
	      }

	      // this subscriber was removed
	      if (this._removedItems !== null && contains(this._removedItems, items[_i])) {
	        continue;
	      }

	      callSubscriber(items[_i].type, items[_i].fn, event);
	    }
	    this._inLoop--;
	    if (this._inLoop === 0) {
	      this._removedItems = null;
	    }
	  },
	  cleanup: function () {
	    this._items = null;
	    this._spies = null;
	  }
	});

	function Observable() {
	  this._dispatcher = new Dispatcher();
	  this._active = false;
	  this._alive = true;
	  this._activating = false;
	  this._logHandlers = null;
	  this._spyHandlers = null;
	}

	extend(Observable.prototype, {

	  _name: 'observable',

	  _onActivation: function () {},
	  _onDeactivation: function () {},
	  _setActive: function (active) {
	    if (this._active !== active) {
	      this._active = active;
	      if (active) {
	        this._activating = true;
	        this._onActivation();
	        this._activating = false;
	      } else {
	        this._onDeactivation();
	      }
	    }
	  },
	  _clear: function () {
	    this._setActive(false);
	    this._dispatcher.cleanup();
	    this._dispatcher = null;
	    this._logHandlers = null;
	  },
	  _emit: function (type, x) {
	    switch (type) {
	      case VALUE:
	        return this._emitValue(x);
	      case ERROR:
	        return this._emitError(x);
	      case END:
	        return this._emitEnd();
	    }
	  },
	  _emitValue: function (value) {
	    if (this._alive) {
	      this._dispatcher.dispatch({ type: VALUE, value: value });
	    }
	  },
	  _emitError: function (value) {
	    if (this._alive) {
	      this._dispatcher.dispatch({ type: ERROR, value: value });
	    }
	  },
	  _emitEnd: function () {
	    if (this._alive) {
	      this._alive = false;
	      this._dispatcher.dispatch({ type: END });
	      this._clear();
	    }
	  },
	  _on: function (type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    } else {
	      callSubscriber(type, fn, { type: END });
	    }
	    return this;
	  },
	  _off: function (type, fn) {
	    if (this._alive) {
	      var count = this._dispatcher.remove(type, fn);
	      if (count === 0) {
	        this._setActive(false);
	      }
	    }
	    return this;
	  },
	  onValue: function (fn) {
	    return this._on(VALUE, fn);
	  },
	  onError: function (fn) {
	    return this._on(ERROR, fn);
	  },
	  onEnd: function (fn) {
	    return this._on(END, fn);
	  },
	  onAny: function (fn) {
	    return this._on(ANY, fn);
	  },
	  offValue: function (fn) {
	    return this._off(VALUE, fn);
	  },
	  offError: function (fn) {
	    return this._off(ERROR, fn);
	  },
	  offEnd: function (fn) {
	    return this._off(END, fn);
	  },
	  offAny: function (fn) {
	    return this._off(ANY, fn);
	  },
	  observe: function (observerOrOnValue, onError, onEnd) {
	    var _this = this;
	    var closed = false;

	    var observer = !observerOrOnValue || typeof observerOrOnValue === 'function' ? { value: observerOrOnValue, error: onError, end: onEnd } : observerOrOnValue;

	    var handler = function (event) {
	      if (event.type === END) {
	        closed = true;
	      }
	      if (event.type === VALUE && observer.value) {
	        observer.value(event.value);
	      } else if (event.type === ERROR && observer.error) {
	        observer.error(event.value);
	      } else if (event.type === END && observer.end) {
	        observer.end(event.value);
	      }
	    };

	    this.onAny(handler);

	    return {
	      unsubscribe: function () {
	        if (!closed) {
	          _this.offAny(handler);
	          closed = true;
	        }
	      },

	      get closed() {
	        return closed;
	      }
	    };
	  },


	  // A and B must be subclasses of Stream and Property (order doesn't matter)
	  _ofSameType: function (A, B) {
	    return A.prototype.getType() === this.getType() ? A : B;
	  },
	  setName: function (sourceObs /* optional */, selfName) {
	    this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
	    return this;
	  },
	  log: function () {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();


	    var isCurrent = void 0;
	    var handler = function (event) {
	      var type = '<' + event.type + (isCurrent ? ':current' : '') + '>';
	      if (event.type === END) {
	        console.log(name, type);
	      } else {
	        console.log(name, type, event.value);
	      }
	    };

	    if (this._alive) {
	      if (!this._logHandlers) {
	        this._logHandlers = [];
	      }
	      this._logHandlers.push({ name: name, handler: handler });
	    }

	    isCurrent = true;
	    this.onAny(handler);
	    isCurrent = false;

	    return this;
	  },
	  offLog: function () {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();


	    if (this._logHandlers) {
	      var handlerIndex = findByPred(this._logHandlers, function (obj) {
	        return obj.name === name;
	      });
	      if (handlerIndex !== -1) {
	        this.offAny(this._logHandlers[handlerIndex].handler);
	        this._logHandlers.splice(handlerIndex, 1);
	      }
	    }

	    return this;
	  },
	  spy: function () {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();

	    var handler = function (event) {
	      var type = '<' + event.type + '>';
	      if (event.type === END) {
	        console.log(name, type);
	      } else {
	        console.log(name, type, event.value);
	      }
	    };
	    if (this._alive) {
	      if (!this._spyHandlers) {
	        this._spyHandlers = [];
	      }
	      this._spyHandlers.push({ name: name, handler: handler });
	      this._dispatcher.addSpy(handler);
	    }
	    return this;
	  },
	  offSpy: function () {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.toString();

	    if (this._spyHandlers) {
	      var handlerIndex = findByPred(this._spyHandlers, function (obj) {
	        return obj.name === name;
	      });
	      if (handlerIndex !== -1) {
	        this._dispatcher.removeSpy(this._spyHandlers[handlerIndex].handler);
	        this._spyHandlers.splice(handlerIndex, 1);
	      }
	    }
	    return this;
	  }
	});

	// extend() can't handle `toString` in IE8
	Observable.prototype.toString = function () {
	  return '[' + this._name + ']';
	};

	function Stream() {
	  Observable.call(this);
	}

	inherit(Stream, Observable, {

	  _name: 'stream',

	  getType: function () {
	    return 'stream';
	  }
	});

	function Property() {
	  Observable.call(this);
	  this._currentEvent = null;
	}

	inherit(Property, Observable, {

	  _name: 'property',

	  _emitValue: function (value) {
	    if (this._alive) {
	      this._currentEvent = { type: VALUE, value: value };
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: VALUE, value: value });
	      }
	    }
	  },
	  _emitError: function (value) {
	    if (this._alive) {
	      this._currentEvent = { type: ERROR, value: value };
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: ERROR, value: value });
	      }
	    }
	  },
	  _emitEnd: function () {
	    if (this._alive) {
	      this._alive = false;
	      if (!this._activating) {
	        this._dispatcher.dispatch({ type: END });
	      }
	      this._clear();
	    }
	  },
	  _on: function (type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    }
	    if (this._currentEvent !== null) {
	      callSubscriber(type, fn, this._currentEvent);
	    }
	    if (!this._alive) {
	      callSubscriber(type, fn, { type: END });
	    }
	    return this;
	  },
	  getType: function () {
	    return 'property';
	  }
	});

	var neverS = new Stream();
	neverS._emitEnd();
	neverS._name = 'never';

	function never() {
	  return neverS;
	}

	function timeBased(mixin) {

	  function AnonymousStream(wait, options) {
	    var _this = this;

	    Stream.call(this);
	    this._wait = wait;
	    this._intervalId = null;
	    this._$onTick = function () {
	      return _this._onTick();
	    };
	    this._init(options);
	  }

	  inherit(AnonymousStream, Stream, {
	    _init: function () {},
	    _free: function () {},
	    _onTick: function () {},
	    _onActivation: function () {
	      this._intervalId = setInterval(this._$onTick, this._wait);
	    },
	    _onDeactivation: function () {
	      if (this._intervalId !== null) {
	        clearInterval(this._intervalId);
	        this._intervalId = null;
	      }
	    },
	    _clear: function () {
	      Stream.prototype._clear.call(this);
	      this._$onTick = null;
	      this._free();
	    }
	  }, mixin);

	  return AnonymousStream;
	}

	var S = timeBased({

	  _name: 'later',

	  _init: function (_ref) {
	    var x = _ref.x;

	    this._x = x;
	  },
	  _free: function () {
	    this._x = null;
	  },
	  _onTick: function () {
	    this._emitValue(this._x);
	    this._emitEnd();
	  }
	});

	function later(wait, x) {
	  return new S(wait, { x: x });
	}

	var S$1 = timeBased({

	  _name: 'interval',

	  _init: function (_ref) {
	    var x = _ref.x;

	    this._x = x;
	  },
	  _free: function () {
	    this._x = null;
	  },
	  _onTick: function () {
	    this._emitValue(this._x);
	  }
	});

	function interval(wait, x) {
	  return new S$1(wait, { x: x });
	}

	var S$2 = timeBased({

	  _name: 'sequentially',

	  _init: function (_ref) {
	    var xs = _ref.xs;

	    this._xs = cloneArray(xs);
	  },
	  _free: function () {
	    this._xs = null;
	  },
	  _onTick: function () {
	    if (this._xs.length === 1) {
	      this._emitValue(this._xs[0]);
	      this._emitEnd();
	    } else {
	      this._emitValue(this._xs.shift());
	    }
	  }
	});

	function sequentially(wait, xs) {
	  return xs.length === 0 ? never() : new S$2(wait, { xs: xs });
	}

	var S$3 = timeBased({

	  _name: 'fromPoll',

	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _onTick: function () {
	    var fn = this._fn;
	    this._emitValue(fn());
	  }
	});

	function fromPoll(wait, fn) {
	  return new S$3(wait, { fn: fn });
	}

	function emitter(obs) {

	  function value(x) {
	    obs._emitValue(x);
	    return obs._active;
	  }

	  function error(x) {
	    obs._emitError(x);
	    return obs._active;
	  }

	  function end() {
	    obs._emitEnd();
	    return obs._active;
	  }

	  function event(e) {
	    obs._emit(e.type, e.value);
	    return obs._active;
	  }

	  return {
	    value: value,
	    error: error,
	    end: end,
	    event: event,

	    // legacy
	    emit: value,
	    emitEvent: event
	  };
	}

	var S$4 = timeBased({

	  _name: 'withInterval',

	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	    this._emitter = emitter(this);
	  },
	  _free: function () {
	    this._fn = null;
	    this._emitter = null;
	  },
	  _onTick: function () {
	    var fn = this._fn;
	    fn(this._emitter);
	  }
	});

	function withInterval(wait, fn) {
	  return new S$4(wait, { fn: fn });
	}

	function S$5(fn) {
	  Stream.call(this);
	  this._fn = fn;
	  this._unsubscribe = null;
	}

	inherit(S$5, Stream, {

	  _name: 'stream',

	  _onActivation: function () {
	    var fn = this._fn;
	    var unsubscribe = fn(emitter(this));
	    this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;

	    // fix https://github.com/rpominov/kefir/issues/35
	    if (!this._active) {
	      this._callUnsubscribe();
	    }
	  },
	  _callUnsubscribe: function () {
	    if (this._unsubscribe !== null) {
	      this._unsubscribe();
	      this._unsubscribe = null;
	    }
	  },
	  _onDeactivation: function () {
	    this._callUnsubscribe();
	  },
	  _clear: function () {
	    Stream.prototype._clear.call(this);
	    this._fn = null;
	  }
	});

	function stream(fn) {
	  return new S$5(fn);
	}

	function fromCallback(callbackConsumer) {

	  var called = false;

	  return stream(function (emitter) {

	    if (!called) {
	      callbackConsumer(function (x) {
	        emitter.emit(x);
	        emitter.end();
	      });
	      called = true;
	    }
	  }).setName('fromCallback');
	}

	function fromNodeCallback(callbackConsumer) {

	  var called = false;

	  return stream(function (emitter) {

	    if (!called) {
	      callbackConsumer(function (error, x) {
	        if (error) {
	          emitter.error(error);
	        } else {
	          emitter.emit(x);
	        }
	        emitter.end();
	      });
	      called = true;
	    }
	  }).setName('fromNodeCallback');
	}

	function spread(fn, length) {
	  switch (length) {
	    case 0:
	      return function () {
	        return fn();
	      };
	    case 1:
	      return function (a) {
	        return fn(a[0]);
	      };
	    case 2:
	      return function (a) {
	        return fn(a[0], a[1]);
	      };
	    case 3:
	      return function (a) {
	        return fn(a[0], a[1], a[2]);
	      };
	    case 4:
	      return function (a) {
	        return fn(a[0], a[1], a[2], a[3]);
	      };
	    default:
	      return function (a) {
	        return fn.apply(null, a);
	      };
	  }
	}

	function apply(fn, c, a) {
	  var aLength = a ? a.length : 0;
	  if (c == null) {
	    switch (aLength) {
	      case 0:
	        return fn();
	      case 1:
	        return fn(a[0]);
	      case 2:
	        return fn(a[0], a[1]);
	      case 3:
	        return fn(a[0], a[1], a[2]);
	      case 4:
	        return fn(a[0], a[1], a[2], a[3]);
	      default:
	        return fn.apply(null, a);
	    }
	  } else {
	    switch (aLength) {
	      case 0:
	        return fn.call(c);
	      default:
	        return fn.apply(c, a);
	    }
	  }
	}

	function fromSubUnsub(sub, unsub, transformer /* Function | falsey */) {
	  return stream(function (emitter) {

	    var handler = transformer ? function () {
	      emitter.emit(apply(transformer, this, arguments));
	    } : function (x) {
	      emitter.emit(x);
	    };

	    sub(handler);
	    return function () {
	      return unsub(handler);
	    };
	  }).setName('fromSubUnsub');
	}

	var pairs = [['addEventListener', 'removeEventListener'], ['addListener', 'removeListener'], ['on', 'off']];

	function fromEvents(target, eventName, transformer) {
	  var sub = void 0,
	      unsub = void 0;

	  for (var i = 0; i < pairs.length; i++) {
	    if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
	      sub = pairs[i][0];
	      unsub = pairs[i][1];
	      break;
	    }
	  }

	  if (sub === undefined) {
	    throw new Error('target don\'t support any of ' + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
	  }

	  return fromSubUnsub(function (handler) {
	    return target[sub](eventName, handler);
	  }, function (handler) {
	    return target[unsub](eventName, handler);
	  }, transformer).setName('fromEvents');
	}

	// HACK:
	//   We don't call parent Class constructor, but instead putting all necessary
	//   properties into prototype to simulate ended Property
	//   (see Propperty and Observable classes).

	function P(value) {
	  this._currentEvent = { type: 'value', value: value, current: true };
	}

	inherit(P, Property, {
	  _name: 'constant',
	  _active: false,
	  _activating: false,
	  _alive: false,
	  _dispatcher: null,
	  _logHandlers: null
	});

	function constant(x) {
	  return new P(x);
	}

	// HACK:
	//   We don't call parent Class constructor, but instead putting all necessary
	//   properties into prototype to simulate ended Property
	//   (see Propperty and Observable classes).

	function P$1(value) {
	  this._currentEvent = { type: 'error', value: value, current: true };
	}

	inherit(P$1, Property, {
	  _name: 'constantError',
	  _active: false,
	  _activating: false,
	  _alive: false,
	  _dispatcher: null,
	  _logHandlers: null
	});

	function constantError(x) {
	  return new P$1(x);
	}

	function createConstructor(BaseClass, name) {
	  return function AnonymousObservable(source, options) {
	    var _this = this;

	    BaseClass.call(this);
	    this._source = source;
	    this._name = source._name + '.' + name;
	    this._init(options);
	    this._$handleAny = function (event) {
	      return _this._handleAny(event);
	    };
	  };
	}

	function createClassMethods(BaseClass) {
	  return {
	    _init: function () {},
	    _free: function () {},
	    _handleValue: function (x) {
	      this._emitValue(x);
	    },
	    _handleError: function (x) {
	      this._emitError(x);
	    },
	    _handleEnd: function () {
	      this._emitEnd();
	    },
	    _handleAny: function (event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handleValue(event.value);
	        case ERROR:
	          return this._handleError(event.value);
	        case END:
	          return this._handleEnd();
	      }
	    },
	    _onActivation: function () {
	      this._source.onAny(this._$handleAny);
	    },
	    _onDeactivation: function () {
	      this._source.offAny(this._$handleAny);
	    },
	    _clear: function () {
	      BaseClass.prototype._clear.call(this);
	      this._source = null;
	      this._$handleAny = null;
	      this._free();
	    }
	  };
	}

	function createStream(name, mixin) {
	  var S = createConstructor(Stream, name);
	  inherit(S, Stream, createClassMethods(Stream), mixin);
	  return S;
	}

	function createProperty(name, mixin) {
	  var P = createConstructor(Property, name);
	  inherit(P, Property, createClassMethods(Property), mixin);
	  return P;
	}

	var P$2 = createProperty('toProperty', {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._getInitialCurrent = fn;
	  },
	  _onActivation: function () {
	    if (this._getInitialCurrent !== null) {
	      var getInitial = this._getInitialCurrent;
	      this._emitValue(getInitial());
	    }
	    this._source.onAny(this._$handleAny); // copied from patterns/one-source
	  }
	});

	function toProperty(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	  if (fn !== null && typeof fn !== 'function') {
	    throw new Error('You should call toProperty() with a function or no arguments.');
	  }
	  return new P$2(obs, { fn: fn });
	}

	var S$6 = createStream('changes', {
	  _handleValue: function (x) {
	    if (!this._activating) {
	      this._emitValue(x);
	    }
	  },
	  _handleError: function (x) {
	    if (!this._activating) {
	      this._emitError(x);
	    }
	  }
	});

	function changes(obs) {
	  return new S$6(obs);
	}

	function fromPromise(promise) {

	  var called = false;

	  var result = stream(function (emitter) {
	    if (!called) {
	      var onValue = function (x) {
	        emitter.emit(x);
	        emitter.end();
	      };
	      var onError = function (x) {
	        emitter.error(x);
	        emitter.end();
	      };
	      var _promise = promise.then(onValue, onError);

	      // prevent libraries like 'Q' or 'when' from swallowing exceptions
	      if (_promise && typeof _promise.done === 'function') {
	        _promise.done();
	      }

	      called = true;
	    }
	  });

	  return toProperty(result, null).setName('fromPromise');
	}

	function getGlodalPromise() {
	  if (typeof Promise === 'function') {
	    return Promise;
	  } else {
	    throw new Error('There isn\'t default Promise, use shim or parameter');
	  }
	}

	function toPromise (obs) {
	  var Promise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getGlodalPromise();

	  var last = null;
	  return new Promise(function (resolve, reject) {
	    obs.onAny(function (event) {
	      if (event.type === END && last !== null) {
	        (last.type === VALUE ? resolve : reject)(last.value);
	        last = null;
	      } else {
	        last = event;
	      }
	    });
	  });
	}

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var ponyfill = createCommonjsModule(function (module, exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};
	});

	var require$$0$1 = (ponyfill && typeof ponyfill === 'object' && 'default' in ponyfill ? ponyfill['default'] : ponyfill);

	var index$1 = createCommonjsModule(function (module, exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ponyfill = require$$0$1;

	var _ponyfill2 = _interopRequireDefault(_ponyfill);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var root; /* global window */

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof commonjsGlobal !== 'undefined') {
	  root = commonjsGlobal;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	});

	var require$$0 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

	var index = createCommonjsModule(function (module) {
	module.exports = require$$0;
	});

	var $$observable = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	function fromESObservable(_observable) {
	  var observable = _observable[$$observable] ? _observable[$$observable]() : _observable;
	  return stream(function (emitter) {
	    var unsub = observable.subscribe({
	      error: function (error) {
	        emitter.error(error);
	        emitter.end();
	      },
	      next: function (value) {
	        emitter.emit(value);
	      },
	      complete: function () {
	        emitter.end();
	      }
	    });

	    if (unsub.unsubscribe) {
	      return function () {
	        unsub.unsubscribe();
	      };
	    } else {
	      return unsub;
	    }
	  }).setName('fromESObservable');
	}

	function ESObservable(observable) {
	  this._observable = observable.takeErrors(1);
	}

	extend(ESObservable.prototype, {
	  subscribe: function (observerOrOnNext, onError, onComplete) {
	    var _this = this;

	    var observer = typeof observerOrOnNext === 'function' ? { next: observerOrOnNext, error: onError, complete: onComplete } : observerOrOnNext;

	    var fn = function (event) {
	      if (event.type === END) {
	        closed = true;
	      }

	      if (event.type === VALUE && observer.next) {
	        observer.next(event.value);
	      } else if (event.type === ERROR && observer.error) {
	        observer.error(event.value);
	      } else if (event.type === END && observer.complete) {
	        observer.complete(event.value);
	      }
	    };

	    this._observable.onAny(fn);
	    var closed = false;

	    var subscription = {
	      unsubscribe: function () {
	        closed = true;
	        _this._observable.offAny(fn);
	      },
	      get closed() {
	        return closed;
	      }
	    };
	    return subscription;
	  }
	});

	// Need to assign directly b/c Symbols aren't enumerable.
	ESObservable.prototype[$$observable] = function () {
	  return this;
	};

	function toESObservable() {
	  return new ESObservable(this);
	}

	function collect(source, keys, values) {
	  for (var prop in source) {
	    if (source.hasOwnProperty(prop)) {
	      keys.push(prop);
	      values.push(source[prop]);
	    }
	  }
	}

	function defaultErrorsCombinator(errors) {
	  var latestError = void 0;
	  for (var i = 0; i < errors.length; i++) {
	    if (errors[i] !== undefined) {
	      if (latestError === undefined || latestError.index < errors[i].index) {
	        latestError = errors[i];
	      }
	    }
	  }
	  return latestError.error;
	}

	function Combine(active, passive, combinator) {
	  var _this = this;

	  Stream.call(this);
	  this._activeCount = active.length;
	  this._sources = concat(active, passive);
	  this._combinator = combinator;
	  this._aliveCount = 0;
	  this._latestValues = new Array(this._sources.length);
	  this._latestErrors = new Array(this._sources.length);
	  fillArray(this._latestValues, NOTHING);
	  this._emitAfterActivation = false;
	  this._endAfterActivation = false;
	  this._latestErrorIndex = 0;

	  this._$handlers = [];

	  var _loop = function (i) {
	    _this._$handlers.push(function (event) {
	      return _this._handleAny(i, event);
	    });
	  };

	  for (var i = 0; i < this._sources.length; i++) {
	    _loop(i);
	  }
	}

	inherit(Combine, Stream, {

	  _name: 'combine',

	  _onActivation: function () {
	    this._aliveCount = this._activeCount;

	    // we need to suscribe to _passive_ sources before _active_
	    // (see https://github.com/rpominov/kefir/issues/98)
	    for (var i = this._activeCount; i < this._sources.length; i++) {
	      this._sources[i].onAny(this._$handlers[i]);
	    }
	    for (var _i = 0; _i < this._activeCount; _i++) {
	      this._sources[_i].onAny(this._$handlers[_i]);
	    }

	    if (this._emitAfterActivation) {
	      this._emitAfterActivation = false;
	      this._emitIfFull();
	    }
	    if (this._endAfterActivation) {
	      this._emitEnd();
	    }
	  },
	  _onDeactivation: function () {
	    var length = this._sources.length,
	        i = void 0;
	    for (i = 0; i < length; i++) {
	      this._sources[i].offAny(this._$handlers[i]);
	    }
	  },
	  _emitIfFull: function () {
	    var hasAllValues = true;
	    var hasErrors = false;
	    var length = this._latestValues.length;
	    var valuesCopy = new Array(length);
	    var errorsCopy = new Array(length);

	    for (var i = 0; i < length; i++) {
	      valuesCopy[i] = this._latestValues[i];
	      errorsCopy[i] = this._latestErrors[i];

	      if (valuesCopy[i] === NOTHING) {
	        hasAllValues = false;
	      }

	      if (errorsCopy[i] !== undefined) {
	        hasErrors = true;
	      }
	    }

	    if (hasAllValues) {
	      var combinator = this._combinator;
	      this._emitValue(combinator(valuesCopy));
	    }
	    if (hasErrors) {
	      this._emitError(defaultErrorsCombinator(errorsCopy));
	    }
	  },
	  _handleAny: function (i, event) {

	    if (event.type === VALUE || event.type === ERROR) {

	      if (event.type === VALUE) {
	        this._latestValues[i] = event.value;
	        this._latestErrors[i] = undefined;
	      }
	      if (event.type === ERROR) {
	        this._latestValues[i] = NOTHING;
	        this._latestErrors[i] = {
	          index: this._latestErrorIndex++,
	          error: event.value
	        };
	      }

	      if (i < this._activeCount) {
	        if (this._activating) {
	          this._emitAfterActivation = true;
	        } else {
	          this._emitIfFull();
	        }
	      }
	    } else {
	      // END

	      if (i < this._activeCount) {
	        this._aliveCount--;
	        if (this._aliveCount === 0) {
	          if (this._activating) {
	            this._endAfterActivation = true;
	          } else {
	            this._emitEnd();
	          }
	        }
	      }
	    }
	  },
	  _clear: function () {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._latestValues = null;
	    this._latestErrors = null;
	    this._combinator = null;
	    this._$handlers = null;
	  }
	});

	function combineAsArray(active) {
	  var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var combinator = arguments[2];

	  if (!Array.isArray(passive)) {
	    throw new Error('Combine can only combine active and passive collections of the same type.');
	  }

	  combinator = combinator ? spread(combinator, active.length + passive.length) : function (x) {
	    return x;
	  };
	  return active.length === 0 ? never() : new Combine(active, passive, combinator);
	}

	function combineAsObject(active) {
	  var passive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var combinator = arguments[2];

	  if (typeof passive !== 'object' || Array.isArray(passive)) {
	    throw new Error('Combine can only combine active and passive collections of the same type.');
	  }

	  var keys = [],
	      activeObservables = [],
	      passiveObservables = [];

	  collect(active, keys, activeObservables);
	  collect(passive, keys, passiveObservables);

	  var objectify = function (values) {
	    var event = {};
	    for (var i = values.length - 1; 0 <= i; i--) {
	      event[keys[i]] = values[i];
	    }
	    return combinator ? combinator(event) : event;
	  };

	  return activeObservables.length === 0 ? never() : new Combine(activeObservables, passiveObservables, objectify);
	}

	function combine(active, passive, combinator) {
	  if (typeof passive === 'function') {
	    combinator = passive;
	    passive = undefined;
	  }

	  return Array.isArray(active) ? combineAsArray(active, passive, combinator) : combineAsObject(active, passive, combinator);
	}

	var Observable$1 = {
	  empty: function () {
	    return never();
	  },


	  // Monoid based on merge() seems more useful than one based on concat().
	  concat: function (a, b) {
	    return a.merge(b);
	  },
	  of: function (x) {
	    return constant(x);
	  },
	  map: function (fn, obs) {
	    return obs.map(fn);
	  },
	  bimap: function (fnErr, fnVal, obs) {
	    return obs.mapErrors(fnErr).map(fnVal);
	  },


	  // This ap strictly speaking incompatible with chain. If we derive ap from chain we get
	  // different (not very useful) behavior. But spec requires that if method can be derived
	  // it must have the same behavior as hand-written method. We intentionally violate the spec
	  // in hope that it won't cause many troubles in practice. And in return we have more useful type.
	  ap: function (obsFn, obsVal) {
	    return combine([obsFn, obsVal], function (fn, val) {
	      return fn(val);
	    });
	  },
	  chain: function (fn, obs) {
	    return obs.flatMap(fn);
	  }
	};



	var staticLand = Object.freeze({
	  Observable: Observable$1
	});

	var mixin = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    this._emitValue(fn(x));
	  }
	};

	var S$7 = createStream('map', mixin);
	var P$3 = createProperty('map', mixin);

	var id = function (x) {
	  return x;
	};

	function map$1(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id;

	  return new (obs._ofSameType(S$7, P$3))(obs, { fn: fn });
	}

	var mixin$1 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitValue(x);
	    }
	  }
	};

	var S$8 = createStream('filter', mixin$1);
	var P$4 = createProperty('filter', mixin$1);

	var id$1 = function (x) {
	  return x;
	};

	function filter(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$1;

	  return new (obs._ofSameType(S$8, P$4))(obs, { fn: fn });
	}

	var mixin$2 = {
	  _init: function (_ref) {
	    var n = _ref.n;

	    this._n = n;
	    if (n <= 0) {
	      this._emitEnd();
	    }
	  },
	  _handleValue: function (x) {
	    this._n--;
	    this._emitValue(x);
	    if (this._n === 0) {
	      this._emitEnd();
	    }
	  }
	};

	var S$9 = createStream('take', mixin$2);
	var P$5 = createProperty('take', mixin$2);

	function take(obs, n) {
	  return new (obs._ofSameType(S$9, P$5))(obs, { n: n });
	}

	var mixin$3 = {
	  _init: function (_ref) {
	    var n = _ref.n;

	    this._n = n;
	    if (n <= 0) {
	      this._emitEnd();
	    }
	  },
	  _handleError: function (x) {
	    this._n--;
	    this._emitError(x);
	    if (this._n === 0) {
	      this._emitEnd();
	    }
	  }
	};

	var S$10 = createStream('takeErrors', mixin$3);
	var P$6 = createProperty('takeErrors', mixin$3);

	function takeErrors(obs, n) {
	  return new (obs._ofSameType(S$10, P$6))(obs, { n: n });
	}

	var mixin$4 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitValue(x);
	    } else {
	      this._emitEnd();
	    }
	  }
	};

	var S$11 = createStream('takeWhile', mixin$4);
	var P$7 = createProperty('takeWhile', mixin$4);

	var id$2 = function (x) {
	  return x;
	};

	function takeWhile(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$2;

	  return new (obs._ofSameType(S$11, P$7))(obs, { fn: fn });
	}

	var mixin$5 = {
	  _init: function () {
	    this._lastValue = NOTHING;
	  },
	  _free: function () {
	    this._lastValue = null;
	  },
	  _handleValue: function (x) {
	    this._lastValue = x;
	  },
	  _handleEnd: function () {
	    if (this._lastValue !== NOTHING) {
	      this._emitValue(this._lastValue);
	    }
	    this._emitEnd();
	  }
	};

	var S$12 = createStream('last', mixin$5);
	var P$8 = createProperty('last', mixin$5);

	function last(obs) {
	  return new (obs._ofSameType(S$12, P$8))(obs);
	}

	var mixin$6 = {
	  _init: function (_ref) {
	    var n = _ref.n;

	    this._n = Math.max(0, n);
	  },
	  _handleValue: function (x) {
	    if (this._n === 0) {
	      this._emitValue(x);
	    } else {
	      this._n--;
	    }
	  }
	};

	var S$13 = createStream('skip', mixin$6);
	var P$9 = createProperty('skip', mixin$6);

	function skip(obs, n) {
	  return new (obs._ofSameType(S$13, P$9))(obs, { n: n });
	}

	var mixin$7 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    if (this._fn !== null && !fn(x)) {
	      this._fn = null;
	    }
	    if (this._fn === null) {
	      this._emitValue(x);
	    }
	  }
	};

	var S$14 = createStream('skipWhile', mixin$7);
	var P$10 = createProperty('skipWhile', mixin$7);

	var id$3 = function (x) {
	  return x;
	};

	function skipWhile(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$3;

	  return new (obs._ofSameType(S$14, P$10))(obs, { fn: fn });
	}

	var mixin$8 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	    this._prev = NOTHING;
	  },
	  _free: function () {
	    this._fn = null;
	    this._prev = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    if (this._prev === NOTHING || !fn(this._prev, x)) {
	      this._prev = x;
	      this._emitValue(x);
	    }
	  }
	};

	var S$15 = createStream('skipDuplicates', mixin$8);
	var P$11 = createProperty('skipDuplicates', mixin$8);

	var eq = function (a, b) {
	  return a === b;
	};

	function skipDuplicates(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : eq;

	  return new (obs._ofSameType(S$15, P$11))(obs, { fn: fn });
	}

	var mixin$9 = {
	  _init: function (_ref) {
	    var fn = _ref.fn,
	        seed = _ref.seed;

	    this._fn = fn;
	    this._prev = seed;
	  },
	  _free: function () {
	    this._prev = null;
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    if (this._prev !== NOTHING) {
	      var fn = this._fn;
	      this._emitValue(fn(this._prev, x));
	    }
	    this._prev = x;
	  }
	};

	var S$16 = createStream('diff', mixin$9);
	var P$12 = createProperty('diff', mixin$9);

	function defaultFn(a, b) {
	  return [a, b];
	}

	function diff(obs, fn) {
	  var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;

	  return new (obs._ofSameType(S$16, P$12))(obs, { fn: fn || defaultFn, seed: seed });
	}

	var P$13 = createProperty('scan', {
	  _init: function (_ref) {
	    var fn = _ref.fn,
	        seed = _ref.seed;

	    this._fn = fn;
	    this._seed = seed;
	    if (seed !== NOTHING) {
	      this._emitValue(seed);
	    }
	  },
	  _free: function () {
	    this._fn = null;
	    this._seed = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    if (this._currentEvent === null || this._currentEvent.type === ERROR) {
	      this._emitValue(this._seed === NOTHING ? x : fn(this._seed, x));
	    } else {
	      this._emitValue(fn(this._currentEvent.value, x));
	    }
	  }
	});

	function scan(obs, fn) {
	  var seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOTHING;

	  return new P$13(obs, { fn: fn, seed: seed });
	}

	var mixin$10 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    var xs = fn(x);
	    for (var i = 0; i < xs.length; i++) {
	      this._emitValue(xs[i]);
	    }
	  }
	};

	var S$17 = createStream('flatten', mixin$10);

	var id$4 = function (x) {
	  return x;
	};

	function flatten(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$4;

	  return new S$17(obs, { fn: fn });
	}

	var END_MARKER = {};

	var mixin$11 = {
	  _init: function (_ref) {
	    var _this = this;

	    var wait = _ref.wait;

	    this._wait = Math.max(0, wait);
	    this._buff = [];
	    this._$shiftBuff = function () {
	      var value = _this._buff.shift();
	      if (value === END_MARKER) {
	        _this._emitEnd();
	      } else {
	        _this._emitValue(value);
	      }
	    };
	  },
	  _free: function () {
	    this._buff = null;
	    this._$shiftBuff = null;
	  },
	  _handleValue: function (x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      this._buff.push(x);
	      setTimeout(this._$shiftBuff, this._wait);
	    }
	  },
	  _handleEnd: function () {
	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      this._buff.push(END_MARKER);
	      setTimeout(this._$shiftBuff, this._wait);
	    }
	  }
	};

	var S$18 = createStream('delay', mixin$11);
	var P$14 = createProperty('delay', mixin$11);

	function delay(obs, wait) {
	  return new (obs._ofSameType(S$18, P$14))(obs, { wait: wait });
	}

	var now = Date.now ? function () {
	  return Date.now();
	} : function () {
	  return new Date().getTime();
	};

	var mixin$12 = {
	  _init: function (_ref) {
	    var _this = this;

	    var wait = _ref.wait,
	        leading = _ref.leading,
	        trailing = _ref.trailing;

	    this._wait = Math.max(0, wait);
	    this._leading = leading;
	    this._trailing = trailing;
	    this._trailingValue = null;
	    this._timeoutId = null;
	    this._endLater = false;
	    this._lastCallTime = 0;
	    this._$trailingCall = function () {
	      return _this._trailingCall();
	    };
	  },
	  _free: function () {
	    this._trailingValue = null;
	    this._$trailingCall = null;
	  },
	  _handleValue: function (x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      var curTime = now();
	      if (this._lastCallTime === 0 && !this._leading) {
	        this._lastCallTime = curTime;
	      }
	      var remaining = this._wait - (curTime - this._lastCallTime);
	      if (remaining <= 0) {
	        this._cancelTrailing();
	        this._lastCallTime = curTime;
	        this._emitValue(x);
	      } else if (this._trailing) {
	        this._cancelTrailing();
	        this._trailingValue = x;
	        this._timeoutId = setTimeout(this._$trailingCall, remaining);
	      }
	    }
	  },
	  _handleEnd: function () {
	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      if (this._timeoutId) {
	        this._endLater = true;
	      } else {
	        this._emitEnd();
	      }
	    }
	  },
	  _cancelTrailing: function () {
	    if (this._timeoutId !== null) {
	      clearTimeout(this._timeoutId);
	      this._timeoutId = null;
	    }
	  },
	  _trailingCall: function () {
	    this._emitValue(this._trailingValue);
	    this._timeoutId = null;
	    this._trailingValue = null;
	    this._lastCallTime = !this._leading ? 0 : now();
	    if (this._endLater) {
	      this._emitEnd();
	    }
	  }
	};

	var S$19 = createStream('throttle', mixin$12);
	var P$15 = createProperty('throttle', mixin$12);

	function throttle(obs, wait) {
	  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref2$leading = _ref2.leading,
	      leading = _ref2$leading === undefined ? true : _ref2$leading,
	      _ref2$trailing = _ref2.trailing,
	      trailing = _ref2$trailing === undefined ? true : _ref2$trailing;

	  return new (obs._ofSameType(S$19, P$15))(obs, { wait: wait, leading: leading, trailing: trailing });
	}

	var mixin$13 = {
	  _init: function (_ref) {
	    var _this = this;

	    var wait = _ref.wait,
	        immediate = _ref.immediate;

	    this._wait = Math.max(0, wait);
	    this._immediate = immediate;
	    this._lastAttempt = 0;
	    this._timeoutId = null;
	    this._laterValue = null;
	    this._endLater = false;
	    this._$later = function () {
	      return _this._later();
	    };
	  },
	  _free: function () {
	    this._laterValue = null;
	    this._$later = null;
	  },
	  _handleValue: function (x) {
	    if (this._activating) {
	      this._emitValue(x);
	    } else {
	      this._lastAttempt = now();
	      if (this._immediate && !this._timeoutId) {
	        this._emitValue(x);
	      }
	      if (!this._timeoutId) {
	        this._timeoutId = setTimeout(this._$later, this._wait);
	      }
	      if (!this._immediate) {
	        this._laterValue = x;
	      }
	    }
	  },
	  _handleEnd: function () {
	    if (this._activating) {
	      this._emitEnd();
	    } else {
	      if (this._timeoutId && !this._immediate) {
	        this._endLater = true;
	      } else {
	        this._emitEnd();
	      }
	    }
	  },
	  _later: function () {
	    var last = now() - this._lastAttempt;
	    if (last < this._wait && last >= 0) {
	      this._timeoutId = setTimeout(this._$later, this._wait - last);
	    } else {
	      this._timeoutId = null;
	      if (!this._immediate) {
	        this._emitValue(this._laterValue);
	        this._laterValue = null;
	      }
	      if (this._endLater) {
	        this._emitEnd();
	      }
	    }
	  }
	};

	var S$20 = createStream('debounce', mixin$13);
	var P$16 = createProperty('debounce', mixin$13);

	function debounce(obs, wait) {
	  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref2$immediate = _ref2.immediate,
	      immediate = _ref2$immediate === undefined ? false : _ref2$immediate;

	  return new (obs._ofSameType(S$20, P$16))(obs, { wait: wait, immediate: immediate });
	}

	var mixin$14 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleError: function (x) {
	    var fn = this._fn;
	    this._emitError(fn(x));
	  }
	};

	var S$21 = createStream('mapErrors', mixin$14);
	var P$17 = createProperty('mapErrors', mixin$14);

	var id$5 = function (x) {
	  return x;
	};

	function mapErrors(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$5;

	  return new (obs._ofSameType(S$21, P$17))(obs, { fn: fn });
	}

	var mixin$15 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleError: function (x) {
	    var fn = this._fn;
	    if (fn(x)) {
	      this._emitError(x);
	    }
	  }
	};

	var S$22 = createStream('filterErrors', mixin$15);
	var P$18 = createProperty('filterErrors', mixin$15);

	var id$6 = function (x) {
	  return x;
	};

	function filterErrors(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id$6;

	  return new (obs._ofSameType(S$22, P$18))(obs, { fn: fn });
	}

	var mixin$16 = {
	  _handleValue: function () {}
	};

	var S$23 = createStream('ignoreValues', mixin$16);
	var P$19 = createProperty('ignoreValues', mixin$16);

	function ignoreValues(obs) {
	  return new (obs._ofSameType(S$23, P$19))(obs);
	}

	var mixin$17 = {
	  _handleError: function () {}
	};

	var S$24 = createStream('ignoreErrors', mixin$17);
	var P$20 = createProperty('ignoreErrors', mixin$17);

	function ignoreErrors(obs) {
	  return new (obs._ofSameType(S$24, P$20))(obs);
	}

	var mixin$18 = {
	  _handleEnd: function () {}
	};

	var S$25 = createStream('ignoreEnd', mixin$18);
	var P$21 = createProperty('ignoreEnd', mixin$18);

	function ignoreEnd(obs) {
	  return new (obs._ofSameType(S$25, P$21))(obs);
	}

	var mixin$19 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleEnd: function () {
	    var fn = this._fn;
	    this._emitValue(fn());
	    this._emitEnd();
	  }
	};

	var S$26 = createStream('beforeEnd', mixin$19);
	var P$22 = createProperty('beforeEnd', mixin$19);

	function beforeEnd(obs, fn) {
	  return new (obs._ofSameType(S$26, P$22))(obs, { fn: fn });
	}

	var mixin$20 = {
	  _init: function (_ref) {
	    var min = _ref.min,
	        max = _ref.max;

	    this._max = max;
	    this._min = min;
	    this._buff = [];
	  },
	  _free: function () {
	    this._buff = null;
	  },
	  _handleValue: function (x) {
	    this._buff = slide(this._buff, x, this._max);
	    if (this._buff.length >= this._min) {
	      this._emitValue(this._buff);
	    }
	  }
	};

	var S$27 = createStream('slidingWindow', mixin$20);
	var P$23 = createProperty('slidingWindow', mixin$20);

	function slidingWindow(obs, max) {
	  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	  return new (obs._ofSameType(S$27, P$23))(obs, { min: min, max: max });
	}

	var mixin$21 = {
	  _init: function (_ref) {
	    var fn = _ref.fn,
	        flushOnEnd = _ref.flushOnEnd;

	    this._fn = fn;
	    this._flushOnEnd = flushOnEnd;
	    this._buff = [];
	  },
	  _free: function () {
	    this._buff = null;
	  },
	  _flush: function () {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },
	  _handleValue: function (x) {
	    this._buff.push(x);
	    var fn = this._fn;
	    if (!fn(x)) {
	      this._flush();
	    }
	  },
	  _handleEnd: function () {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  }
	};

	var S$28 = createStream('bufferWhile', mixin$21);
	var P$24 = createProperty('bufferWhile', mixin$21);

	var id$7 = function (x) {
	  return x;
	};

	function bufferWhile(obs, fn) {
	  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref2$flushOnEnd = _ref2.flushOnEnd,
	      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

	  return new (obs._ofSameType(S$28, P$24))(obs, { fn: fn || id$7, flushOnEnd: flushOnEnd });
	}

	var mixin$22 = {
	  _init: function (_ref) {
	    var count = _ref.count,
	        flushOnEnd = _ref.flushOnEnd;

	    this._count = count;
	    this._flushOnEnd = flushOnEnd;
	    this._buff = [];
	  },
	  _free: function () {
	    this._buff = null;
	  },
	  _flush: function () {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },
	  _handleValue: function (x) {
	    this._buff.push(x);
	    if (this._buff.length >= this._count) {
	      this._flush();
	    }
	  },
	  _handleEnd: function () {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  }
	};

	var S$29 = createStream('bufferWithCount', mixin$22);
	var P$25 = createProperty('bufferWithCount', mixin$22);

	function bufferWhile$1(obs, count) {
	  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref2$flushOnEnd = _ref2.flushOnEnd,
	      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

	  return new (obs._ofSameType(S$29, P$25))(obs, { count: count, flushOnEnd: flushOnEnd });
	}

	var mixin$23 = {
	  _init: function (_ref) {
	    var _this = this;

	    var wait = _ref.wait,
	        count = _ref.count,
	        flushOnEnd = _ref.flushOnEnd;

	    this._wait = wait;
	    this._count = count;
	    this._flushOnEnd = flushOnEnd;
	    this._intervalId = null;
	    this._$onTick = function () {
	      return _this._flush();
	    };
	    this._buff = [];
	  },
	  _free: function () {
	    this._$onTick = null;
	    this._buff = null;
	  },
	  _flush: function () {
	    if (this._buff !== null) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },
	  _handleValue: function (x) {
	    this._buff.push(x);
	    if (this._buff.length >= this._count) {
	      clearInterval(this._intervalId);
	      this._flush();
	      this._intervalId = setInterval(this._$onTick, this._wait);
	    }
	  },
	  _handleEnd: function () {
	    if (this._flushOnEnd && this._buff.length !== 0) {
	      this._flush();
	    }
	    this._emitEnd();
	  },
	  _onActivation: function () {
	    this._intervalId = setInterval(this._$onTick, this._wait);
	    this._source.onAny(this._$handleAny); // copied from patterns/one-source
	  },
	  _onDeactivation: function () {
	    if (this._intervalId !== null) {
	      clearInterval(this._intervalId);
	      this._intervalId = null;
	    }
	    this._source.offAny(this._$handleAny); // copied from patterns/one-source
	  }
	};

	var S$30 = createStream('bufferWithTimeOrCount', mixin$23);
	var P$26 = createProperty('bufferWithTimeOrCount', mixin$23);

	function bufferWithTimeOrCount(obs, wait, count) {
	  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
	      _ref2$flushOnEnd = _ref2.flushOnEnd,
	      flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

	  return new (obs._ofSameType(S$30, P$26))(obs, { wait: wait, count: count, flushOnEnd: flushOnEnd });
	}

	function xformForObs(obs) {
	  return {
	    '@@transducer/step': function (res, input) {
	      obs._emitValue(input);
	      return null;
	    },
	    '@@transducer/result': function () {
	      obs._emitEnd();
	      return null;
	    }
	  };
	}

	var mixin$24 = {
	  _init: function (_ref) {
	    var transducer = _ref.transducer;

	    this._xform = transducer(xformForObs(this));
	  },
	  _free: function () {
	    this._xform = null;
	  },
	  _handleValue: function (x) {
	    if (this._xform['@@transducer/step'](null, x) !== null) {
	      this._xform['@@transducer/result'](null);
	    }
	  },
	  _handleEnd: function () {
	    this._xform['@@transducer/result'](null);
	  }
	};

	var S$31 = createStream('transduce', mixin$24);
	var P$27 = createProperty('transduce', mixin$24);

	function transduce(obs, transducer) {
	  return new (obs._ofSameType(S$31, P$27))(obs, { transducer: transducer });
	}

	var mixin$25 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._handler = fn;
	    this._emitter = emitter(this);
	  },
	  _free: function () {
	    this._handler = null;
	    this._emitter = null;
	  },
	  _handleAny: function (event) {
	    this._handler(this._emitter, event);
	  }
	};

	var S$32 = createStream('withHandler', mixin$25);
	var P$28 = createProperty('withHandler', mixin$25);

	function withHandler(obs, fn) {
	  return new (obs._ofSameType(S$32, P$28))(obs, { fn: fn });
	}

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function Zip(sources, combinator) {
	  var _this = this;

	  Stream.call(this);

	  this._buffers = map(sources, function (source) {
	    return isArray(source) ? cloneArray(source) : [];
	  });
	  this._sources = map(sources, function (source) {
	    return isArray(source) ? never() : source;
	  });

	  this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
	    return x;
	  };
	  this._aliveCount = 0;

	  this._$handlers = [];

	  var _loop = function (i) {
	    _this._$handlers.push(function (event) {
	      return _this._handleAny(i, event);
	    });
	  };

	  for (var i = 0; i < this._sources.length; i++) {
	    _loop(i);
	  }
	}

	inherit(Zip, Stream, {

	  _name: 'zip',

	  _onActivation: function () {

	    // if all sources are arrays
	    while (this._isFull()) {
	      this._emit();
	    }

	    var length = this._sources.length;
	    this._aliveCount = length;
	    for (var i = 0; i < length && this._active; i++) {
	      this._sources[i].onAny(this._$handlers[i]);
	    }
	  },
	  _onDeactivation: function () {
	    for (var i = 0; i < this._sources.length; i++) {
	      this._sources[i].offAny(this._$handlers[i]);
	    }
	  },
	  _emit: function () {
	    var values = new Array(this._buffers.length);
	    for (var i = 0; i < this._buffers.length; i++) {
	      values[i] = this._buffers[i].shift();
	    }
	    var combinator = this._combinator;
	    this._emitValue(combinator(values));
	  },
	  _isFull: function () {
	    for (var i = 0; i < this._buffers.length; i++) {
	      if (this._buffers[i].length === 0) {
	        return false;
	      }
	    }
	    return true;
	  },
	  _handleAny: function (i, event) {
	    if (event.type === VALUE) {
	      this._buffers[i].push(event.value);
	      if (this._isFull()) {
	        this._emit();
	      }
	    }
	    if (event.type === ERROR) {
	      this._emitError(event.value);
	    }
	    if (event.type === END) {
	      this._aliveCount--;
	      if (this._aliveCount === 0) {
	        this._emitEnd();
	      }
	    }
	  },
	  _clear: function () {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._buffers = null;
	    this._combinator = null;
	    this._$handlers = null;
	  }
	});

	function zip(observables, combinator /* Function | falsey */) {
	  return observables.length === 0 ? never() : new Zip(observables, combinator);
	}

	var id$8 = function (x) {
	  return x;
	};

	function AbstractPool() {
	  var _this = this;

	  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      _ref$queueLim = _ref.queueLim,
	      queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim,
	      _ref$concurLim = _ref.concurLim,
	      concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim,
	      _ref$drop = _ref.drop,
	      drop = _ref$drop === undefined ? 'new' : _ref$drop;

	  Stream.call(this);

	  this._queueLim = queueLim < 0 ? -1 : queueLim;
	  this._concurLim = concurLim < 0 ? -1 : concurLim;
	  this._drop = drop;
	  this._queue = [];
	  this._curSources = [];
	  this._$handleSubAny = function (event) {
	    return _this._handleSubAny(event);
	  };
	  this._$endHandlers = [];
	  this._currentlyAdding = null;

	  if (this._concurLim === 0) {
	    this._emitEnd();
	  }
	}

	inherit(AbstractPool, Stream, {

	  _name: 'abstractPool',

	  _add: function (obj, toObs /* Function | falsey */) {
	    toObs = toObs || id$8;
	    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
	      this._addToCur(toObs(obj));
	    } else {
	      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
	        this._addToQueue(toObs(obj));
	      } else if (this._drop === 'old') {
	        this._removeOldest();
	        this._add(obj, toObs);
	      }
	    }
	  },
	  _addAll: function (obss) {
	    var _this2 = this;

	    forEach(obss, function (obs) {
	      return _this2._add(obs);
	    });
	  },
	  _remove: function (obs) {
	    if (this._removeCur(obs) === -1) {
	      this._removeQueue(obs);
	    }
	  },
	  _addToQueue: function (obs) {
	    this._queue = concat(this._queue, [obs]);
	  },
	  _addToCur: function (obs) {
	    if (this._active) {

	      // HACK:
	      //
	      // We have two optimizations for cases when `obs` is ended. We don't want
	      // to add such observable to the list, but only want to emit events
	      // from it (if it has some).
	      //
	      // Instead of this hacks, we could just did following,
	      // but it would be 5-8 times slower:
	      //
	      //     this._curSources = concat(this._curSources, [obs]);
	      //     this._subscribe(obs);
	      //

	      // #1
	      // This one for cases when `obs` already ended
	      // e.g., Kefir.constant() or Kefir.never()
	      if (!obs._alive) {
	        if (obs._currentEvent) {
	          this._emit(obs._currentEvent.type, obs._currentEvent.value);
	        }
	        return;
	      }

	      // #2
	      // This one is for cases when `obs` going to end synchronously on
	      // first subscriber e.g., Kefir.stream(em => {em.emit(1); em.end()})
	      this._currentlyAdding = obs;
	      obs.onAny(this._$handleSubAny);
	      this._currentlyAdding = null;
	      if (obs._alive) {
	        this._curSources = concat(this._curSources, [obs]);
	        if (this._active) {
	          this._subToEnd(obs);
	        }
	      }
	    } else {
	      this._curSources = concat(this._curSources, [obs]);
	    }
	  },
	  _subToEnd: function (obs) {
	    var _this3 = this;

	    var onEnd = function () {
	      return _this3._removeCur(obs);
	    };
	    this._$endHandlers.push({ obs: obs, handler: onEnd });
	    obs.onEnd(onEnd);
	  },
	  _subscribe: function (obs) {
	    obs.onAny(this._$handleSubAny);

	    // it can become inactive in responce of subscribing to `obs.onAny` above
	    if (this._active) {
	      this._subToEnd(obs);
	    }
	  },
	  _unsubscribe: function (obs) {
	    obs.offAny(this._$handleSubAny);

	    var onEndI = findByPred(this._$endHandlers, function (obj) {
	      return obj.obs === obs;
	    });
	    if (onEndI !== -1) {
	      obs.offEnd(this._$endHandlers[onEndI].handler);
	      this._$endHandlers.splice(onEndI, 1);
	    }
	  },
	  _handleSubAny: function (event) {
	    if (event.type === VALUE) {
	      this._emitValue(event.value);
	    } else if (event.type === ERROR) {
	      this._emitError(event.value);
	    }
	  },
	  _removeQueue: function (obs) {
	    var index = find(this._queue, obs);
	    this._queue = remove(this._queue, index);
	    return index;
	  },
	  _removeCur: function (obs) {
	    if (this._active) {
	      this._unsubscribe(obs);
	    }
	    var index = find(this._curSources, obs);
	    this._curSources = remove(this._curSources, index);
	    if (index !== -1) {
	      if (this._queue.length !== 0) {
	        this._pullQueue();
	      } else if (this._curSources.length === 0) {
	        this._onEmpty();
	      }
	    }
	    return index;
	  },
	  _removeOldest: function () {
	    this._removeCur(this._curSources[0]);
	  },
	  _pullQueue: function () {
	    if (this._queue.length !== 0) {
	      this._queue = cloneArray(this._queue);
	      this._addToCur(this._queue.shift());
	    }
	  },
	  _onActivation: function () {
	    for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
	      this._subscribe(sources[i]);
	    }
	  },
	  _onDeactivation: function () {
	    for (var i = 0, sources = this._curSources; i < sources.length; i++) {
	      this._unsubscribe(sources[i]);
	    }
	    if (this._currentlyAdding !== null) {
	      this._unsubscribe(this._currentlyAdding);
	    }
	  },
	  _isEmpty: function () {
	    return this._curSources.length === 0;
	  },
	  _onEmpty: function () {},
	  _clear: function () {
	    Stream.prototype._clear.call(this);
	    this._queue = null;
	    this._curSources = null;
	    this._$handleSubAny = null;
	    this._$endHandlers = null;
	  }
	});

	function Merge(sources) {
	  AbstractPool.call(this);
	  this._addAll(sources);
	  this._initialised = true;
	}

	inherit(Merge, AbstractPool, {

	  _name: 'merge',

	  _onEmpty: function () {
	    if (this._initialised) {
	      this._emitEnd();
	    }
	  }
	});

	function merge(observables) {
	  return observables.length === 0 ? never() : new Merge(observables);
	}

	function S$33(generator) {
	  var _this = this;

	  Stream.call(this);
	  this._generator = generator;
	  this._source = null;
	  this._inLoop = false;
	  this._iteration = 0;
	  this._$handleAny = function (event) {
	    return _this._handleAny(event);
	  };
	}

	inherit(S$33, Stream, {

	  _name: 'repeat',

	  _handleAny: function (event) {
	    if (event.type === END) {
	      this._source = null;
	      this._getSource();
	    } else {
	      this._emit(event.type, event.value);
	    }
	  },
	  _getSource: function () {
	    if (!this._inLoop) {
	      this._inLoop = true;
	      var generator = this._generator;
	      while (this._source === null && this._alive && this._active) {
	        this._source = generator(this._iteration++);
	        if (this._source) {
	          this._source.onAny(this._$handleAny);
	        } else {
	          this._emitEnd();
	        }
	      }
	      this._inLoop = false;
	    }
	  },
	  _onActivation: function () {
	    if (this._source) {
	      this._source.onAny(this._$handleAny);
	    } else {
	      this._getSource();
	    }
	  },
	  _onDeactivation: function () {
	    if (this._source) {
	      this._source.offAny(this._$handleAny);
	    }
	  },
	  _clear: function () {
	    Stream.prototype._clear.call(this);
	    this._generator = null;
	    this._source = null;
	    this._$handleAny = null;
	  }
	});

	function repeat (generator) {
	  return new S$33(generator);
	}

	function concat$1(observables) {
	  return repeat(function (index) {
	    return observables.length > index ? observables[index] : false;
	  }).setName('concat');
	}

	function Pool() {
	  AbstractPool.call(this);
	}

	inherit(Pool, AbstractPool, {

	  _name: 'pool',

	  plug: function (obs) {
	    this._add(obs);
	    return this;
	  },
	  unplug: function (obs) {
	    this._remove(obs);
	    return this;
	  }
	});

	function FlatMap(source, fn, options) {
	  var _this = this;

	  AbstractPool.call(this, options);
	  this._source = source;
	  this._fn = fn;
	  this._mainEnded = false;
	  this._lastCurrent = null;
	  this._$handleMain = function (event) {
	    return _this._handleMain(event);
	  };
	}

	inherit(FlatMap, AbstractPool, {
	  _onActivation: function () {
	    AbstractPool.prototype._onActivation.call(this);
	    if (this._active) {
	      this._source.onAny(this._$handleMain);
	    }
	  },
	  _onDeactivation: function () {
	    AbstractPool.prototype._onDeactivation.call(this);
	    this._source.offAny(this._$handleMain);
	    this._hadNoEvSinceDeact = true;
	  },
	  _handleMain: function (event) {

	    if (event.type === VALUE) {
	      // Is latest value before deactivation survived, and now is 'current' on this activation?
	      // We don't want to handle such values, to prevent to constantly add
	      // same observale on each activation/deactivation when our main source
	      // is a `Kefir.conatant()` for example.
	      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
	      if (!sameCurr) {
	        this._add(event.value, this._fn);
	      }
	      this._lastCurrent = event.value;
	      this._hadNoEvSinceDeact = false;
	    }

	    if (event.type === ERROR) {
	      this._emitError(event.value);
	    }

	    if (event.type === END) {
	      if (this._isEmpty()) {
	        this._emitEnd();
	      } else {
	        this._mainEnded = true;
	      }
	    }
	  },
	  _onEmpty: function () {
	    if (this._mainEnded) {
	      this._emitEnd();
	    }
	  },
	  _clear: function () {
	    AbstractPool.prototype._clear.call(this);
	    this._source = null;
	    this._lastCurrent = null;
	    this._$handleMain = null;
	  }
	});

	function FlatMapErrors(source, fn) {
	  FlatMap.call(this, source, fn);
	}

	inherit(FlatMapErrors, FlatMap, {

	  // Same as in FlatMap, only VALUE/ERROR flipped
	  _handleMain: function (event) {

	    if (event.type === ERROR) {
	      var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
	      if (!sameCurr) {
	        this._add(event.value, this._fn);
	      }
	      this._lastCurrent = event.value;
	      this._hadNoEvSinceDeact = false;
	    }

	    if (event.type === VALUE) {
	      this._emitValue(event.value);
	    }

	    if (event.type === END) {
	      if (this._isEmpty()) {
	        this._emitEnd();
	      } else {
	        this._mainEnded = true;
	      }
	    }
	  }
	});

	function createConstructor$1(BaseClass, name) {
	  return function AnonymousObservable(primary, secondary, options) {
	    var _this = this;

	    BaseClass.call(this);
	    this._primary = primary;
	    this._secondary = secondary;
	    this._name = primary._name + '.' + name;
	    this._lastSecondary = NOTHING;
	    this._$handleSecondaryAny = function (event) {
	      return _this._handleSecondaryAny(event);
	    };
	    this._$handlePrimaryAny = function (event) {
	      return _this._handlePrimaryAny(event);
	    };
	    this._init(options);
	  };
	}

	function createClassMethods$1(BaseClass) {
	  return {
	    _init: function () {},
	    _free: function () {},
	    _handlePrimaryValue: function (x) {
	      this._emitValue(x);
	    },
	    _handlePrimaryError: function (x) {
	      this._emitError(x);
	    },
	    _handlePrimaryEnd: function () {
	      this._emitEnd();
	    },
	    _handleSecondaryValue: function (x) {
	      this._lastSecondary = x;
	    },
	    _handleSecondaryError: function (x) {
	      this._emitError(x);
	    },
	    _handleSecondaryEnd: function () {},
	    _handlePrimaryAny: function (event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handlePrimaryValue(event.value);
	        case ERROR:
	          return this._handlePrimaryError(event.value);
	        case END:
	          return this._handlePrimaryEnd(event.value);
	      }
	    },
	    _handleSecondaryAny: function (event) {
	      switch (event.type) {
	        case VALUE:
	          return this._handleSecondaryValue(event.value);
	        case ERROR:
	          return this._handleSecondaryError(event.value);
	        case END:
	          this._handleSecondaryEnd(event.value);
	          this._removeSecondary();
	      }
	    },
	    _removeSecondary: function () {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	        this._$handleSecondaryAny = null;
	        this._secondary = null;
	      }
	    },
	    _onActivation: function () {
	      if (this._secondary !== null) {
	        this._secondary.onAny(this._$handleSecondaryAny);
	      }
	      if (this._active) {
	        this._primary.onAny(this._$handlePrimaryAny);
	      }
	    },
	    _onDeactivation: function () {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	      }
	      this._primary.offAny(this._$handlePrimaryAny);
	    },
	    _clear: function () {
	      BaseClass.prototype._clear.call(this);
	      this._primary = null;
	      this._secondary = null;
	      this._lastSecondary = null;
	      this._$handleSecondaryAny = null;
	      this._$handlePrimaryAny = null;
	      this._free();
	    }
	  };
	}

	function createStream$1(name, mixin) {
	  var S = createConstructor$1(Stream, name);
	  inherit(S, Stream, createClassMethods$1(Stream), mixin);
	  return S;
	}

	function createProperty$1(name, mixin) {
	  var P = createConstructor$1(Property, name);
	  inherit(P, Property, createClassMethods$1(Property), mixin);
	  return P;
	}

	var mixin$26 = {
	  _handlePrimaryValue: function (x) {
	    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
	      this._emitValue(x);
	    }
	  },
	  _handleSecondaryEnd: function () {
	    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
	      this._emitEnd();
	    }
	  }
	};

	var S$34 = createStream$1('filterBy', mixin$26);
	var P$29 = createProperty$1('filterBy', mixin$26);

	function filterBy(primary, secondary) {
	  return new (primary._ofSameType(S$34, P$29))(primary, secondary);
	}

	var id2 = function (_, x) {
	  return x;
	};

	function sampledBy(passive, active, combinator) {
	  var _combinator = combinator ? function (a, b) {
	    return combinator(b, a);
	  } : id2;
	  return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
	}

	var mixin$27 = {
	  _handlePrimaryValue: function (x) {
	    if (this._lastSecondary !== NOTHING) {
	      this._emitValue(x);
	    }
	  },
	  _handleSecondaryEnd: function () {
	    if (this._lastSecondary === NOTHING) {
	      this._emitEnd();
	    }
	  }
	};

	var S$35 = createStream$1('skipUntilBy', mixin$27);
	var P$30 = createProperty$1('skipUntilBy', mixin$27);

	function skipUntilBy(primary, secondary) {
	  return new (primary._ofSameType(S$35, P$30))(primary, secondary);
	}

	var mixin$28 = {
	  _handleSecondaryValue: function () {
	    this._emitEnd();
	  }
	};

	var S$36 = createStream$1('takeUntilBy', mixin$28);
	var P$31 = createProperty$1('takeUntilBy', mixin$28);

	function takeUntilBy(primary, secondary) {
	  return new (primary._ofSameType(S$36, P$31))(primary, secondary);
	}

	var mixin$29 = {
	  _init: function () {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$flushOnEnd = _ref.flushOnEnd,
	        flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;

	    this._buff = [];
	    this._flushOnEnd = flushOnEnd;
	  },
	  _free: function () {
	    this._buff = null;
	  },
	  _flush: function () {
	    if (this._buff !== null) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },
	  _handlePrimaryEnd: function () {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  },
	  _onActivation: function () {
	    this._primary.onAny(this._$handlePrimaryAny);
	    if (this._alive && this._secondary !== null) {
	      this._secondary.onAny(this._$handleSecondaryAny);
	    }
	  },
	  _handlePrimaryValue: function (x) {
	    this._buff.push(x);
	  },
	  _handleSecondaryValue: function () {
	    this._flush();
	  },
	  _handleSecondaryEnd: function () {
	    if (!this._flushOnEnd) {
	      this._emitEnd();
	    }
	  }
	};

	var S$37 = createStream$1('bufferBy', mixin$29);
	var P$32 = createProperty$1('bufferBy', mixin$29);

	function bufferBy(primary, secondary, options /* optional */) {
	  return new (primary._ofSameType(S$37, P$32))(primary, secondary, options);
	}

	var mixin$30 = {
	  _init: function () {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$flushOnEnd = _ref.flushOnEnd,
	        flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd,
	        _ref$flushOnChange = _ref.flushOnChange,
	        flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;

	    this._buff = [];
	    this._flushOnEnd = flushOnEnd;
	    this._flushOnChange = flushOnChange;
	  },
	  _free: function () {
	    this._buff = null;
	  },
	  _flush: function () {
	    if (this._buff !== null) {
	      this._emitValue(this._buff);
	      this._buff = [];
	    }
	  },
	  _handlePrimaryEnd: function () {
	    if (this._flushOnEnd) {
	      this._flush();
	    }
	    this._emitEnd();
	  },
	  _handlePrimaryValue: function (x) {
	    this._buff.push(x);
	    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
	      this._flush();
	    }
	  },
	  _handleSecondaryEnd: function () {
	    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
	      this._emitEnd();
	    }
	  },
	  _handleSecondaryValue: function (x) {
	    if (this._flushOnChange && !x) {
	      this._flush();
	    }

	    // from default _handleSecondaryValue
	    this._lastSecondary = x;
	  }
	};

	var S$38 = createStream$1('bufferWhileBy', mixin$30);
	var P$33 = createProperty$1('bufferWhileBy', mixin$30);

	function bufferWhileBy(primary, secondary, options /* optional */) {
	  return new (primary._ofSameType(S$38, P$33))(primary, secondary, options);
	}

	var f = function () {
	  return false;
	};
	var t = function () {
	  return true;
	};

	function awaiting(a, b) {
	  var result = merge([map$1(a, t), map$1(b, f)]);
	  result = skipDuplicates(result);
	  result = toProperty(result, f);
	  return result.setName(a, 'awaiting');
	}

	var mixin$31 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleValue: function (x) {
	    var fn = this._fn;
	    var result = fn(x);
	    if (result.convert) {
	      this._emitError(result.error);
	    } else {
	      this._emitValue(x);
	    }
	  }
	};

	var S$39 = createStream('valuesToErrors', mixin$31);
	var P$34 = createProperty('valuesToErrors', mixin$31);

	var defFn = function (x) {
	  return { convert: true, error: x };
	};

	function valuesToErrors(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn;

	  return new (obs._ofSameType(S$39, P$34))(obs, { fn: fn });
	}

	var mixin$32 = {
	  _init: function (_ref) {
	    var fn = _ref.fn;

	    this._fn = fn;
	  },
	  _free: function () {
	    this._fn = null;
	  },
	  _handleError: function (x) {
	    var fn = this._fn;
	    var result = fn(x);
	    if (result.convert) {
	      this._emitValue(result.value);
	    } else {
	      this._emitError(x);
	    }
	  }
	};

	var S$40 = createStream('errorsToValues', mixin$32);
	var P$35 = createProperty('errorsToValues', mixin$32);

	var defFn$1 = function (x) {
	  return { convert: true, value: x };
	};

	function errorsToValues(obs) {
	  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defFn$1;

	  return new (obs._ofSameType(S$40, P$35))(obs, { fn: fn });
	}

	var mixin$33 = {
	  _handleError: function (x) {
	    this._emitError(x);
	    this._emitEnd();
	  }
	};

	var S$41 = createStream('endOnError', mixin$33);
	var P$36 = createProperty('endOnError', mixin$33);

	function endOnError(obs) {
	  return new (obs._ofSameType(S$41, P$36))(obs);
	}

	Observable.prototype.toProperty = function (fn) {
	  return toProperty(this, fn);
	};

	Observable.prototype.changes = function () {
	  return changes(this);
	};

	Observable.prototype.toPromise = function (Promise) {
	  return toPromise(this, Promise);
	};

	Observable.prototype.toESObservable = toESObservable;
	Observable.prototype[$$observable] = toESObservable;

	Observable.prototype.map = function (fn) {
	  return map$1(this, fn);
	};

	Observable.prototype.filter = function (fn) {
	  return filter(this, fn);
	};

	Observable.prototype.take = function (n) {
	  return take(this, n);
	};

	Observable.prototype.takeErrors = function (n) {
	  return takeErrors(this, n);
	};

	Observable.prototype.takeWhile = function (fn) {
	  return takeWhile(this, fn);
	};

	Observable.prototype.last = function () {
	  return last(this);
	};

	Observable.prototype.skip = function (n) {
	  return skip(this, n);
	};

	Observable.prototype.skipWhile = function (fn) {
	  return skipWhile(this, fn);
	};

	Observable.prototype.skipDuplicates = function (fn) {
	  return skipDuplicates(this, fn);
	};

	Observable.prototype.diff = function (fn, seed) {
	  return diff(this, fn, seed);
	};

	Observable.prototype.scan = function (fn, seed) {
	  return scan(this, fn, seed);
	};

	Observable.prototype.flatten = function (fn) {
	  return flatten(this, fn);
	};

	Observable.prototype.delay = function (wait) {
	  return delay(this, wait);
	};

	Observable.prototype.throttle = function (wait, options) {
	  return throttle(this, wait, options);
	};

	Observable.prototype.debounce = function (wait, options) {
	  return debounce(this, wait, options);
	};

	Observable.prototype.mapErrors = function (fn) {
	  return mapErrors(this, fn);
	};

	Observable.prototype.filterErrors = function (fn) {
	  return filterErrors(this, fn);
	};

	Observable.prototype.ignoreValues = function () {
	  return ignoreValues(this);
	};

	Observable.prototype.ignoreErrors = function () {
	  return ignoreErrors(this);
	};

	Observable.prototype.ignoreEnd = function () {
	  return ignoreEnd(this);
	};

	Observable.prototype.beforeEnd = function (fn) {
	  return beforeEnd(this, fn);
	};

	Observable.prototype.slidingWindow = function (max, min) {
	  return slidingWindow(this, max, min);
	};

	Observable.prototype.bufferWhile = function (fn, options) {
	  return bufferWhile(this, fn, options);
	};

	Observable.prototype.bufferWithCount = function (count, options) {
	  return bufferWhile$1(this, count, options);
	};

	Observable.prototype.bufferWithTimeOrCount = function (wait, count, options) {
	  return bufferWithTimeOrCount(this, wait, count, options);
	};

	Observable.prototype.transduce = function (transducer) {
	  return transduce(this, transducer);
	};

	Observable.prototype.withHandler = function (fn) {
	  return withHandler(this, fn);
	};

	Observable.prototype.combine = function (other, combinator) {
	  return combine([this, other], combinator);
	};

	Observable.prototype.zip = function (other, combinator) {
	  return zip([this, other], combinator);
	};

	Observable.prototype.merge = function (other) {
	  return merge([this, other]);
	};

	Observable.prototype.concat = function (other) {
	  return concat$1([this, other]);
	};

	var pool = function () {
	  return new Pool();
	};

	Observable.prototype.flatMap = function (fn) {
	  return new FlatMap(this, fn).setName(this, 'flatMap');
	};
	Observable.prototype.flatMapLatest = function (fn) {
	  return new FlatMap(this, fn, { concurLim: 1, drop: 'old' }).setName(this, 'flatMapLatest');
	};
	Observable.prototype.flatMapFirst = function (fn) {
	  return new FlatMap(this, fn, { concurLim: 1 }).setName(this, 'flatMapFirst');
	};
	Observable.prototype.flatMapConcat = function (fn) {
	  return new FlatMap(this, fn, { queueLim: -1, concurLim: 1 }).setName(this, 'flatMapConcat');
	};
	Observable.prototype.flatMapConcurLimit = function (fn, limit) {
	  return new FlatMap(this, fn, { queueLim: -1, concurLim: limit }).setName(this, 'flatMapConcurLimit');
	};

	Observable.prototype.flatMapErrors = function (fn) {
	  return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
	};

	Observable.prototype.filterBy = function (other) {
	  return filterBy(this, other);
	};

	Observable.prototype.sampledBy = function (other, combinator) {
	  return sampledBy(this, other, combinator);
	};

	Observable.prototype.skipUntilBy = function (other) {
	  return skipUntilBy(this, other);
	};

	Observable.prototype.takeUntilBy = function (other) {
	  return takeUntilBy(this, other);
	};

	Observable.prototype.bufferBy = function (other, options) {
	  return bufferBy(this, other, options);
	};

	Observable.prototype.bufferWhileBy = function (other, options) {
	  return bufferWhileBy(this, other, options);
	};

	// Deprecated
	// -----------------------------------------------------------------------------

	var DEPRECATION_WARNINGS = true;
	function dissableDeprecationWarnings() {
	  DEPRECATION_WARNINGS = false;
	}

	function warn(msg) {
	  if (DEPRECATION_WARNINGS && console && typeof console.warn === 'function') {
	    var msg2 = '\nHere is an Error object for you containing the call stack:';
	    console.warn(msg, msg2, new Error());
	  }
	}

	Observable.prototype.awaiting = function (other) {
	  warn('You are using deprecated .awaiting() method, see https://github.com/rpominov/kefir/issues/145');
	  return awaiting(this, other);
	};

	Observable.prototype.valuesToErrors = function (fn) {
	  warn('You are using deprecated .valuesToErrors() method, see https://github.com/rpominov/kefir/issues/149');
	  return valuesToErrors(this, fn);
	};

	Observable.prototype.errorsToValues = function (fn) {
	  warn('You are using deprecated .errorsToValues() method, see https://github.com/rpominov/kefir/issues/149');
	  return errorsToValues(this, fn);
	};

	Observable.prototype.endOnError = function () {
	  warn('You are using deprecated .endOnError() method, see https://github.com/rpominov/kefir/issues/150');
	  return endOnError(this);
	};

	// Exports
	// --------------------------------------------------------------------------

	var Kefir = { Observable: Observable, Stream: Stream, Property: Property, never: never, later: later, interval: interval, sequentially: sequentially,
	  fromPoll: fromPoll, withInterval: withInterval, fromCallback: fromCallback, fromNodeCallback: fromNodeCallback, fromEvents: fromEvents, stream: stream,
	  constant: constant, constantError: constantError, fromPromise: fromPromise, fromESObservable: fromESObservable, combine: combine, zip: zip, merge: merge,
	  concat: concat$1, Pool: Pool, pool: pool, repeat: repeat, staticLand: staticLand };

	Kefir.Kefir = Kefir;

	exports.dissableDeprecationWarnings = dissableDeprecationWarnings;
	exports.Kefir = Kefir;
	exports.Observable = Observable;
	exports.Stream = Stream;
	exports.Property = Property;
	exports.never = never;
	exports.later = later;
	exports.interval = interval;
	exports.sequentially = sequentially;
	exports.fromPoll = fromPoll;
	exports.withInterval = withInterval;
	exports.fromCallback = fromCallback;
	exports.fromNodeCallback = fromNodeCallback;
	exports.fromEvents = fromEvents;
	exports.stream = stream;
	exports.constant = constant;
	exports.constantError = constantError;
	exports.fromPromise = fromPromise;
	exports.fromESObservable = fromESObservable;
	exports.combine = combine;
	exports.zip = zip;
	exports.merge = merge;
	exports.concat = concat$1;
	exports.Pool = Pool;
	exports.pool = pool;
	exports.repeat = repeat;
	exports.staticLand = staticLand;
	exports['default'] = Kefir;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = children;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_values__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_values___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_values__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_fromPairs__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_fromPairs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_fromPairs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_toPairs__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_toPairs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda_src_toPairs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_equals__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_equals___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_equals__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_pipe__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_map__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ramda_src_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ramda_src_prop__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ramda_src_prop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ramda_src_prop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_assert__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_assert___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_assert__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__child__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__helpers__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__util__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__mutations__ = __webpack_require__(88);









var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };









/**
 * Generates a function to create new children streams.
 *
 * @param {Object} factories - Children configuration.
 * @returns {Function} Curried children stream generator.
 */
function children(factories) {
    if (process.env.NODE_ENV !== 'production') {
        __WEBPACK_IMPORTED_MODULE_8_assert___default.a.equal(typeof factories === 'undefined' ? 'undefined' : _typeof(factories), 'object', '`factories` should be an object');

        for (var container in factories) {
            if (!factories.hasOwnProperty(container)) {
                continue;
            }

            __WEBPACK_IMPORTED_MODULE_8_assert___default.a.ok(typeof factories[container] === 'function' || _typeof(factories[container]) === 'object', container + ' should be a function or object');
        }
    }

    /**
     * Normalize the factories.
     *
     * This ensures that the developer can pass in a straight function
     * or a configuration object and the children$ stream will work
     * the same both ways.
     */
    for (var _container in factories) {
        var definition = factories[_container];

        if (typeof definition === 'function') {
            definition = { factory: definition };
        }

        factories[_container] = Object(__WEBPACK_IMPORTED_MODULE_10__child__["a" /* default */])(Object.assign({ container: _container }, definition));
    }

    /**
     * Children stream generator function.
     *
     * @param {HTMLElement} el - Element to query against.
     * @param {Observable} props$ - Stream of props.
     * @return {Observable<T, S>} Children stream.
     * @factory
     */
    return __WEBPACK_IMPORTED_MODULE_7_ramda_src_curry___default()(function (el, props$) {
        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var nodeAddedMutationPayload$ = __WEBPACK_IMPORTED_MODULE_13__mutations__["a" /* default */].filter(Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* isAddedChildNode */])(el)).map(__WEBPACK_IMPORTED_MODULE_6_ramda_src_prop___default()('payload'));
        var nodeRemovedMutationPayload$ = __WEBPACK_IMPORTED_MODULE_13__mutations__["a" /* default */].filter(Object(__WEBPACK_IMPORTED_MODULE_12__util__["e" /* isRemovedChildNode */])(el)).map(__WEBPACK_IMPORTED_MODULE_6_ramda_src_prop___default()('payload'));
        var createElementRemoved = function createElementRemoved(el) {
            return nodeRemovedMutationPayload$.filter(function (_ref) {
                var node = _ref.node;
                return node === el;
            });
        };
        var mapToMixinPairs = __WEBPACK_IMPORTED_MODULE_5_ramda_src_map___default()(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                container = _ref3[0],
                factory = _ref3[1];

            /**
             * Query all of the children for the configuration key.
             *
             * Filters out children that are under other containers.
             */
            var existingEl$ = __WEBPACK_IMPORTED_MODULE_9__kefir__["a" /* default */].constant(el.querySelectorAll('[' + Object(__WEBPACK_IMPORTED_MODULE_11__helpers__["b" /* containerAttribute */])(container) + ']')).flatten().filter(__WEBPACK_IMPORTED_MODULE_4_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_6_ramda_src_prop___default()('parentNode'), __WEBPACK_IMPORTED_MODULE_12__util__["c" /* getContainerNode */], __WEBPACK_IMPORTED_MODULE_3_ramda_src_equals___default()(el)));

            /**
             * Stream of added nodes from the MutationObserver.
             *
             * Filters out
             */
            var addedEl$ = nodeAddedMutationPayload$.filter(Object(__WEBPACK_IMPORTED_MODULE_12__util__["a" /* containerMatches */])(container)).map(__WEBPACK_IMPORTED_MODULE_6_ramda_src_prop___default()('node'));

            var instance$ = __WEBPACK_IMPORTED_MODULE_9__kefir__["a" /* default */].merge([existingEl$, addedEl$]).flatMap(function (el) {
                return factory(el, props$, config).takeUntilBy(createElementRemoved(el));
            });

            return [container, instance$];
        });
        var mapFactoriesToMixin = __WEBPACK_IMPORTED_MODULE_4_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_2_ramda_src_toPairs___default.a, mapToMixinPairs, __WEBPACK_IMPORTED_MODULE_1_ramda_src_fromPairs___default.a);

        /**
         * Mixin object holds the pool stream for each key.
         *
         * Allows us to plug/unplug from each stream as
         * nodes are added and removed from the DOM.
         */
        var mixin = mapFactoriesToMixin(factories);

        return Object.assign(Object.create(__WEBPACK_IMPORTED_MODULE_9__kefir__["a" /* default */].merge(__WEBPACK_IMPORTED_MODULE_0_ramda_src_values___default()(mixin))), mixin);
    });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var _has = __webpack_require__(16);


module.exports = (function() {
  var toString = Object.prototype.toString;
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments(x) { return _has('callee', x); };
}());


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);


/**
 * Creates a new object from a list key-value pairs. If a key appears in
 * multiple pairs, the rightmost pair is included in the object.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [[k,v]] -> {k: v}
 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
 * @return {Object} The object made by pairing up `keys` and `values`.
 * @see R.toPairs, R.pair
 * @example
 *
 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
 */
module.exports = _curry1(function fromPairs(pairs) {
  var result = {};
  var idx = 0;
  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }
  return result;
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _has = __webpack_require__(16);


/**
 * Converts an object into an array of key, value arrays. Only the object's
 * own properties are used.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own properties.
 * @see R.fromPairs
 * @example
 *
 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
 */
module.exports = _curry1(function toPairs(obj) {
  var pairs = [];
  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }
  return pairs;
});


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var _arrayFromIterator = __webpack_require__(58);
var _functionName = __webpack_require__(59);
var _has = __webpack_require__(16);
var identical = __webpack_require__(60);
var keys = __webpack_require__(10);
var type = __webpack_require__(61);


module.exports = function _equals(a, b, stackA, stackB) {
  if (identical(a, b)) {
    return true;
  }

  if (type(a) !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) &&
           typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) &&
           typeof b.equals === 'function' && b.equals(a);
  }

  switch (type(a)) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' &&
          _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!identical(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source &&
            a.global === b.global &&
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline &&
            a.sticky === b.sticky &&
            a.unicode === b.unicode)) {
        return false;
      }
      break;
    case 'Map':
    case 'Set':
      if (!_equals(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
        return false;
      }
      break;
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      break;
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);
  if (keysA.length !== keys(b).length) {
    return false;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  stackA.push(a);
  stackB.push(b);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], stackA, stackB))) {
      return false;
    }
    idx -= 1;
  }
  stackA.pop();
  stackB.pop();
  return true;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */
module.exports = _curry2(function identical(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);


/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 */
module.exports = _curry1(function type(val) {
  return val === null      ? 'Null'      :
         val === undefined ? 'Undefined' :
         Object.prototype.toString.call(val).slice(8, -1);
});


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = (function() {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
  XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap(fn) { return new XWrap(fn); };
}());


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(17);
var _curry2 = __webpack_require__(0);


/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */
module.exports = _curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(25);
var _curry1 = __webpack_require__(1);
var slice = __webpack_require__(66);


/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
module.exports = _curry1(_checkForMethod('tail', slice(1, Infinity)));


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(25);
var _curry3 = __webpack_require__(39);


/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function _isTransformer(obj) {
  return typeof obj['@@transducer/step'] === 'function';
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _xfBase = __webpack_require__(28);


module.exports = (function() {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return _curry2(function _xmap(f, xf) { return new XMap(f, xf); });
}());


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(17);
var _isPlaceholder = __webpack_require__(15);


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined)
                     : _arity(left, _curryN(length, combined, fn));
  };
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(71);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(72);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(6)))

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 72 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = child;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_identity__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_assert__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(2);



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * Create a new children stream instance from the given configuration, props$ stream & element.
 *
 * @param {string} container - Container key.
 * @param {Function} createSourceStream - Function that generates a source stream.
 * @param {Function} factory - Instance factory function.
 * @param {Function} modifyChildProps - Creates a new props$ stream for the child.
 * @param {Function} preplug - Modify the child instance stream.
 * @returns {Kefir.Observable} Child instance.
 */
function child(_ref) {
    var container = _ref.container,
        factory = _ref.factory,
        _ref$modifyChildProps = _ref.modifyChildProps,
        modifyChildProps = _ref$modifyChildProps === undefined ? __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default.a : _ref$modifyChildProps,
        _ref$preplug = _ref.preplug,
        preplug = _ref$preplug === undefined ? __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default.a : _ref$preplug;

    if (process.env.NODE_ENV !== 'production') {
        __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(typeof factory === 'undefined' ? 'undefined' : _typeof(factory), 'function', 'factory for ' + container + ' should be a function');
        __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(typeof modifyChildProps === 'undefined' ? 'undefined' : _typeof(modifyChildProps), 'function', 'modifyChildProps for ' + container + ' should be a function');
        __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(typeof preplug === 'undefined' ? 'undefined' : _typeof(preplug), 'function', 'preplug for ' + container + ' should be a function');
    }

    /**
     * Create child stream mounted to the provided element & props$.
     *
     * @param {Element} element - Child element.
     * @param {Kefir.Observable} props$ - Child props stream.
     * @returns {Kefir.Observable} - Child stream instance.
     */
    return __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default()(function (element, props$, _ref2) {
        var _ref2$useFactory = _ref2.useFactory,
            useFactory = _ref2$useFactory === undefined ? false : _ref2$useFactory;

        var keyAttr = element.getAttribute(__WEBPACK_IMPORTED_MODULE_3__constants__["g" /* KEY_ATTRIBUTE */]);
        var func = factory;

        if (!useFactory && factory[__WEBPACK_IMPORTED_MODULE_3__constants__["a" /* $$internals */]]) {
            func = factory[__WEBPACK_IMPORTED_MODULE_3__constants__["a" /* $$internals */]].createSourceStream;
        }

        return preplug(func(element, modifyChildProps(props$, keyAttr)), keyAttr);
    });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = function _identity(x) { return x; };


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = animateAttribute;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


/**
 * Create a new HTML animate attribute for.
 *
 * @param {string} key - Animation key.
 * @returns {string} Animation HTML attribute.
 */
function animateAttribute(key) {
  return __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* ANIMATE_ATTRIBUTE */] + '="' + key + '"';
}

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


function blackboxAttribute(container) {
    return __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* BLACKBOX_ATTRIBUTE */] + '="' + container + '"';
}

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = containerAttribute;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


/**
 * Generates a HTML attribute for a container.
 *
 * @param {string} name - Container name.
 * @returns {string} Container attribute.
 */
function containerAttribute(name) {
  return __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* CONTAINER_ATTRIBUTE */] + '="' + name + '"';
}

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


/**
 * Generates a HTML attribute for a key.
 *
 * @param {string} key - Key value.
 * @returns {string} Key attribute.
 */
function keyAttribute(key) {
  return __WEBPACK_IMPORTED_MODULE_0__constants__["g" /* KEY_ATTRIBUTE */] + '="' + key + '"';
}

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = event;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


/**
 * Generates HTML event attribute for an element.
 *
 * @param {string} event - Event name.
 * @param {string} callback - Callback key.
 * @returns {string} Event attribute.
 */
function event(event, callback) {
    var attr = __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* EVENT_ATTRIBUTES */][event];

    if (!attr) {
        return 'data-brk-unknown="' + event + '"';
    }

    return attr + '="' + callback + '"';
};

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__);


function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default()(function mapActionTo(source, dest, action) {
    if (action.type !== source) {
        return action;
    }

    var _action$meta = action.meta,
        meta = _action$meta === undefined ? {} : _action$meta,
        rest = _objectWithoutProperties(action, ['meta']);

    return Object.assign({}, rest, {
        type: dest,
        meta: Object.assign({}, meta, {
            sources: (meta.sources || []).concat(source)
        })
    });
}));

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _makeFlat = __webpack_require__(42);


/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */
module.exports = _curry1(_makeFlat(true));


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);

/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @func
 * @memberOf R
 * @since v0.21.0
 * @category List
 * @sig ((a, a) → Boolean) → [a] → [[a]]
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @param {Array} list The array to group. Also accepts a string, which will be
 *        treated as a list of characters.
 * @return {List} A list that contains sublists of elements,
 *         whose concatenations are equal to the original list.
 * @example
 *
 * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
 *
 * R.groupWith(R.eqBy(isVowel), 'aestiou')
 * //=> ['ae', 'st', 'iou']
 */
module.exports = _curry2(function(fn, list) {
  var res = [];
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    var nextidx = idx + 1;
    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }
    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }
  return res;
});


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns `true` if both arguments are `true`; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any} the first argument if it is falsy, otherwise the second argument.
 * @see R.both
 * @example
 *
 *      R.and(true, true); //=> true
 *      R.and(true, false); //=> false
 *      R.and(false, true); //=> false
 *      R.and(false, false); //=> false
 */
module.exports = _curry2(function and(a, b) {
  return a && b;
});


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 */
module.exports = _curry2(function path(paths, obj) {
  var val = obj;
  var idx = 0;
  while (idx < paths.length) {
    if (val == null) {
      return;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  return val;
});


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns `true` if one or both of its arguments are `true`. Returns `false`
 * if both arguments are `false`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any} the first argument if truthy, otherwise the second argument.
 * @see R.either
 * @example
 *
 *      R.or(true, true); //=> true
 *      R.or(true, false); //=> true
 *      R.or(false, true); //=> true
 *      R.or(false, false); //=> false
 */
module.exports = _curry2(function or(a, b) {
  return a || b;
});


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */
module.exports = _curry2(function max(a, b) { return b > a ? b : a; });


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var map = __webpack_require__(7);
var prop = __webpack_require__(21);


/**
 * Returns a new list by plucking the same named property off all objects in
 * the list supplied.
 *
 * `pluck` will work on
 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => k -> f {k: v} -> f v
 * @param {Number|String} key The key name to pluck off of each object.
 * @param {Array} f The array or functor to consider.
 * @return {Array} The list of values for the given key.
 * @see R.props
 * @example
 *
 *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
 *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
 */
module.exports = _curry2(function pluck(p, list) {
  return map(prop(p), list);
});


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_map__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_pipe__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_chain__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_chain___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda_src_chain__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_concat__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_concat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_concat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_forEach__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ramda_src_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__actions__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__util__ = __webpack_require__(31);












/**
 * Determines whether the node is a brook container node.
 *
 * @param {Node} node - Node to check.
 * @returns {boolean} Whether node is relevant to children$ streams.
 */
function isContainerNode(node) {
    return !!(node.hasAttribute && node.hasAttribute(__WEBPACK_IMPORTED_MODULE_6__constants__["e" /* CONTAINER_ATTRIBUTE */]));
}

/**
 * Maps a removed node and its target to an array of mutation actions.
 *
 * @param {Element} target - Node target for addition.
 * @param {Element} node - Node added to the target.
 * @return {Array<Action>} Array of mutation actions.
 */
var mapAddedNodeToActions = __WEBPACK_IMPORTED_MODULE_5_ramda_src_curry___default()(function (target, node) {
    if (!node.querySelectorAll) {
        return [];
    }

    if (isContainerNode(node)) {
        return [Object(__WEBPACK_IMPORTED_MODULE_8__actions__["c" /* nodeAdded */])(target, node)];
    }

    var added = [];
    __WEBPACK_IMPORTED_MODULE_4_ramda_src_forEach___default()(function (container) {
        var parent = container.parentNode;

        while (parent && parent !== node && !isContainerNode(parent)) {
            parent = parent.parentNode;
        }

        if (parent && parent === node) {
            added.push(Object(__WEBPACK_IMPORTED_MODULE_8__actions__["c" /* nodeAdded */])(target, container));
        }
    }, node.querySelectorAll('[' + __WEBPACK_IMPORTED_MODULE_6__constants__["e" /* CONTAINER_ATTRIBUTE */] + ']'));

    return added;
});

/**
 * Maps a removed node to its array of mutation actions.
 *
 * @param {Element} target - Node target for removal.
 * @param {Element} node - Node removed from the target.
 * @return {Array<Action>} Mutation Actions.
 */
var mapRemovedNodeToActions = __WEBPACK_IMPORTED_MODULE_5_ramda_src_curry___default()(function (target, node) {
    if (!node.querySelectorAll) {
        return [];
    }

    if (isContainerNode(node)) {
        return [Object(__WEBPACK_IMPORTED_MODULE_8__actions__["d" /* nodeRemoved */])(target, node)];
    }

    var removed = [];

    __WEBPACK_IMPORTED_MODULE_4_ramda_src_forEach___default()(function (container) {
        var parent = container.parentNode;

        while (parent && parent !== node && !isContainerNode(parent)) {
            parent = parent.parentNode;
        }

        if (parent && parent === node) {
            removed.push(Object(__WEBPACK_IMPORTED_MODULE_8__actions__["d" /* nodeRemoved */])(target, container));
        }
    }, node.querySelectorAll('[' + __WEBPACK_IMPORTED_MODULE_6__constants__["e" /* CONTAINER_ATTRIBUTE */] + ']'));

    return removed;
});

/**
 * Maps a MutationRecord to its array of mutation actions.
 *
 * @param {MutationRecord} record - MutationRecord to map.
 * @returns {Array<Action>} Array of mutation actions.
 */
function mapRecordsToActions(record) {
    return __WEBPACK_IMPORTED_MODULE_3_ramda_src_concat___default()(__WEBPACK_IMPORTED_MODULE_2_ramda_src_chain___default()(mapAddedNodeToActions(record.target), record.addedNodes), __WEBPACK_IMPORTED_MODULE_2_ramda_src_chain___default()(mapRemovedNodeToActions(record.target), record.removedNodes));
}

/**
 * Map simple actions to new actions with additional data.
 *
 * @param {string} type - Action type.
 * @param {Object} payload - Action payload.
 * @returns {Action} New Action with additional data.
 */
function mapActionsWithExtraData(_ref) {
    var type = _ref.type,
        payload = _ref.payload;
    var node = payload.node,
        target = payload.target;

    var container = node.getAttribute(__WEBPACK_IMPORTED_MODULE_6__constants__["e" /* CONTAINER_ATTRIBUTE */]);
    var key = node.getAttribute(__WEBPACK_IMPORTED_MODULE_6__constants__["g" /* KEY_ATTRIBUTE */]);
    var parent = Object(__WEBPACK_IMPORTED_MODULE_9__util__["c" /* getContainerNode */])(node.parentNode) || Object(__WEBPACK_IMPORTED_MODULE_9__util__["c" /* getContainerNode */])(target);

    return {
        type: type,
        payload: { container: container, key: key, node: node, parent: parent, target: target }
    };
}

/**
 * Stream of node additions and removals from the DOM.
 *
 * Filtered for relevance to subcomponents and formatted as an action.
 *
 * @type {Observable<T, S>}
 */
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_7__kefir__["a" /* default */].stream(function (emitter) {
    var observer = new MutationObserver(emitter.value);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    return function () {
        return observer.disconnect();
    };
}).flatten(__WEBPACK_IMPORTED_MODULE_1_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_2_ramda_src_chain___default()(mapRecordsToActions), __WEBPACK_IMPORTED_MODULE_9__util__["b" /* dedupeListOfMutationActions */], __WEBPACK_IMPORTED_MODULE_0_ramda_src_map___default()(mapActionsWithExtraData))));

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _dispatchable = __webpack_require__(26);
var _makeFlat = __webpack_require__(42);
var _xchain = __webpack_require__(90);
var map = __webpack_require__(7);


/**
 * `chain` maps a function over a list and concatenates the results. `chain`
 * is also known as `flatMap` in some libraries
 *
 * Dispatches to the `chain` method of the second argument, if present,
 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain m => (a -> m b) -> m a -> m b
 * @param {Function} fn The function to map with
 * @param {Array} list The list to map over
 * @return {Array} The result of flat-mapping `list` with `fn`
 * @example
 *
 *      var duplicate = n => [n, n];
 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
 *
 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
 */
module.exports = _curry2(_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
  if (typeof monad === 'function') {
    return function(x) { return fn(monad(x))(x); };
  }
  return _makeFlat(false)(map(fn, monad));
}));


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _flatCat = __webpack_require__(91);
var map = __webpack_require__(7);


module.exports = _curry2(function _xchain(f, xf) {
  return map(f, _flatCat(xf));
});


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var _forceReduced = __webpack_require__(92);
var _isArrayLike = __webpack_require__(24);
var _reduce = __webpack_require__(19);
var _xfBase = __webpack_require__(28);

module.exports = (function() {
  var preservingReduced = function(xf) {
    return {
      '@@transducer/init': _xfBase.init,
      '@@transducer/result': function(result) {
        return xf['@@transducer/result'](result);
      },
      '@@transducer/step': function(result, input) {
        var ret = xf['@@transducer/step'](result, input);
        return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
      }
    };
  };

  return function _xcat(xf) {
    var rxf = preservingReduced(xf);
    return {
      '@@transducer/init': _xfBase.init,
      '@@transducer/result': function(result) {
        return rxf['@@transducer/result'](result);
      },
      '@@transducer/step': function(result, input) {
        return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
      }
    };
  };
}());


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _isArray = __webpack_require__(20);
var _isFunction = __webpack_require__(94);
var _isString = __webpack_require__(40);
var toString = __webpack_require__(95);


/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */
module.exports = _curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }
    throw new TypeError(toString(b) + ' is not an array');
  }
  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }
    throw new TypeError(toString(b) + ' is not a string');
  }
  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }
  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }
  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = function _isFunction(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var _toString = __webpack_require__(96);


/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */
module.exports = _curry1(function toString(val) { return _toString(val, []); });


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var _contains = __webpack_require__(97);
var _map = __webpack_require__(27);
var _quote = __webpack_require__(99);
var _toISOString = __webpack_require__(100);
var keys = __webpack_require__(10);
var reject = __webpack_require__(101);


module.exports = function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
  };

  //  mapPairs :: (Object, [String]) -> [String]
  var mapPairs = function(obj, keys) {
    return _map(function(k) { return _quote(k) + ': ' + recur(obj[k]); }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject(function(k) { return /^\d+$/.test(k); }, keys(x)))).join(', ') + ']';
    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
    case '[object Null]':
      return 'null';
    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
    case '[object Undefined]':
      return 'undefined';
    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();
        if (repr !== '[object Object]') {
          return repr;
        }
      }
      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var _indexOf = __webpack_require__(98);


module.exports = function _contains(a, list) {
  return _indexOf(list, a, 0) >= 0;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var equals = __webpack_require__(23);


module.exports = function _indexOf(list, a, idx) {
  var inf, item;
  // Array.prototype.indexOf doesn't exist below IE9
  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === 'number' && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        // non-zero numbers can utilise Set
        return list.indexOf(a, idx);

      // all these types can utilise Set
      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }
    }
  }
  // anything else not covered above, defer to R.equals
  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
};


/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = function _quote(s) {
  var escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/[\b]/g, '\\b')  // \b matches word boundary; [\b] matches backspace
    .replace(/\f/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0');

  return '"' + escaped.replace(/"/g, '\\"') + '"';
};


/***/ }),
/* 100 */
/***/ (function(module, exports) {

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
module.exports = (function() {
  var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };

  return typeof Date.prototype.toISOString === 'function' ?
    function _toISOString(d) {
      return d.toISOString();
    } :
    function _toISOString(d) {
      return (
        d.getUTCFullYear() + '-' +
        pad(d.getUTCMonth() + 1) + '-' +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + ':' +
        pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) + '.' +
        (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
      );
    };
}());


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var _complement = __webpack_require__(102);
var _curry2 = __webpack_require__(0);
var filter = __webpack_require__(103);


/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      var isOdd = (n) => n % 2 === 1;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
module.exports = _curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _dispatchable = __webpack_require__(26);
var _filter = __webpack_require__(104);
var _isObject = __webpack_require__(105);
var _reduce = __webpack_require__(19);
var _xfilter = __webpack_require__(106);
var keys = __webpack_require__(10);


/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      var isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
module.exports = _curry2(_dispatchable(['filter'], _xfilter, function(pred, filterable) {
  return (
    _isObject(filterable) ?
      _reduce(function(acc, key) {
        if (pred(filterable[key])) {
          acc[key] = filterable[key];
        }
        return acc;
      }, {}, keys(filterable)) :
    // else
      _filter(pred, filterable)
  );
}));


/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);
var _xfBase = __webpack_require__(28);


module.exports = (function() {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;
  XFilter.prototype['@@transducer/step'] = function(result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return _curry2(function _xfilter(f, xf) { return new XFilter(f, xf); });
}());


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(25);
var _curry2 = __webpack_require__(0);


/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      var printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      // logs 6
 *      // logs 7
 *      // logs 8
 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
 */
module.exports = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }
  return list;
}));


/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_defaultTo__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_defaultTo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_defaultTo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_identity__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_flip__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_flip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_flip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_converge__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ramda_src_converge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ramda_src_converge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_reduce__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ramda_src_reduce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ramda_src_reduce__);







var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Reducer creator function.
 *
 * @type {Function}
 */
var reducer = __WEBPACK_IMPORTED_MODULE_5_ramda_src_reduce___default()(function (func, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        type = _ref2[0],
        reducer = _ref2[1];

    return function (state, action) {
        if (action.type === type) {
            state = reducer(state, action);
        }

        return func(state, action);
    };
});

/**
 * Create a new Action Reducer using a.
 *
 * @param {[string, function][]} cond - Array of action type/function tuples of type [ActionType, Reducer].
 * @param {Object} defaults - Default state.
 * @returns {Reducer} New action reducer.
 */
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_4_ramda_src_converge___default()(reducer, [__WEBPACK_IMPORTED_MODULE_3_ramda_src_flip___default()(function (defaults) {
    return __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default.a, __WEBPACK_IMPORTED_MODULE_0_ramda_src_defaultTo___default()(defaults));
}), __WEBPACK_IMPORTED_MODULE_1_ramda_src_identity___default.a]));

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(0);


/**
 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
 * otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {a} default The default value.
 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
 * @example
 *
 *      var defaultTo42 = R.defaultTo(42);
 *
 *      defaultTo42(null);  //=> 42
 *      defaultTo42(undefined);  //=> 42
 *      defaultTo42('Ramda');  //=> 'Ramda'
 *      // parseInt('string') results in NaN
 *      defaultTo42(parseInt('string')); //=> 42
 */
module.exports = _curry2(function defaultTo(d, v) {
  return v == null || v !== v ? d : v;
});


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(1);
var curry = __webpack_require__(5);


/**
 * Returns a new function much like the supplied one, except that the first two
 * arguments' order is reversed.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
 * @param {Function} fn The function to invoke with its first two parameters reversed.
 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
 * @example
 *
 *      var mergeThree = (a, b, c) => [].concat(a, b, c);
 *
 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
 *
 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
 * @symb R.flip(f)(a, b, c) = f(b, a, c)
 */
module.exports = _curry1(function flip(fn) {
  return curry(function(a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = component;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_values__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_values___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_values__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_always__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_always___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_always__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_assert__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_assert___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_assert__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants__ = __webpack_require__(2);





var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * Create a new Component with the provided configuration.
 *
 * @param {Function} children - `children$` generating function.
 * @param {Function} combinator - Called with component streams, returns combined stream.
 * @param {Function} events - `events$` stream generating function.
 * @param {Function} onMount - `onMount$` stream generating function.
 * @param {Function} render - `render$` stream generating function.
 * @returns {factory} Component factory function.
 * @factory
 */
function component(_ref) {
    var _ref$children = _ref.children,
        children = _ref$children === undefined ? __WEBPACK_IMPORTED_MODULE_3_ramda_src_always___default()(__WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].never()) : _ref$children,
        _ref$combinator = _ref.combinator,
        combinator = _ref$combinator === undefined ? __WEBPACK_IMPORTED_MODULE_2_ramda_src_pipe___default()(__WEBPACK_IMPORTED_MODULE_1_ramda_src_values___default.a, __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].merge) : _ref$combinator,
        _ref$events = _ref.events,
        events = _ref$events === undefined ? __WEBPACK_IMPORTED_MODULE_3_ramda_src_always___default()(__WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].never()) : _ref$events,
        _ref$onMount = _ref.onMount,
        onMount = _ref$onMount === undefined ? __WEBPACK_IMPORTED_MODULE_3_ramda_src_always___default()(__WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].never()) : _ref$onMount,
        _ref$render = _ref.render,
        render = _ref$render === undefined ? false : _ref$render;

    if (process.env.NODE_ENV !== 'production') {
        // Validate combinator
        __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(typeof combinator === 'undefined' ? 'undefined' : _typeof(combinator), 'function', '`combinator` should be a function');

        // Validate events function.
        __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(typeof events === 'undefined' ? 'undefined' : _typeof(events), 'function', '`events` should be a function');

        // Validate onMount$ stream generator.
        __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(typeof onMount === 'undefined' ? 'undefined' : _typeof(onMount), 'function', 'onMount should be a function');

        // Validate render function.
        if (render !== false) {
            __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(typeof render === 'undefined' ? 'undefined' : _typeof(render), 'function', '`render` should be a function');
            __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(_typeof(render({})), 'function', '`render` should be curried');
            __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(render.length, 2, '`render` should take 2 arguments');
        }

        // Validate children$ stream generator.
        __WEBPACK_IMPORTED_MODULE_4_assert___default.a.equal(typeof children === 'undefined' ? 'undefined' : _typeof(children), 'function', '`children` should be a function');
    }

    var internals = {

        /**
         * Creates a new source stream from the provided element and props stream.
         * A source stream emits the actions from the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createSourceStream: function createSourceStream(el, props$) {
            var onMount$ = onMount(el, props$);
            var events$ = events(el);
            var children$ = children(el, props$, { useFactory: !render });

            if (process.env.NODE_ENV !== 'production') {
                __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(children$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`children$` is not a `Kefir.Observable`');
                __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(events$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`events$` is not a `Kefir.Observable`');
                __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(onMount$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`onMount$` is not a `Kefir.Observable`');
            }

            var source$ = combinator({ onMount$: onMount$, events$: events$, children$: children$ });

            if (process.env.NODE_ENV !== 'production') {
                __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(source$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`source$` is not a `Kefir.Observable`');
            }

            return source$;
        },


        /**
         * Creates a new sink stream from the provided element and props stream.
         * A sink stream performs side effects on the element.
         *
         * @param {Element} el - Element to create a stream from.
         * @param {Observable<Props>} props$ - Stream of props.
         * @returns {Observable<Action>} Stream of actions from the DOM.
         */
        createSinkStream: function createSinkStream(el, props$) {
            if (render === false) {
                return __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].never();
            }

            var sink$ = render(el, props$);

            if (process.env.NODE_ENV !== 'production') {
                __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(sink$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`sink$` is not a `Kefir.Observable`');
            }

            return sink$;
        }
    };

    /**
     * Component factory function.
     *
     * @param {Element} el - Component element.
     * @param {Observable} props$ - Observable of component props.
     * @returns {Observable} Component instance.
     */
    var componentFactory = __WEBPACK_IMPORTED_MODULE_0_ramda_src_curry___default()(function (el, props$) {
        if (process.env.NODE_ENV !== 'production') {
            __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(el instanceof HTMLElement, 'el is not an HTMLElement');
            __WEBPACK_IMPORTED_MODULE_4_assert___default.a.ok(props$ instanceof __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].Observable, '`props$` is not a `Kefir.Observable`');
        }

        return __WEBPACK_IMPORTED_MODULE_5__kefir__["a" /* default */].merge([internals.createSinkStream(el, props$), internals.createSourceStream(el, props$)]);
    });

    componentFactory[__WEBPACK_IMPORTED_MODULE_6__constants__["a" /* $$internals */]] = internals;

    return componentFactory;
};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = domDelta;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_always__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_always___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_always__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__kefir__ = __webpack_require__(4);


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



/**
 * Creates a new stream that emits whether the document is loaded.
 *
 * @returns {Observable<boolean>} Observable indicating whether document is loaded.
 */
var documentIsLoaded = function documentIsLoaded() {
    return __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].fromCallback(function (callback) {
        return callback(document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive');
    });
};

/**
 * Creates a new delta for the DOM for the given configuration.
 *
 * @param {Element|Function} el - Element or function that returns Observable<Element>.
 * @param {Function} view - View component.
 * @param {Function} selectProps - Select the props$ stream from the state$.
 * @returns {Delta} Delta function.
 */
function domDelta(_ref) {
    var el = _ref.el,
        view = _ref.view,
        selectProps = _ref.selectProps;

    var precheck$ = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constant('Configuration correct');

    if (typeof el === 'function') {
        el = el(document);

        if (!(el instanceof __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].Observable)) {
            precheck$ = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constantError(new TypeError('type ' + (typeof el === 'undefined' ? 'undefined' : _typeof(el)) + ' returned from el is not valid'));
        }
    } else if (el instanceof Element) {
        el = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constant(el);
    } else {
        precheck$ = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constantError(new TypeError('el of type ' + (typeof el === 'undefined' ? 'undefined' : _typeof(el)) + ' is not valid'));
    }

    if (typeof view !== 'function') {
        precheck$ = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constantError(new TypeError('component of type ' + (typeof el === 'undefined' ? 'undefined' : _typeof(el)) + ' is not valid'));
    }

    if (typeof selectProps !== 'function') {
        precheck$ = __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].constantError(new TypeError('selectProps of type ' + (typeof el === 'undefined' ? 'undefined' : _typeof(el)) + ' is not valid'));
    }

    return function (actions$, state$) {
        return precheck$.flatMap(documentIsLoaded).flatMap(function (isLoaded) {
            return isLoaded ?
            // ensures async consistency
            __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].later(0, true) : __WEBPACK_IMPORTED_MODULE_1__kefir__["a" /* default */].fromEvents(document, 'DOMContentLoaded');
        }).flatMap(__WEBPACK_IMPORTED_MODULE_0_ramda_src_always___default()(el)).take(1).takeErrors(1).flatMap(function (el) {
            return view(el, selectProps(state$));
        });
    };
}

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = events;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_prop__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_prop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_prop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_assert__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__event__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants__ = __webpack_require__(2);



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };







/**
 * Associates a DOM element with its dispatch function.
 *
 * @type {WeakMap}
 */
var sources = new WeakMap();

/**
 * Check if any element in the capture area
 * and call the dispatcher with the event key.
 *
 * @param {string} EVENT - Event name.
 * @param {Emitter} emitter - source$ emitter.
 * @param {Event} ev - Event object.
 */
var listener = __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default()(function listener(EVENT, emitter, event) {
    (function traverse(target) {
        // Base case.
        if (!target || target === document.body) {
            return;
        }

        if (target.hasAttribute(__WEBPACK_IMPORTED_MODULE_5__constants__["f" /* EVENT_ATTRIBUTES */][EVENT])) {
            var container = target;
            var callback = target.getAttribute(__WEBPACK_IMPORTED_MODULE_5__constants__["f" /* EVENT_ATTRIBUTES */][EVENT]);

            while (container !== document.body && !container.hasAttribute(__WEBPACK_IMPORTED_MODULE_5__constants__["e" /* CONTAINER_ATTRIBUTE */])) {
                container = container.parentNode;
            }

            if (container.hasAttribute(__WEBPACK_IMPORTED_MODULE_5__constants__["e" /* CONTAINER_ATTRIBUTE */])) {
                var ev = __WEBPACK_IMPORTED_MODULE_4__event__["a" /* create */](event, target, container);
                emitter.value({ callback: callback, container: container, ev: ev });
            }
        }

        traverse(target.parentNode);
    })(event.target);
});

/**
 * Global events source stream.
 *
 * Delegates the subscription of any required events,
 * allowing many individual streams of DOM events to be
 * created out of a small number of event listeners.
 *
 * @type {Stream<T, S>}
 */
var sources$ = __WEBPACK_IMPORTED_MODULE_3__kefir__["a" /* default */].stream(function (emitter) {
    var listeners = {};

    __WEBPACK_IMPORTED_MODULE_5__constants__["h" /* SUPPORTED_EVENTS */].forEach(function (EVENT) {
        return document.body.addEventListener(EVENT, listeners[EVENT] = listener(EVENT, emitter), __WEBPACK_IMPORTED_MODULE_5__constants__["d" /* CAPTURE */][EVENT]);
    });

    return function () {
        return __WEBPACK_IMPORTED_MODULE_5__constants__["h" /* SUPPORTED_EVENTS */].forEach(function (EVENT) {
            return document.body.removeEventListener(EVENT, listeners[EVENT], __WEBPACK_IMPORTED_MODULE_5__constants__["d" /* CAPTURE */][EVENT]);
        });
    };
});

/**
 * Retrieves the event object from the emitted object.
 */
var getEvent = __WEBPACK_IMPORTED_MODULE_0_ramda_src_prop___default()('ev');

/**
 * Determines if the event object is scoped to the provided container & callback.
 *
 * @param {string} key - Container key.
 * @param {Element} el - Container element.
 * @param {Object} event - Event object.
 * @returns {boolean} Whether the event is matched.
 */
var eventMatches = __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default()(function eventMatches(key, el, event) {
    return event.callback === key && event.container === el;
});

/**
 * Create a new Events stream from the element.
 *
 * @param {Object} config - Events configuration.
 * @returns {Function} Events stream generator function.
 */
function events(config) {
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(_typeof(config[key]), 'function', 'events[' + key + '] is not a function');
        }
    }

    /**
     * Creates a delegated events$ stream from the element
     * and configuration.
     *
     * @param {Element} el - Element to make a stream.
     * @returns {Observable} Events stream instance.
     * @factory
     */
    return __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default()(function (el) {
        if (!el.hasAttribute(__WEBPACK_IMPORTED_MODULE_5__constants__["e" /* CONTAINER_ATTRIBUTE */])) {
            return __WEBPACK_IMPORTED_MODULE_3__kefir__["a" /* default */].never();
        }

        if (sources.has(el)) {
            return sources.get(el);
        }

        var mixin = {};

        var streams = Object.keys(config).map(function (key) {
            return mixin[key] = config[key](sources$.filter(eventMatches(key, el)).map(getEvent));
        });

        var events$ = Object.assign(Object.create(__WEBPACK_IMPORTED_MODULE_3__kefir__["a" /* default */].merge(streams)), mixin);
        sources.set(el, events$);
        return events$;
    });
};

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = create;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ALL_PROPS = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'timeStamp', 'type', 'view', 'which'];
var KEY_PROPS = ['char', 'charCode', 'key', 'keyCode'];
var MOUSE_PROPS = ['button', 'buttons', 'clientX', 'clientY', 'layerX', 'layerY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'];

var rkeyEvent = /^key|input/;
var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;

var $$event = Symbol('event');
var $$decorated = Symbol('decorated');
var $$container = Symbol('container');

var ProxyEvent = function () {
    function ProxyEvent(event, decorated, container) {
        _classCallCheck(this, ProxyEvent);

        for (var i = 0; i < ALL_PROPS.length; i++) {
            var propKey = ALL_PROPS[i];
            this[propKey] = event[propKey];
        }

        this[$$event] = event;
        this[$$decorated] = decorated;
        this[$$container] = container;
    }

    _createClass(ProxyEvent, [{
        key: 'preventDefault',
        value: function preventDefault() {
            return this[$$event].preventDefault();
        }
    }, {
        key: 'decoratedTarget',
        get: function get() {
            return this[$$decorated];
        }
    }, {
        key: 'containerTarget',
        get: function get() {
            return this[$$container];
        }
    }, {
        key: 'defaultPrevented',
        get: function get() {
            return this[$$event].defaultPrevented;
        }
    }]);

    return ProxyEvent;
}();

var MouseEvent = function (_ProxyEvent) {
    _inherits(MouseEvent, _ProxyEvent);

    function MouseEvent(event, decorated, container) {
        _classCallCheck(this, MouseEvent);

        var _this = _possibleConstructorReturn(this, (MouseEvent.__proto__ || Object.getPrototypeOf(MouseEvent)).call(this, event, decorated, container));

        for (var i = 0; i < MOUSE_PROPS.length; i++) {
            var mousePropKey = MOUSE_PROPS[i];
            _this[mousePropKey] = event[mousePropKey];
        }
        return _this;
    }

    return MouseEvent;
}(ProxyEvent);

var KeyEvent = function (_ProxyEvent2) {
    _inherits(KeyEvent, _ProxyEvent2);

    function KeyEvent(event, decorated, container) {
        _classCallCheck(this, KeyEvent);

        var _this2 = _possibleConstructorReturn(this, (KeyEvent.__proto__ || Object.getPrototypeOf(KeyEvent)).call(this, event, decorated, container));

        for (var i = 0; i < KEY_PROPS.length; i++) {
            var keyPropKey = KEY_PROPS[i];
            _this2[keyPropKey] = event[keyPropKey];
        }
        return _this2;
    }

    return KeyEvent;
}(ProxyEvent);

function create(event, decorated, container) {
    if (rkeyEvent.test(event.type)) {
        return new KeyEvent(event, decorated, container);
    }

    if (rmouseEvent.test(event.type)) {
        return new MouseEvent(event, decorated, container);
    }

    return new ProxyEvent(event, decorated, container);
}

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = observeDelta;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);


/**
 * Accepts a set of delta generator functions and returns a
 * Middlware function, which generates the `deltas$` stream
 * and binds it to the store.
 *
 * Provides an Observable-based way to respond to events from,
 * and emit events into, the application's central redux store.
 *
 * The delta function takes an `actions$` stream and a `state$`
 * stream, and should return a new `delta$` stream, which gets
 * observed by the store. Note that the `actions$` stream will
 * re-emit events emitted from the returned `delta$` stream.
 *
 * Exposes the returned subscription, allowing other middleware
 * to terminate the delta.
 *
 * @param {...Function} sources - Source-generating function.
 * @returns {Middleware} Enhanced create store function.
 */
function observeDelta() {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
    }

    return function (store) {
        var actions$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].actions();
        var state$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].pool();

        store.subscription = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].merge(sources.map(function (source) {
            return source(actions$, state$.toProperty(store.getState));
        })).flatMapErrors(function (err) {
            return __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                console.error('Error emitted into delta', err); // eslint-disable-line no-console
                emitter.end();
            });
        }).observe({ value: store.dispatch });

        return function (next) {
            return function (action) {
                var result = next(action);
                var state = store.getState();

                state$.plug(__WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].constant(state));
                actions$.plug(__WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].constant(result));

                return result;
            };
        };
    };
}

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return renderFromHTML; });
/* harmony export (immutable) */ __webpack_exports__["a"] = render;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_identity__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda_src_identity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda_src_identity__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda_src_curry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_assert___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_assert__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_diffhtml__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__rAF__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__animations__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__middleware__ = __webpack_require__(132);



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };










Object(__WEBPACK_IMPORTED_MODULE_4_diffhtml__["c" /* use */])(Object(__WEBPACK_IMPORTED_MODULE_8__middleware__["a" /* default */])());

/**
 * Creates a stream that updates the element to match the provided HTML.
 *
 * @param {Element} el - Element to update.
 * @param {string} html - HTML to update to.
 * @returns {Kefir.Observable} Render stream.
 */
var renderFromHTML = __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default()(function (el, html) {
    return __WEBPACK_IMPORTED_MODULE_6__rAF__["a" /* raf$ */].take(1).flatMap(function () {
        if (process.env.NODE_ENV !== 'production') {
            __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(typeof html === 'undefined' ? 'undefined' : _typeof(html), 'string', '`template` should return a string');
        }

        return Object(__WEBPACK_IMPORTED_MODULE_4_diffhtml__["b" /* outerHTML */])(el, html);
    });
});

/**
 * Generates a new rendering stream that ends after the element is updated.
 *
 * @param {Function} template - String-returning template function.
 * @param {Object} animations - Animation definitions.
 * @returns {Function} Curried stream generating function.
 */
function render(template) {
    var animations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (process.env.NODE_ENV !== 'production') {
        __WEBPACK_IMPORTED_MODULE_2_assert___default.a.equal(typeof template === 'undefined' ? 'undefined' : _typeof(template), 'function', '`template` should be a function');
    }

    var internals = {
        /**
         * Render sink stream generator function.
         *
         * @param {HTMLElement} el - Element to render against.
         * @param {Observable<T>} props$ - Stream of component props.
         * @returns {Stream<void, void>} Rendering stream.
         */
        createRenderSink: function createRenderSink(el, props$) {
            return props$.map(template).flatMapLatest(renderFromHTML(el));
        },

        createAnimationSink: function createAnimationSink(el, props$) {
            return Object(__WEBPACK_IMPORTED_MODULE_7__animations__["a" /* registerElementAnimations */])(el, animations)
            // props$ only emits a value right before it ends, ending the registration stream.
            // delay ensures we unregister the element after the last render has completed.
            .takeUntilBy(props$.ignoreValues().beforeEnd(function () {
                return __WEBPACK_IMPORTED_MODULE_6__rAF__["a" /* raf$ */].take(1).delay(5);
            }).flatMap(__WEBPACK_IMPORTED_MODULE_0_ramda_src_identity___default.a));
        }
    };

    /**
     * Create combined render/animation stream.
     *
     * @param {HTMLElement} el - Element to render against.
     * @param {Observable<T>} props$ - Stream of component props.
     * @returns {Stream<void, void>} Rendering stream.
     */
    var renderFactory = __WEBPACK_IMPORTED_MODULE_1_ramda_src_curry___default()(function (el, props$) {
        return __WEBPACK_IMPORTED_MODULE_3__kefir__["a" /* default */].merge([internals.createRenderSink(el, props$), internals.createAnimationSink(el, props$)]);
    });

    renderFactory[__WEBPACK_IMPORTED_MODULE_5__constants__["a" /* $$internals */]] = internals;

    return renderFactory;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseNewTree;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_parse__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tree_create__ = __webpack_require__(13);




function parseNewTree(transaction) {
  var state = transaction.state,
      markup = transaction.markup,
      options = transaction.options;
  var measure = state.measure;
  var inner = options.inner;

  if (typeof markup === 'string') {
    measure('parsing markup for new tree');

    var _parse = Object(__WEBPACK_IMPORTED_MODULE_1__util_parse__["a" /* default */])(markup, null, options),
        childNodes = _parse.childNodes;

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.


    transaction.newTree = Object(__WEBPACK_IMPORTED_MODULE_2__tree_create__["a" /* default */])(inner ? childNodes : childNodes[0] || childNodes);

    measure('parsing markup for new tree');
  }
}

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__decode_entities__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__escape__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__make_measure__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__memory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pool__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__process__ = __webpack_require__(8);








/* harmony default export */ __webpack_exports__["a"] = (Object.assign({
  decodeEntities: __WEBPACK_IMPORTED_MODULE_1__decode_entities__["a" /* default */],
  escape: __WEBPACK_IMPORTED_MODULE_2__escape__["a" /* default */],
  makeMeasure: __WEBPACK_IMPORTED_MODULE_3__make_measure__["a" /* default */],
  memory: __WEBPACK_IMPORTED_MODULE_4__memory__,
  Pool: __WEBPACK_IMPORTED_MODULE_5__pool__["a" /* default */],
  process: __WEBPACK_IMPORTED_MODULE_6__process__["a" /* default */]
}, __WEBPACK_IMPORTED_MODULE_0__caches__));

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = innerHTML;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transaction__ = __webpack_require__(37);


function innerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = true;
  options.tasks = options.tasks || __WEBPACK_IMPORTED_MODULE_0__transaction__["b" /* defaultTasks */];
  return __WEBPACK_IMPORTED_MODULE_0__transaction__["a" /* default */].create(element, markup, options).start();
}

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = schedule;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);


/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  var state = transaction.state;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.

  if (state.isRendering) {
    // Resolve an existing transaction that we're going to pave over in the
    // next statement.
    if (state.nextTransaction) {
      state.nextTransaction.promises[0].resolve(state.nextTransaction);
    }

    // Set a pointer to this current transaction to render immediatately after
    // the current transaction completes.
    state.nextTransaction = transaction;

    var deferred = {};
    var resolver = new Promise(function (resolve) {
      return deferred.resolve = resolve;
    });

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shouldUpdate;
function shouldUpdate(transaction) {
  var markup = transaction.markup,
      state = transaction.state,
      measure = transaction.state.measure;

  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = syncTrees;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tree_sync__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_create__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_memory__ = __webpack_require__(9);





function syncTrees(transaction) {
  var measure = transaction.state.measure,
      oldTree = transaction.oldTree,
      newTree = transaction.newTree,
      domNode = transaction.domNode;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    transaction.patches = {
      TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
      NODE_VALUE: []
    };

    Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["unprotectVTree"])(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["protectVTree"])(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    __WEBPACK_IMPORTED_MODULE_2__util_caches__["StateCache"].set(Object(__WEBPACK_IMPORTED_MODULE_1__node_create__["a" /* default */])(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = Object(__WEBPACK_IMPORTED_MODULE_0__tree_sync__["a" /* default */])(oldTree, newTree);
    }

  measure('sync trees');
}

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = syncTree;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_process__ = __webpack_require__(8);



var SyncTreeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].SyncTreeHookCache;
var assign = Object.assign,
    keys = Object.keys;

var empty = {};
var keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
function syncTree(oldTree, newTree, patches, parentTree, specialCase) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  var oldNodeName = oldTree.nodeName;
  var newNodeName = newTree.nodeName;
  var isFragment = newTree.nodeType === 11;
  var isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  var keysLookup = { old: new Map(), new: new Map() };

  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    }

    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error('Sync failure, cannot compare ' + newNodeName + ' with ' + oldNodeName);
    }
  }

  // Reduce duplicate logic by condensing old and new operations in a loop.
  for (var i = 0; i < keyNames.length; i++) {
    var keyName = keyNames[i];
    var map = keysLookup[keyName];
    var vTree = arguments[i];
    var nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var _vTree = nodes[_i];

        if (_vTree.key) {
          map.set(_vTree.key, _vTree);
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach(function (fn, retVal) {
    oldTree = specialCase || oldTree;

    // Call the user provided middleware function for a single root node. Allow
    // the consumer to specify a return value of a different VTree (useful for
    // components).
    retVal = fn(oldTree, newTree, keysLookup, parentTree) || newTree;

    // If the consumer returned a value and it doesn't equal the existing tree,
    // then splice it into the parent (if it exists) and run a sync.
    if (retVal && retVal !== newTree) {
      newTree.childNodes = [].concat(retVal);
      syncTree(oldTree !== empty ? oldTree : null, retVal, patches, newTree);
      newTree = retVal;
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
    TREE_OPS: [],
    NODE_VALUE: []
  };

  var _patches = patches,
      SET_ATTRIBUTE = _patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = _patches.REMOVE_ATTRIBUTE,
      TREE_OPS = _patches.TREE_OPS,
      NODE_VALUE = _patches.NODE_VALUE;

  // Build up a patchset object to use for tree operations.

  var patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: []
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  var INSERT_BEFORE = patchset.INSERT_BEFORE,
      REMOVE_CHILD = patchset.REMOVE_CHILD,
      REPLACE_CHILD = patchset.REPLACE_CHILD;

  var isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
    }
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
        NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
      }

    return patches;
  }

  // Seek out attribute changes first, but only from element Nodes.
  if (isElement) {
    var oldAttributes = isEmpty ? empty : oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (var key in newAttributes) {
      var value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      SET_ATTRIBUTE.push(isEmpty ? newTree : oldTree, key, value);
    }

    // Search for removals.
    if (!isEmpty) {
      for (var _key in oldAttributes) {
        if (_key in newAttributes) {
          continue;
        }
        REMOVE_ATTRIBUTE.push(oldTree, _key);
        delete oldAttributes[_key];
      }
    }
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error('Sync failure, cannot compare ' + newNodeName + ' with ' + oldNodeName);
    }
  }

  var newChildNodes = newTree.childNodes;

  // Scan all childNodes for attribute changes.
  if (isEmpty) {
    // Do a single pass over the new child nodes.
    for (var _i2 = 0; _i2 < newChildNodes.length; _i2++) {
      syncTree(null, newChildNodes[_i2], patches, newTree);
    }

    return patches;
  }

  var oldChildNodes = oldTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    var values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (var _i3 = 0; _i3 < newChildNodes.length; _i3++) {
      var oldChildNode = oldChildNodes[_i3];
      var newChildNode = newChildNodes[_i3];
      var newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches, newTree);
        continue;
      }

      var oldKey = oldChildNode.key;
      var oldInNew = keysLookup.new.has(oldKey);
      var newInOld = keysLookup.old.has(newKey);

      // Remove the old Node and insert the new node (aka replace).
      if (!oldInNew && !newInOld) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches, newTree);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!oldInNew) {
          REMOVE_CHILD.push(oldChildNode);
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
          _i3 = _i3 - 1;
          continue;
        }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        var optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches, newTree);
        }

        INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(_i3, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[_i3] = newChildNode;
        syncTree(null, newChildNode, patches, newTree);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches, newTree);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (var _i4 = 0; _i4 < newChildNodes.length; _i4++) {
        var _oldChildNode = oldChildNodes && oldChildNodes[_i4];
        var _newChildNode = newChildNodes[_i4];

        // If there is no old element to compare to, this is a simple addition.
        if (!_oldChildNode) {
          INSERT_BEFORE.push(oldTree, _newChildNode, null);

          if (oldChildNodes) {
            oldChildNodes.push(_newChildNode);
          }

          syncTree(null, _newChildNode, patches, oldTree);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (_oldChildNode.nodeName !== _newChildNode.nodeName) {
          REPLACE_CHILD.push(_newChildNode, _oldChildNode);
          // FIXME Calling this out specifically as a special case since we
          // have conflicting requirements between synchronization and how
          // components handle reconcilation. We basically don't want to dig
          // deeper into the component at the diffHTML level, but want to let
          // the middleware have access to the old child.
          var _specialCase = oldTree.childNodes[_i4];
          oldTree.childNodes[_i4] = _newChildNode;
          syncTree(null, _newChildNode, patches, oldTree, _specialCase);
          continue;
        }

        syncTree(_oldChildNode, _newChildNode, patches, oldTree);
      }
    }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (var _i5 = newChildNodes.length; _i5 < oldChildNodes.length; _i5++) {
      REMOVE_CHILD.push(oldChildNodes[_i5]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE.length || REMOVE_CHILD.length || REPLACE_CHILD.length) {
    // Null out the empty arrays.
    if (!INSERT_BEFORE.length) {
      patchset.INSERT_BEFORE = null;
    }
    if (!REMOVE_CHILD.length) {
      patchset.REMOVE_CHILD = null;
    }
    if (!REPLACE_CHILD.length) {
      patchset.REPLACE_CHILD = null;
    }

    TREE_OPS.push(patchset);
  }

  return patches;
}

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = patch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_patch__ = __webpack_require__(125);
function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}



/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
    var domNode = transaction.domNode,
        state = transaction.state,
        measure = transaction.state.measure,
        patches = transaction.patches;
    var _transaction$promises = transaction.promises,
        promises = _transaction$promises === undefined ? [] : _transaction$promises;
    var _domNode$namespaceURI = domNode.namespaceURI,
        namespaceURI = _domNode$namespaceURI === undefined ? '' : _domNode$namespaceURI,
        nodeName = domNode.nodeName;

    state.isSVG = nodeName.toLowerCase() === 'svg' || namespaceURI.includes('svg');
    state.ownerDocument = domNode.ownerDocument || document;

    measure('patch node');
    promises.push.apply(promises, _toConsumableArray(Object(__WEBPACK_IMPORTED_MODULE_0__node_patch__["a" /* default */])(patches, state)));
    measure('patch node');

    transaction.promises = promises;
}

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = patchNode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__create__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transition__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_memory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_decode_entities__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_escape__ = __webpack_require__(36);
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}








var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var removeAttribute = function removeAttribute(domNode, name) {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

var blacklist = new Set();

function patchNode(patches) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var promises = [];
  var TREE_OPS = patches.TREE_OPS,
      NODE_VALUE = patches.NODE_VALUE,
      SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;
  var isSVG = state.isSVG,
      ownerDocument = state.ownerDocument;

  // Set attributes.

  if (SET_ATTRIBUTE.length) {
    for (var i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      var vTree = SET_ATTRIBUTE[i];
      var _name = SET_ATTRIBUTE[i + 1];
      var value = Object(__WEBPACK_IMPORTED_MODULE_4__util_decode_entities__["a" /* default */])(SET_ATTRIBUTE[i + 2]);

      var domNode = Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])(vTree, ownerDocument, isSVG);
      var oldValue = domNode.getAttribute(_name);
      var newPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('attributeChanged', domNode, _name, oldValue, value);

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      var name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        var noValue = value === null || value === undefined;
        // Runtime checking if the property can be set.
        var blacklistName = vTree.nodeName + '-' + name;

        // If the property has not been blacklisted then use try/catch to try
        // and set it.
        if (!blacklist.has(blacklistName)) {
          try {
            domNode[name] = value;
          } catch (unhandledException) {
            blacklist.add(blacklistName);
          }
        }

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
          var keys = Object.keys(value);

          for (var _i = 0; _i < keys.length; _i++) {
            domNode.style[keys[_i]] = value[keys[_i]];
          }
        } else if (typeof value !== 'string') {
          // We remove and re-add the attribute to trigger a change in a web
          // component or mutation observer. Although you could use a setter or
          // proxy, this is more natural.
          if (domNode.hasAttribute(name) && domNode[name] !== value) {
            domNode.removeAttribute(name, '');
          }

          // Necessary to track the attribute/prop existence.
          domNode.setAttribute(name, '');

          // Since this is a property value it gets set directly on the node.
          try {
            domNode[name] = value;
          } catch (unhandledException) {}
        }

      if (newPromises.length) {
        promises.push.apply(promises, _toConsumableArray(newPromises));
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    var _loop = function _loop(_i2) {
      var vTree = REMOVE_ATTRIBUTE[_i2];
      var name = REMOVE_ATTRIBUTE[_i2 + 1];

      var domNode = __WEBPACK_IMPORTED_MODULE_2__util_caches__["NodeCache"].get(vTree);
      var attributeChanged = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('attributeChanged');

      var oldValue = domNode.getAttribute(name);
      var newPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('attributeChanged', domNode, name, oldValue, null);

      if (newPromises.length) {
        Promise.all(newPromises).then(function () {
          return removeAttribute(domNode, name);
        });
        promises.push.apply(promises, _toConsumableArray(newPromises));
      } else {
        removeAttribute(domNode, name);
      }
    };

    for (var _i2 = 0; _i2 < REMOVE_ATTRIBUTE.length; _i2 += 2) {
      _loop(_i2);
    }
  }

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (var _i3 = 0; _i3 < TREE_OPS.length; _i3++) {
    var _TREE_OPS$_i = TREE_OPS[_i3],
        INSERT_BEFORE = _TREE_OPS$_i.INSERT_BEFORE,
        REMOVE_CHILD = _TREE_OPS$_i.REMOVE_CHILD,
        REPLACE_CHILD = _TREE_OPS$_i.REPLACE_CHILD;

    // Insert/append elements.

    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (var _i4 = 0; _i4 < INSERT_BEFORE.length; _i4 += 3) {
        var _vTree = INSERT_BEFORE[_i4];
        var newTree = INSERT_BEFORE[_i4 + 1];
        var refTree = INSERT_BEFORE[_i4 + 2];

        var _domNode = __WEBPACK_IMPORTED_MODULE_2__util_caches__["NodeCache"].get(_vTree);
        var refNode = refTree && Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])(refTree, ownerDocument, isSVG);
        var attached = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('attached');

        if (refTree) {
          Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["protectVTree"])(refTree);
        }

        var newNode = Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])(newTree, ownerDocument, isSVG);
        Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["protectVTree"])(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        _domNode.insertBefore(newNode, refNode);

        var attachedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('attached', newNode);

        promises.push.apply(promises, _toConsumableArray(attachedPromises));
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      var _loop2 = function _loop2(_i5) {
        var vTree = REMOVE_CHILD[_i5];
        var domNode = __WEBPACK_IMPORTED_MODULE_2__util_caches__["NodeCache"].get(vTree);
        var detached = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('detached');
        var detachedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(function () {
            domNode.parentNode.removeChild(domNode);
            Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["unprotectVTree"])(vTree);
          });

          promises.push.apply(promises, _toConsumableArray(detachedPromises));
        } else {
          domNode.parentNode.removeChild(domNode);
          Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["unprotectVTree"])(vTree);
        }
      };

      for (var _i5 = 0; _i5 < REMOVE_CHILD.length; _i5++) {
        _loop2(_i5);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      var _loop3 = function _loop3(_i6) {
        var newTree = REPLACE_CHILD[_i6];
        var oldTree = REPLACE_CHILD[_i6 + 1];

        var oldDomNode = __WEBPACK_IMPORTED_MODULE_2__util_caches__["NodeCache"].get(oldTree);
        var newDomNode = Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])(newTree, ownerDocument, isSVG);
        var attached = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('attached');
        var detached = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('detached');
        var replaced = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["protectVTree"])(newTree);

        var attachedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('attached', newDomNode);
        var detachedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('detached', oldDomNode);
        var replacedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('replaced', oldDomNode, newDomNode);
        var allPromises = [].concat(_toConsumableArray(attachedPromises), _toConsumableArray(detachedPromises), _toConsumableArray(replacedPromises));

        if (allPromises.length) {
          Promise.all(allPromises).then(function () {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["unprotectVTree"])(oldTree);
          });

          promises.push.apply(promises, _toConsumableArray(allPromises));
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          Object(__WEBPACK_IMPORTED_MODULE_3__util_memory__["unprotectVTree"])(oldTree);
        }
      };

      for (var _i6 = 0; _i6 < REPLACE_CHILD.length; _i6 += 2) {
        _loop3(_i6);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (var _i7 = 0; _i7 < NODE_VALUE.length; _i7 += 3) {
      var _vTree2 = NODE_VALUE[_i7];
      var nodeValue = NODE_VALUE[_i7 + 1];
      var _oldValue = NODE_VALUE[_i7 + 2];
      var _domNode2 = __WEBPACK_IMPORTED_MODULE_2__util_caches__["NodeCache"].get(_vTree2);
      var textChanged = __WEBPACK_IMPORTED_MODULE_2__util_caches__["TransitionCache"].get('textChanged');
      var textChangedPromises = Object(__WEBPACK_IMPORTED_MODULE_1__transition__["c" /* runTransitions */])('textChanged', _domNode2, _oldValue, nodeValue);

      var parentNode = _domNode2.parentNode;

      if (nodeValue.includes('&')) {
        _domNode2.nodeValue = Object(__WEBPACK_IMPORTED_MODULE_4__util_decode_entities__["a" /* default */])(nodeValue);
      } else {
        _domNode2.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = Object(__WEBPACK_IMPORTED_MODULE_5__util_escape__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_4__util_decode_entities__["a" /* default */])(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push.apply(promises, _toConsumableArray(textChangedPromises));
      }
    }
  }

  return promises;
}

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = endAsPromise;
// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.

  if (promises.length) {
    return Promise.all(promises).then(function () {
      return transaction.end();
    });
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = outerHTML;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transaction__ = __webpack_require__(37);


function outerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = false;
  options.tasks = options.tasks || __WEBPACK_IMPORTED_MODULE_0__transaction__["b" /* defaultTasks */];
  return __WEBPACK_IMPORTED_MODULE_0__transaction__["a" /* default */].create(element, markup, options).start();
}

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = handleTaggedTemplate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tree_create__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_parse__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_escape__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_decode_entities__ = __webpack_require__(35);
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};






var isAttributeEx = /(=|"|')[^><]*?$/;
var isTagEx = /(<|\/)/;
var TOKEN = '__DIFFHTML__';

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
var nextValue = function nextValue(values) {
  var value = values.shift();
  return typeof value === 'string' ? Object(__WEBPACK_IMPORTED_MODULE_2__util_escape__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_3__util_decode_entities__["a" /* default */])(value)) : value;
};

function handleTaggedTemplate(strings) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    var _childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__util_parse__["a" /* default */])(strings[0]).childNodes;
    return _childNodes.length > 1 ? Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])(_childNodes) : _childNodes[0];
  }

  // Used to store markup and tokens.
  var HTML = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  var supplemental = {
    attributes: {},
    children: {},
    tags: {}
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(function (string, i) {
    // Always add the string, we need it to parse the markup later.
    HTML += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isAttribute = Boolean(HTML.match(isAttributeEx));
      var isTag = Boolean(lastCharacter.match(isTagEx));
      var isString = typeof value === 'string';
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isArray = Array.isArray(value);
      var token = TOKEN + i + '__';

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes[i] = value;
        HTML += token;
      }
      // Injected as a tag.
      else if (isTag && !isString) {
          supplemental.tags[i] = value;
          HTML += token;
        }
        // Injected as a child node.
        else if (isArray || isObject) {
            supplemental.children[i] = Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])(value);
            HTML += token;
          }
          // Injected as something else in the markup or undefined, ignore
          // obviously falsy values used with boolean operators.
          else if (value) {
              HTML += value;
            }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  var childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__util_parse__["a" /* default */])(HTML, supplemental).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : Object(__WEBPACK_IMPORTED_MODULE_0__tree_create__["a" /* default */])(childNodes);
}

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = release;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_memory__ = __webpack_require__(9);



function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = __WEBPACK_IMPORTED_MODULE_0__util_caches__["StateCache"].get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    Object(__WEBPACK_IMPORTED_MODULE_1__util_memory__["unprotectVTree"])(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  __WEBPACK_IMPORTED_MODULE_0__util_caches__["StateCache"].delete(domNode);

  // Recycle all unprotected objects.
  Object(__WEBPACK_IMPORTED_MODULE_1__util_memory__["cleanMemory"])();
}

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = use;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_caches__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_process__ = __webpack_require__(8);



var CreateTreeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].CreateTreeHookCache,
    CreateNodeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].CreateNodeHookCache,
    SyncTreeHookCache = __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].SyncTreeHookCache;

function use(middleware) {
  if (__WEBPACK_IMPORTED_MODULE_1__util_process__["a" /* default */].env.NODE_ENV !== 'production') {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
  }

  var subscribe = middleware.subscribe,
      unsubscribe = middleware.unsubscribe,
      createTreeHook = middleware.createTreeHook,
      createNodeHook = middleware.createNodeHook,
      syncTreeHook = middleware.syncTreeHook;

  // Add the function to the set of middlewares.

  __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe();

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    __WEBPACK_IMPORTED_MODULE_0__util_caches__["MiddlewareCache"].delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe();

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache.delete(createTreeHook);
    CreateNodeHookCache.delete(createNodeHook);
    SyncTreeHookCache.delete(syncTreeHook);
  };
}

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __VERSION__; });
var __VERSION__ = '1.0.0-beta.7';

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = middleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_diffhtml__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getNodeKey__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__endAsObservable__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__patchTask__ = __webpack_require__(135);






var patchNode = __WEBPACK_IMPORTED_MODULE_0_diffhtml__["a" /* Internals */].tasks.patchNode;

/**
 * Adds the key for every newly created tree.
 *
 * @param {VTree} tree - New tree.
 * @returns {VTree} Updated tree.
 */

var createTreeHook = function createTreeHook(tree) {
  tree.key = Object(__WEBPACK_IMPORTED_MODULE_2__getNodeKey__["a" /* default */])(tree);

  return tree;
};

/**
 * Check if the component is a blackboxed element and ensure it doesn't change.
 *
 * @param {VTree} oldTree - Current tree state.
 * @param {VTree} newTree - New tree state.
 * @returns {VTree} Updated tree state.
 */
var syncTreeHook = function syncTreeHook(oldTree, newTree) {
  return oldTree && oldTree.attributes && oldTree.attributes[__WEBPACK_IMPORTED_MODULE_1__constants__["c" /* BLACKBOX_ATTRIBUTE */]] ? oldTree : newTree;
};

/**
 * Create an instance of the render middleware for diffhtml.
 *
 * @returns {renderTask} Render task middleware.
 */
function middleware() {
  /**
   * Maintains the current transaction, overwrites
   * the built in patch function with our observable
   * handling.
   *
   * @param {Transaction} transaction - Incoming transaction.
   */
  function renderTask(transaction) {
    var idx = transaction.tasks.indexOf(patchNode);

    transaction.tasks[idx] = __WEBPACK_IMPORTED_MODULE_4__patchTask__["a" /* default */];
    transaction.tasks[idx + 1] = __WEBPACK_IMPORTED_MODULE_3__endAsObservable__["a" /* default */];
  }

  return Object.assign(renderTask, { createTreeHook: createTreeHook, syncTreeHook: syncTreeHook });
}

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getNodeKey;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);


/**
 * Generate a unique key for the provided vTree.
 *
 * @param {vTree} tree - Tree to get key form.
 * @returns {string} vTree key.
 */
function getNodeKey(tree) {
    var key = '';

    if (tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* CONTAINER_ATTRIBUTE */]]) {
        key = tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* CONTAINER_ATTRIBUTE */]];

        if (tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* KEY_ATTRIBUTE */]]) {
            key += '::' + tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* KEY_ATTRIBUTE */]];
        }
    }

    if (tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["c" /* BLACKBOX_ATTRIBUTE */]]) {
        if (key) {
            key += '::';
        }

        key += tree.attributes[__WEBPACK_IMPORTED_MODULE_0__constants__["c" /* BLACKBOX_ATTRIBUTE */]];
    }

    return key;
}

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = endAsObservable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



/**
 * Create Transaction end stream.
 *
 * @param {Transaction} transaction - Ending transaction.
 * @returns {Observable<void>} Transaction end stream.
 */
var createEnd = function createEnd(transaction) {
    return __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
        transaction.end();
        emitter.end();
    });
};

/**
 * Terminate the transaction by returning an Observable instead of a Promise.
 *
 * @param {Transaction} transaction - Transaction object.
 * @returns {Observable} Render observable.
 */
function endAsObservable(transaction) {
    var _transaction$observab = transaction.observables,
        observables = _transaction$observab === undefined ? [] : _transaction$observab,
        _transaction$promises = transaction.promises,
        promises = _transaction$promises === undefined ? [] : _transaction$promises;


    var end$ = createEnd(transaction);

    if (!observables.length && !promises.length) {
        return end$;
    }

    return __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].concat([__WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].merge([].concat(_toConsumableArray(observables), _toConsumableArray(promises.map(__WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].fromPromise)))), end$]);
}

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = patchTask;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__patchAsObservable__ = __webpack_require__(136);
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



/**
 * Replacement patch task that actually updates the DOM.
 *
 * @param {Transaction} transaction - Current running transaction.
 */
function patchTask(transaction) {
    var _transaction$state = transaction.state,
        measure = _transaction$state.measure,
        internals = _transaction$state.internals,
        patches = transaction.patches,
        _transaction$observab = transaction.observables,
        observables = _transaction$observab === undefined ? [] : _transaction$observab;


    measure('patch node (observable)');
    observables.push.apply(observables, _toConsumableArray(Object(__WEBPACK_IMPORTED_MODULE_0__patchAsObservable__["a" /* default */])(patches, internals)));
    measure('patch node (observable)');

    transaction.observables = observables;
}

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = patchAsObservable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kefir__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_diffhtml__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__children_util__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__animations__ = __webpack_require__(50);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };






var createNode = __WEBPACK_IMPORTED_MODULE_1_diffhtml__["a" /* Internals */].createNode,
    NodeCache = __WEBPACK_IMPORTED_MODULE_1_diffhtml__["a" /* Internals */].NodeCache,
    memory = __WEBPACK_IMPORTED_MODULE_1_diffhtml__["a" /* Internals */].memory,
    decodeEntities = __WEBPACK_IMPORTED_MODULE_1_diffhtml__["a" /* Internals */].decodeEntities,
    escape = __WEBPACK_IMPORTED_MODULE_1_diffhtml__["a" /* Internals */].escape;
var protectVTree = memory.protectVTree,
    unprotectVTree = memory.unprotectVTree;


var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var removeAttribute = function removeAttribute(domNode, name) {
    domNode.removeAttribute(name);

    if (name in domNode) {
        domNode[name] = undefined;
    }
};

function patchAsObservable(patches) {
    var observables = [];
    var TREE_OPS = patches.TREE_OPS,
        NODE_VALUE = patches.NODE_VALUE,
        SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
        REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;

    // Set attributes.

    if (SET_ATTRIBUTE.length) {
        var _loop = function _loop(i) {
            var vTree = SET_ATTRIBUTE[i];
            var attribute = SET_ATTRIBUTE[i + 1];
            var newValue = decodeEntities(SET_ATTRIBUTE[i + 2]);
            var domNode = createNode(vTree);

            // Triggered either synchronously or asynchronously depending on if a
            // transition was invoked.
            var isObject = (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object';
            var isFunction = typeof newValue === 'function';

            // Events must be lowercased otherwise they will not be set correctly.
            var name = attribute.indexOf('on') === 0 ? attribute.toLowerCase() : attribute;

            var effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].never();

            // Normal attribute value.
            if (!isObject && !isFunction && name) {
                effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    var noValue = newValue === null || newValue === undefined;

                    // Allow the user to find the real value in the DOM Node as a
                    // property.
                    try {
                        domNode[name] = newValue;
                    } catch (unhandledException) {} // eslint-disable-line no-empty

                    // Set the actual attribute, this will ensure attributes like
                    // `autofocus` aren't reset by the property call above.
                    domNode.setAttribute(name, noValue ? '' : newValue);

                    emitter.end();
                });
                // Support patching an object representation of the style object.
            } else if (isObject && name === 'style') {
                effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    var keys = Object.keys(newValue);

                    for (var _i = 0; _i < keys.length; _i++) {
                        domNode.style[keys[_i]] = newValue[keys[_i]];
                    }

                    emitter.end();
                });
            } else if (typeof newValue !== 'string') {
                effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    // We remove and re-add the attribute to trigger a change in a web
                    // component or mutation observer. Although you could use a setter or
                    // proxy, this is more natural.
                    if (domNode.hasAttribute(name) && domNode[name] !== newValue) {
                        domNode.removeAttribute(name, '');
                    }

                    // Necessary to track the attribute/prop existence.
                    domNode.setAttribute(name, '');

                    // Since this is a property value it gets set directly on the node.
                    try {
                        domNode[name] = newValue;
                    } catch (unhandledException) {} // eslint-disable-line no-empty

                    emitter.end();
                });
            }

            // If an attribute it being added to a DOM node that's about
            // to be added to the DOM, then we need to do this now.
            if (!domNode.parentNode) {
                effect$.observe({});
            } else {
                observables.push(Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('attributechanged', effect$, Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(domNode), domNode));
            }
        };

        for (var i = 0; i < SET_ATTRIBUTE.length; i += 3) {
            _loop(i);
        }
    }

    // Remove attributes.
    if (REMOVE_ATTRIBUTE.length) {
        var _loop2 = function _loop2(i) {
            var vTree = REMOVE_ATTRIBUTE[i];
            var name = REMOVE_ATTRIBUTE[i + 1];
            var domNode = NodeCache.get(vTree);

            var effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                removeAttribute(domNode, name);
                emitter.end();
            });

            observables.push(Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('attributechanged', effect$, Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(domNode), domNode));
        };

        for (var i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
            _loop2(i);
        }
    }

    // First do all DOM tree operations, and then do attribute and node value.
    for (var i = 0; i < TREE_OPS.length; i++) {
        var _TREE_OPS$i = TREE_OPS[i],
            INSERT_BEFORE = _TREE_OPS$i.INSERT_BEFORE,
            REMOVE_CHILD = _TREE_OPS$i.REMOVE_CHILD,
            REPLACE_CHILD = _TREE_OPS$i.REPLACE_CHILD;

        // Insert/append elements.

        if (INSERT_BEFORE && INSERT_BEFORE.length) {
            var _loop3 = function _loop3(_i2) {
                var vTree = INSERT_BEFORE[_i2];
                var newTree = INSERT_BEFORE[_i2 + 1];
                var referenceTree = INSERT_BEFORE[_i2 + 2];
                var domNode = NodeCache.get(vTree);
                var referenceNode = referenceTree && createNode(referenceTree);

                if (referenceTree) {
                    protectVTree(referenceTree);
                }

                var newNode = createNode(newTree);
                protectVTree(newTree);

                var attach$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    // If refNode is `null` then it will simply append like `appendChild`.
                    domNode.insertBefore(newNode, referenceNode);

                    emitter.end();
                });

                observables.push(Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('attached', attach$, Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(domNode), newNode, domNode));
            };

            for (var _i2 = 0; _i2 < INSERT_BEFORE.length; _i2 += 3) {
                _loop3(_i2);
            }
        }

        // Remove elements.
        if (REMOVE_CHILD && REMOVE_CHILD.length) {
            var _loop4 = function _loop4(_i3) {
                var vTree = REMOVE_CHILD[_i3];
                var domNode = NodeCache.get(vTree);
                var detach$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    domNode.parentNode.removeChild(domNode);
                    unprotectVTree(vTree);
                    emitter.end();
                });
                var effect$ = Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('detached', detach$, Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(domNode), domNode, domNode.parentNode);

                observables.push(effect$);
            };

            for (var _i3 = 0; _i3 < REMOVE_CHILD.length; _i3++) {
                _loop4(_i3);
            }
        }

        // Replace elements.
        if (REPLACE_CHILD && REPLACE_CHILD.length) {
            var _loop5 = function _loop5(_i4) {
                var newTree = REPLACE_CHILD[_i4];
                var oldTree = REPLACE_CHILD[_i4 + 1];
                var oldDomNode = NodeCache.get(oldTree);
                var newDomNode = createNode(newTree);

                var attach$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
                    protectVTree(newTree);

                    emitter.end();
                });

                var detach$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                    oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
                    unprotectVTree(oldTree);

                    emitter.end();
                });

                var container = Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(oldDomNode);

                if (container === oldDomNode) {
                    container = Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(oldDomNode.parentNode);
                }

                observables.push(Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('replaced', __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].merge([Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('attached', attach$, container, newDomNode, oldDomNode.parentNode), Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('detached', detach$, container, oldDomNode, oldDomNode.parentNode)]), container, oldDomNode, oldDomNode.parentNode, newDomNode));
            };

            for (var _i4 = 0; _i4 < REPLACE_CHILD.length; _i4 += 2) {
                _loop5(_i4);
            }
        }
    }

    // Change all nodeValues.
    if (NODE_VALUE.length) {
        var _loop6 = function _loop6(_i5) {
            var vTree = NODE_VALUE[_i5];
            var nodeValue = NODE_VALUE[_i5 + 1];
            var domNode = createNode(vTree);
            var containerNode = Object(__WEBPACK_IMPORTED_MODULE_2__children_util__["c" /* getContainerNode */])(domNode);

            var effect$ = __WEBPACK_IMPORTED_MODULE_0__kefir__["a" /* default */].stream(function (emitter) {
                var parentNode = domNode.parentNode;


                if (nodeValue.includes('&')) {
                    domNode.nodeValue = decodeEntities(nodeValue);
                } else {
                    domNode.nodeValue = nodeValue;
                }

                if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
                    parentNode.nodeValue = escape(decodeEntities(nodeValue));
                }

                emitter.end();
            });

            observables.push(Object(__WEBPACK_IMPORTED_MODULE_3__animations__["b" /* wrapEffect */])('textchanged', effect$, containerNode, domNode));
        };

        for (var _i5 = 0; _i5 < NODE_VALUE.length; _i5 += 3) {
            _loop6(_i5);
        }
    }

    return observables;
}

/***/ })
/******/ ]);
});