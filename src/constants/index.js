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
    blur: prefix('onblur'),
    click: prefix('onclick'),
    change: prefix('onchange'),
    contextmenu: prefix('oncontextmenu'),
    cut: prefix('oncut'),
    dblclick: prefix('ondblclick'),
    focus: prefix('onfocus'),
    focusin: prefix('onfocusin'),
    focusout: prefix('onfocusout'),
    input: prefix('oninput'),
    keydown: prefix('onkeydown'),
    keypress: prefix('onkeypress'),
    keyup: prefix('onkeyup'),
    load: prefix('onload'),
    mousedown: prefix('onmousedown'),
    mouseup: prefix('mouseup'),
    resize: prefix('resize'),
    paste: prefix('onpaste'),
    select: prefix('onselect'),
    submit: prefix('onsubmit'),
    touchcancel: prefix('ontouchcancel'),
    touchend: prefix('ontouchend'),
    touchstart: prefix('ontouchstart')
};
