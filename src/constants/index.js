/**
 * HTML attribute container directive.
 *
 * @type {string}
 */
export const CONTAINER_ATTRIBUTE = 'data-brk-container';

/**
 * HTML attribute key directive.
 *
 * For tagging a component that appears multiple times.
 *
 * @type {string}
 */
export const KEY_ATTRIBUTE = 'data-brk-key';

/**
 * HTML attribute blackbox directive.
 *
 * For tagging a section of DOM to not update.
 *
 * @type {string}
 */
export const BLACKBOX_ATTRIBUTE = 'data-brk-blackbox';

/**
 * Supported event constants.
 *
 * @type {string}
 */
export const BLUR = 'blur';
export const CHANGE = 'change';
export const CLICK = 'click';
export const CONTEXTMENU = 'contextmenu';
export const CUT = 'cut';
export const DBLCLICK = 'dblclick';
export const FOCUS = 'focus';
export const FOCUSIN = 'focusin';
export const FOCUSOUT = 'focusout';
export const INPUT = 'input';
export const KEYDOWN = 'keydown';
export const KEYPRESS = 'keypress';
export const KEYUP = 'keyup';
export const LOAD = 'load';
export const MOUSEDOWN = 'mousedown';
export const MOUSEUP = 'mouseup';
export const PASTE = 'paste';
export const RESIZE = 'resize';
export const SELECT = 'select';
export const SUBMIT = 'submit';
export const TOUCHCANCEL = 'touchcancel';
export const TOUCHEND = 'touchend';
export const TOUCHSTART = 'touchstart';

export const SUPPORTED_EVENTS = [
    BLUR,
    CHANGE,
    CLICK,
    CONTEXTMENU,
    CUT,
    DBLCLICK,
    FOCUS,
    FOCUSIN,
    FOCUSOUT,
    INPUT,
    KEYDOWN,
    KEYPRESS,
    KEYUP,
    LOAD,
    MOUSEDOWN,
    MOUSEUP,
    PASTE,
    RESIZE,
    SELECT,
    SUBMIT,
    TOUCHCANCEL,
    TOUCHEND,
    TOUCHSTART
];

/**
 * Whether the event listener should be captured.
 *
 * @type {Object}
 */
export const CAPTURE = {
    [BLUR]: true,
    [CHANGE]: true,
    [CLICK]: false,
    [CONTEXTMENU]: false,
    [CUT]: false,
    [DBLCLICK]: false,
    [FOCUS]: true,
    [FOCUSIN]: true,
    [FOCUSOUT]: true,
    [INPUT]: true,
    [KEYDOWN]: false,
    [KEYPRESS]: false,
    [KEYUP]: false,
    [LOAD]: true,
    [MOUSEDOWN]: false,
    [MOUSEUP]: false,
    [PASTE]: false,
    [RESIZE]: true,
    [SELECT]: true,
    [SUBMIT]: true,
    [TOUCHCANCEL]: true,
    [TOUCHEND]: true,
    [TOUCHSTART]: true
};

/**
 * Event attribute prefixer.
 *
 * @param {string} name - Event name.
 * @returns {string} HTML attribute
 */
const prefix = name => `data-brk-${name}`;

/**
 * HTML attribute event directives.
 *
 * @type {Object}
 */
export const EVENT_ATTRIBUTES = {
    [BLUR]: prefix('onblur'),
    [CLICK]: prefix('onclick'),
    [CHANGE]: prefix('onchange'),
    [CONTEXTMENU]: prefix('oncontextmenu'),
    [CUT]: prefix('oncut'),
    [DBLCLICK]: prefix('ondblclick'),
    [FOCUS]: prefix('onfocus'),
    [FOCUSIN]: prefix('onfocusin'),
    [FOCUSOUT]: prefix('onfocusout'),
    [INPUT]: prefix('oninput'),
    [KEYDOWN]: prefix('onkeydown'),
    [KEYPRESS]: prefix('onkeypress'),
    [KEYUP]: prefix('onkeyup'),
    [LOAD]: prefix('onload'),
    [MOUSEDOWN]: prefix('onmousedown'),
    [MOUSEUP]: prefix('mouseup'),
    [RESIZE]: prefix('resize'),
    [PASTE]: prefix('onpaste'),
    [SELECT]: prefix('onselect'),
    [SUBMIT]: prefix('onsubmit'),
    [TOUCHCANCEL]: prefix('ontouchcancel'),
    [TOUCHEND]: prefix('ontouchend'),
    [TOUCHSTART]: prefix('ontouchstart')
};

export const $$internals = Symbol('@@brookjs/internals');
