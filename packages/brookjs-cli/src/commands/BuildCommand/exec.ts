import Kefir, { Stream } from 'kefir';
import { Delta } from 'brookjs-types';
import { ofType } from 'brookjs-flow';
import * as webpack from '../../webpack';
import * as project from '../../project';
import { State, Action } from './types';

const exec: Delta<Action, State> = (action$, state$): Stream<Action, never> => {
  const project$ = project.delta(
    action$.thru(ofType(project.actions.initialize.request)),
    state$.map(({ project }) => project),
  );

  const webpack$ = webpack.delta(
    action$.thru(ofType(webpack.actions.build.request)),
    state$.map(({ webpack }) => webpack),
  );

  return Kefir.merge<Action, never>([project$, webpack$]);
};

export default exec;
