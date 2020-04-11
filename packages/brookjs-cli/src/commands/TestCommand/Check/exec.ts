import { Delta } from 'brookjs-types';
import { ofType } from 'brookjs-flow';
import Kefir from 'kefir';
import * as prettier from '../../../prettier';
import * as glob from '../../../glob';
import { State, Action } from './types';

export const exec: Delta<Action, State> = (action$, state$) => {
  const globLint$ = glob.delta(
    action$.thru(ofType(glob.actions.lint.request)),
    state$,
  );

  const check$ = prettier.delta(
    action$.thru(ofType(prettier.actions.project.request)),
    state$.map(state => ({
      paths: state.files.map(file => file.path),
    })),
  );

  return Kefir.merge<Action, never>([globLint$, check$]);
};
