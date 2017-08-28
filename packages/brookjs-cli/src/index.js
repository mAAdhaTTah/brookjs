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

module.exports = prog;
