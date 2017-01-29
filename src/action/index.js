/**
 * Emitted on requestAnimationFrame callbacks.
 *
 * @type {string}
 */
export const RAF = 'RAF';

/**
 * Create a new raf action.
 *
 * @param {number} time - rAF time.
 * @returns {Action} raf Action.
 */
export function rafAction(time) {
    return {
        type: RAF,
        payload: { time }
    };
}
