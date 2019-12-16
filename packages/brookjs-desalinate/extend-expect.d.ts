import 'jest-kefir/extend-expect';

declare namespace jest {
  interface Matchers<R, T> {
    toEmitFromDelta<V, E>(
      expect: import('kefir-test-utils').EventWithTime<V, E>[],
      cb?: (
        send: (state: any, action: any) => void,
        tick: (s: number) => void,
        clock: import('lolex').Clock
      ) => void,
      opts?: { timeLimit?: number }
    ): R;
    toEmitFromJunction<V, E>(
      expect: import('kefir-test-utils').EventWithTime<V, E>[],
      cb?: (
        api: import('@testing-library/react').RenderResult,
        tick: (s: number) => void,
        clock: import('lolex').Clock
      ) => void,
      opts?: { timeLimit?: number }
    ): R;
  }
}
