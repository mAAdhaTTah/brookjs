import prog from 'caporal';
import pkg from '../package.json';
import main from './main';

prog
    .version(pkg.version)
    .description(pkg.description)
    .help('@TODO');

prog
    .command('new', 'Create a new brookjs application.')
    .action(main('new'));

export default prog;
