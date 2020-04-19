import { Observable } from 'kefir';
import { ofType, ActionCreator } from './ofType';

export const sampleByAction = <A extends { type: string }>(
  action$: Observable<A, never>,
  action: ActionCreator<A> | string,
) => <S, E>(obs$: Observable<S, E>): Observable<S, E> =>
  obs$.sampledBy(action$.thru(ofType(action as string)));
