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
