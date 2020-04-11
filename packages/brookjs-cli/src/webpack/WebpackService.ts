import Kefir, { Property, Stream } from 'kefir';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { selectServerConfig } from './selectors';
import { State } from './types';
// @TODO(mAAdhaTTah) missing types
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');

export class WebpackServer {
  constructor(
    private compiler: webpack.Compiler,
    private server: WebpackDevServer,
  ) {}

  static create(
    state: State,
    compiler: webpack.Compiler,
  ): Stream<WebpackServer, Error> {
    try {
      const serverConfig = selectServerConfig(state);
      const devServer = new WebpackDevServer(compiler, serverConfig);
      const server = new WebpackServer(compiler, devServer);

      return Kefir.constant(server);
    } catch (err) {
      return Kefir.constantError(err);
    }
  }

  listen(port: number, host: string): Stream<{ success: true }, Error> {
    return Kefir.stream(emitter => {
      this.server.listen(port, host, err => {
        if (err) {
          emitter.error(err);
        } else {
          emitter.value({ success: true });
        }
      });

      return () => this.server.close();
    });
  }

  onInvalidate(): Stream<{ what: string; when: Date }, never> {
    return Kefir.stream(emitter => {
      let running = true;

      this.compiler.hooks.invalid.tap('invalid', (what, when) => {
        if (running) emitter.value({ what, when });
      });

      return () => {
        running = false;
      };
    });
  }

  onTypecheck(): Stream<{ diagnostics: any; lints: any }, never> {
    return Kefir.stream(emitter => {
      let running = true;

      ForkTsCheckerWebpackPlugin.getCompilerHooks(this.compiler).receive.tap(
        'afterTypeScriptCheck',
        (diagnostics: any, lints: any) => {
          if (running) emitter.value({ diagnostics, lints });
        },
      );

      return () => {
        running = false;
      };
    });
  }

  onDone(): Stream<webpack.Stats, never> {
    return Kefir.stream(emitter => {
      let running = true;

      this.compiler.hooks.done.tap('done', stats => {
        if (running) emitter.value(stats);
      });

      return () => {
        running = false;
      };
    });
  }
}

export class WebpackService {
  static create(config: webpack.Configuration) {
    return Kefir.constant(new WebpackService(config));
  }

  private constructor(private config: webpack.Configuration) {}

  private compiler(): Property<webpack.Compiler, Error> {
    try {
      return Kefir.constant(webpack(this.config));
    } catch (e) {
      return Kefir.constantError(e);
    }
  }

  server(state: State): Stream<WebpackServer, Error> {
    return this.compiler().flatMap(compiler =>
      WebpackServer.create(state, compiler),
    );
  }

  run(): Stream<webpack.Stats, Error> {
    return this.compiler().flatMap(compiler =>
      Kefir.fromNodeCallback(callback => compiler.run(callback)),
    );
  }

  watch(): Stream<webpack.Stats, Error> {
    return this.compiler().flatMap(compiler =>
      Kefir.stream(emitter => {
        compiler.watch({}, (err, stats) => {
          if (err) {
            emitter.error(err);
          } else {
            emitter.value(stats);
          }
        });
      }),
    );
  }
}
