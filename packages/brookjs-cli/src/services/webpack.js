import { Kefir } from 'brookjs';
import webpack from 'webpack';

export default class WebpackService {
    static get watch()  {
        return {};
    };

    static create(config) {
        return Kefir.constant(new WebpackService(config));
    }

    constructor(config) {
        this.config = config;
    }

    compiler() {
        try {
            return Kefir.constant(webpack(this.config));
        } catch (e) {
            return Kefir.constantError(e);
        }
    }

    run() {
        return this.compiler().flatMap(compiler => Kefir.fromNodeCallback(callback =>
            compiler.run(callback)
        ));
    }

    watch() {
        return this.compiler().flatMap(compiler => Kefir.stream(emitter => {
            compiler.watch(WebpackService.watch, (err, stats) => {
                if (err) {
                    emitter.error(err);
                } else {
                    emitter.value(stats);
                }
            });
        }));
    }
};
