import Kefir from '../kefir';

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

/**
 * Stream of requestAnimationFrame events.
 *
 * Used to schedule renders.
 *
 * @type {Kefir.Stream<T, S>}
 */
export const raf$ = Kefir.stream(emitter => {
    let loop;
    let enabled = true;

    (function schedule() {
        loop = requestAnimationFrame(time => {
            emitter.value(rafAction(time));

            if (enabled) {
                schedule();
            }
        });
    })();

    return () => {
        cancelAnimationFrame(loop);
        enabled = false;
    };
});
