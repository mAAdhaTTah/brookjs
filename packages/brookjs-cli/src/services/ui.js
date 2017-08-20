import { Kefir } from 'brookjs';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const log = msg => Kefir.stream(emitter => {
    process.stdout.write(msg);
    process.stdout.write('\n');
    emitter.end();
});

export const prompt = questions =>
    Kefir.fromPromise(inquirer.prompt(questions));

export const error = msg => log(chalk.red(msg));

export const success = msg => log(chalk.green(msg));
