import Kefir, { Stream } from 'kefir';

/**
 * Emitted on requestAnimationFrame callbacks.
 */
export const RAF = 'RAF' as const;

/**
 * Create a new raf action.
 */
export const rafAction = Object.assign(
  (time: number) => ({
    type: RAF,
    payload: { time },
  }),
  {
    getType: () => RAF,
    toString: () => RAF,
  },
);

/**
 * The type emitted by the raf$ stream.
 */
export type RAFAction = ReturnType<typeof rafAction>;

/**
 * Stream of requestAnimationFrame events.
 */
export const raf$: Stream<RAFAction, never> = Kefir.stream(emitter => {
  let loop: number;
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
