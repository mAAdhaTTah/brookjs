import Kefir, { Stream } from 'kefir';
import { Delta } from 'brookjs-types';
import { ofType } from 'brookjs-flow';
import * as webpack from '../../webpack';
import * as project from '../../project';
import { State, Action } from './types';

const exec: Delta<Action, State> = (action$, state$): Stream<Action, never> => {
  const project$ = project.delta(
    action$.thru(ofType(project.actions.extension.request)),
    state$,
  );

  const webpack$ = webpack.delta(
    action$.thru(ofType(webpack.actions.build.request)),
    state$.map(state => ({
      cwd: state.cwd,
      cmd: 'build',
      env: state.env,
      extension: state.extension ?? 'js',
      watch: state.watch,
      rc: state.rc,
    })),
  );

  return Kefir.merge<Action, never>([project$, webpack$]);
};

export default exec;
