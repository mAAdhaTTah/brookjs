import { Delta } from 'brookjs-types';
import Kefir from 'kefir';
import { ofType } from 'brookjs-flow';
import * as glob from '../../../glob';
import * as eslint from '../../../eslint';
import { Action, State } from './types';

export const exec: Delta<Action, State> = (action$, state$) => {
  const glob$ = glob.delta(
    action$.thru(ofType(glob.actions.lint.request)),
    state$
  );

  const eslint$ = eslint.delta(
    action$.thru(ofType(eslint.actions.project.request)),
    state$.map(state => ({
      cwd: state.cwd,
      paths: state.files.map(file => file.path)
    }))
  );

  return Kefir.merge<Action, never>([glob$, eslint$]);
};
