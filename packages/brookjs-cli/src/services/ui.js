import { Kefir } from 'brookjs';
import inquirer from 'inquirer';
import chalk from 'chalk';

class UiService {
    constructor(logger) {
        this.logger = logger;
    }

    log(lvl, msg) {
        return Kefir.stream(emitter => {
            this.logger[lvl](msg);
            emitter.end();
        });
    }

    prompt(questions) {
        return Kefir.fromPromise(inquirer.prompt(questions));
    }

    info(msg) {
        return this.log('info', msg);
    }

    error(msg) {
        return this.log('error', msg);
    }

    success(msg) {
        return this.log('info', chalk.green(msg));
    }
}

export default logger => new UiService(logger);
