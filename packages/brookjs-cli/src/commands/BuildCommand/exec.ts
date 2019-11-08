import Kefir, { Stream, Property } from 'kefir';
import { WebpackService } from '../../services';
import { webpackBuild } from './actions';
import { selectWebpackConfig } from './selectors';
import { State, Action } from './types';

const exec = (
  action$: Stream<Action, never>,
  state$: Property<State, never>
): Stream<Action, never> =>
  state$
    .take(1)
    .filter(state => state.rc != null)
    .flatMap(state =>
      Kefir.concat<Action, never>([
        Kefir.constant(webpackBuild.request()),
        WebpackService.create(selectWebpackConfig(state))
          .flatMap(compiler =>
            state.watch ? compiler.watch() : compiler.run()
          )
          .map(webpackBuild.success)
          .flatMapErrors(error => Kefir.constant(webpackBuild.failure(error)))
      ])
    );

export default exec;
