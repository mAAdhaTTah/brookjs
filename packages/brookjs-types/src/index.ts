import { Stream, Property, Observable } from 'kefir';

export interface Delta<A, S> {
  (action$: Stream<A, never>, state$: Property<S, never>): Observable<A, never>;
}

export type Maybe<T> = T | null | undefined;

export const unreachable = (x: never): never => {
  throw new Error('unreachable value found ' + x);
};
