require('babel-register');

const prog = require('caporal');
const pkg  = require('../package.json');
const main = require('./main').default;

prog
    .version(pkg.version)
    .description(pkg.description);

prog
    .command('new', 'Create a new brookjs application.')
    .action(main('new'));

prog
    .command('make', 'Create a new file of a given type for brookjs application.')
    .action(main('make'))
    .argument('<type>', 'Type to make.', ['delta']);

prog
    .command('dev', 'Develop the brookjs application.')
    .action(main('test'))
    .argument('<type>', 'Development style.', ['app', 'tdd']);

prog
    .command('test', 'Run the brookjs application tests.')
    .action(main('test'))
    .argument('<type>', 'Tests to run.', ['unit', 'e2e']);

prog
    .command('build', 'Build the brookjs application files.')
    .action(main('build'))
    .argument('<env>', 'Build environment target.', ['development', 'production']);

module.exports = prog;
