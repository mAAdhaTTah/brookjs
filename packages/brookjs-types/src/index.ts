import { Stream, Property, Observable } from 'kefir';

export interface Delta<A, S> {
  (action$: Stream<A, never>, state$: Property<S, never>): Observable<A, never>;
}
