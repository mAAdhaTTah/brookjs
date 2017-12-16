import { Kefir } from 'brookjs';
import webpack from 'webpack';

export default class WebpackService {
    static create(config) {
        try {
            return Kefir.constant(new WebpackService(config));
        } catch (e) {
            return Kefir.constantError(e);
        }
    }

    constructor(config) {
        this.compiler = webpack(config);
    }

    run() {
        return Kefir.fromNodeCallback(callback =>
            this.compiler.run(callback)
        );
    }
};
