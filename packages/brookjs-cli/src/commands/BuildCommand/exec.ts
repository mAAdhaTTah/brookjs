import Kefir, { Stream, Property } from 'kefir';
import { Nullable } from 'typescript-nullable';
import { webpackBuild } from './actions';
import { selectWebpackConfig } from './selectors';
import { State, Action } from './types';

const exec = ({ WebpackService }: typeof import('../../services')) => (
  action$: Stream<Action, never>,
  state$: Property<State, never>
): Stream<Action, never> =>
  state$
    .take(1)
    .filter(state => Nullable.isSome(state.rc))
    .flatMap(state =>
      Kefir.concat<Action, never>([
        Kefir.constant(webpackBuild.request()),
        WebpackService.create(selectWebpackConfig(state))
          .flatMap(compiler => compiler.run())
          .map(webpackBuild.success)
          .flatMapErrors(error => Kefir.constant(webpackBuild.failure(error)))
      ])
    );

export default exec;
