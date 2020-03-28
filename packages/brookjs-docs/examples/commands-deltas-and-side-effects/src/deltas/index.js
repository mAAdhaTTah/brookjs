import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { ajax$ } from 'kefir-ajax';
import { saveTodoRequest, saveTodoSucceeded, saveTodoFailed } from '../actions';

export const rootDelta = (state$, action$) => {
  const save$ = action$.thru(ofType(saveTodoRequest)).flatMap(action =>
    ajax$(`/api/todos`, {
      method: 'POST',
      body: JSON.stringify(action.payload.todo)
    })
      .flatMap(res => res.json())
      .map(todo => saveTodoSucceeded(todo))
      .flatMapErrors(err => Kefir.constant(saveTodoFailed(err)))
  );

  return Kefir.merge([save$]);
};
