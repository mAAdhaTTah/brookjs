import Kefir from 'kefir';
import { Delta } from 'brookjs-types';
import { ofType } from 'brookjs-flow';
import { build, start, invalidated, done } from './actions';
import { selectWebpackConfig } from './selectors';
import { State, Action } from './types';
import { WebpackService } from './WebpackService';

export const delta: Delta<Action, State> = action$ => {
  const build$ = action$.thru(ofType(build.request)).flatMap(action =>
    WebpackService.create(selectWebpackConfig(action.payload))
      .flatMap(compiler => {
        process.env.NODE_ENV = action.payload.env;
        return action.payload.watch ? compiler.watch() : compiler.run();
      })
      .map(build.success)
      .flatMapErrors(error => Kefir.constant(build.failure(error))),
  );

  const start$ = action$.thru(ofType(start.request)).flatMap(action =>
    WebpackService.create(selectWebpackConfig(action.payload))
      .flatMap(compiler => compiler.server(action.payload))
      .flatMap(server => {
        process.env.NODE_ENV = 'development';
        return Kefir.merge<Action, Error>([
          server.listen(3000, 'localhost').map(start.success),
          server.onInvalidate().map(invalidated),
          server.onDone().map(done),
        ]);
      })
      .takeErrors(1)
      .flatMapErrors(error => Kefir.constant(start.failure(error))),
  );

  return Kefir.merge<Action, never>([build$, start$]);
};
