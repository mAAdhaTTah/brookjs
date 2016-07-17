import { EVENT_ATTRIBUTES } from '../events';

/**
 * Generates HTML event attribute for an element.
 *
 * @param {string} event - Event name.
 * @param {string} callback - Callback key.
 * @returns {string} Event attribute.
 */
export default function event(event, callback) {
    const attr = EVENT_ATTRIBUTES[event];

    if (!attr) {
        return `data-brk-unknown="${event}"`;
    }

    return `${attr}="${callback}"`;
};
