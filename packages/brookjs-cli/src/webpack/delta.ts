import Kefir from 'kefir';
import { Delta } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import { build } from './actions';
import { selectWebpackConfig } from './selectors';
import { State, Action } from './types';
import { WebpackService } from './WebpackService';

export const delta: Delta<Action, State> = (action$, state$) => {
  const build$ = sampleStateAtAction(action$, state$, build.request).flatMap(
    state =>
      WebpackService.create(selectWebpackConfig(state))
        .flatMap(compiler => (state.watch ? compiler.watch() : compiler.run()))
        .map(build.success)
        .flatMapErrors(error => Kefir.constant(build.failure(error)))
  );

  return Kefir.merge([build$]);
};
