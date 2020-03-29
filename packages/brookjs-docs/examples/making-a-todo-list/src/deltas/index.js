import Kefir from 'kefir';
import { sampleStateAtAction } from 'brookjs';
import { init } from '../actions';

export const rootDelta = (action$, state$) => {
  const init$ = sampleStateAtAction(action$, state$, init).flatMap(() => {
    console.log('App initialized');

    return Kefir.never();
  });

  return Kefir.merge([init$]);
};