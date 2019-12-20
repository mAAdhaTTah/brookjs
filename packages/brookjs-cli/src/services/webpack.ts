import Kefir, { Property, Stream } from 'kefir';
import webpack from 'webpack';

export default class WebpackService {
  static get watch() {
    return {};
  }

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

  run(): Stream<webpack.Stats, Error> {
    return this.compiler().flatMap(compiler =>
      Kefir.fromNodeCallback(callback => compiler.run(callback))
    );
  }

  watch(): Stream<webpack.Stats, Error> {
    return this.compiler().flatMap(compiler =>
      Kefir.stream(emitter => {
        compiler.watch(WebpackService.watch, (err, stats) => {
          if (err) {
            emitter.error(err);
          } else {
            emitter.value(stats);
          }
        });
      })
    );
  }
}
