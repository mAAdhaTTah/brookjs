import Kefir from 'kefir';
import { Delta } from 'brookjs-types';
import { sampleStateAtAction } from 'brookjs-flow';
import { build, start, invalidated, done } from './actions';
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

  const start$ = sampleStateAtAction(action$, state$, start.request).flatMap(
    state =>
      WebpackService.create(selectWebpackConfig(state))
        .flatMap(compiler => compiler.server(state))
        .flatMap(server => {
          process.env.NODE_ENV = 'development';
          return Kefir.merge<Action, Error>([
            server.listen(3000, 'localhost').map(start.success),
            server.onInvalidate().map(invalidated),
            server.onDone().map(done)
          ]);
        })
        .takeErrors(1)
        .flatMapErrors(error => Kefir.constant(start.failure(error)))
  );

  return Kefir.merge<Action, never>([build$, start$]);
};
