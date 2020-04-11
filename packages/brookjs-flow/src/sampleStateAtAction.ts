import { Observable } from 'kefir';
import { ofType, ActionCreator } from './ofType';

const sampleStateAtAction = <A extends { type: string }, S>(
  action$: Observable<A, never>,
  state$: Observable<S, never>,
  action: ActionCreator<A> | string,
) => state$.sampledBy(action$.thru(ofType(action as string)));

export default sampleStateAtAction;
