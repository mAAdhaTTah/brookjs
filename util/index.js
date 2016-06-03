import { curry } from 'ramda';

/**
 * Create a new event with the custom type string.
 *
 * This is used for cross-browser consistency, since the IEs
 * still require us to use the deprecated factory functions.
 *
 * @param {string} type - Event type.
 * @returns {Event} Custom dispatchable event.
 */
export function createEvent(type) {
    var event;

    try {
        event = new Event(type, { bubbles: true });
    } catch (e) {
        event = document.createEvent('Event');
        event.initEvent(type, true, false);
    }

    return event;
}

/**
 * Maps actions objects of the source type to the destination type.
 *
 * @param {string} source - Action type to change.
 * @param {string} dest - Action type to become.
 * @param {Object} action - Action object to change.
 * @param {string} action.type - Action type.
 * @param {Object} action.payload - Action payload.
 * @returns {Object} Updated Action object.
 */
export const mapActionTo = curry(function mapActionTo(source, dest, { type, payload }) {
    if (type === source) {
        type = dest;
    }

    return { type, payload };
});
