import Kefir, { Stream } from 'kefir';

/**
 * Emitted on requestAnimationFrame callbacks.
 */
export const RAF = 'RAF';

/**
 * Create a new raf action.
 *
 * Not exported because only raf$ produces them.
 */
export const rafAction = Object.assign(
  (time: number) => ({
    type: RAF as typeof RAF,
    payload: { time }
  }),
  {
    getType: () => RAF as typeof RAF,
    toString: () => RAF as typeof RAF
  }
);

/**
 * The type emitted by the raf$ stream.
 */
export type RAFAction = ReturnType<typeof rafAction>;

/**
 * Stream of requestAnimationFrame events.
 */
export const raf$: Stream<RAFAction, void> = Kefir.stream(emitter => {
  let loop: number;
  let enabled = true;

  (function schedule() {
    loop = requestAnimationFrame(time => {
      (emitter as any).value(rafAction(time));

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
