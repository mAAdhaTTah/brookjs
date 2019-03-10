declare module 'chai-kefir' {
  import { Observable, Stream, Property, Event } from 'kefir';
  import { Clock } from 'lolex';

  interface Helpers {
    withFakeTime(cb: (tick: (x: number) => void, clock: Clock) => void): void;
    watchWithTime<V, E>(stream$: Observable<V, E>): Event<V, E>[];
    send<V, E>(
      stream$: Observable<V, E>,
      values: Event<V, E>[]
    ): Observable<V, E>;
    stream<V, E>(): Stream<V, E>;
    prop<V, E>(): Property<V, E>;
    value<V, E>(v: V): Event<V, E>;
    plugin(...args: any[]): void;
  }

  interface HelpersFactory {
    (Kefir: typeof import('kefir')): Helpers;
  }

  const createHelpers: HelpersFactory;

  export default createHelpers;
}
