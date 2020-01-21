import Kefir, { Stream } from 'kefir';
import * as webpack from '../../webpack';
import { State, Action } from './types';
import { Delta } from 'brookjs-types';

const exec: Delta<Action, State> = (action$, state$): Stream<Action, never> => {
  const webpack$ = webpack.delta(
    action$,
    state$.map(state => ({
      cwd: state.cwd,
      cmd: 'build',
      env: state.env,
      watch: state.watch,
      rc: state.rc
    }))
  );

  return Kefir.merge([webpack$]);
};

export default exec;
