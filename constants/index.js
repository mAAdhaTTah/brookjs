/**
 * HTML attribute container directive.
 *
 * @type {string}
 */
export const CONTAINER_ATTRIBUTE = 'data-brk-container';

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
    click: prefix('onclick'),
    focus: prefix('onfocus'),
    input: prefix('oninput')
};
