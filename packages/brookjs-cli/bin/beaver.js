#!/usr/bin/env node
const program = require('caporal');
const pkg = require('../package.json');
const { main } = require('../src');

program
    .version(pkg.version)
    .description(pkg.description);

program
    .command('new', 'Create a new brookjs application.')
    .action(main('new'))
    .argument('<name>', 'Development style.')
    .option('-y, --yes', 'Answer "yes" to all the question, using the defaults.', program.BOOLEAN);

program
    .command('dev', 'Develop the brookjs application.')
    .action(main('dev'))
    .argument('<type>', 'Development style.', ['app', 'tdd'])
    .option('--env <env>', 'Value to set for the NODE_ENV for development run.');

program
    .command('test', 'Run the brookjs application tests.')
    .action(main('test'))
    .argument('<type>', 'Tests to run.', ['unit'])
    .option('--coverage', 'Enable test coverage.', program.BOOLEAN)
    .option('--env <env>', 'Value to set for the NODE_ENV for the test run.');

program
    .command('build', 'Build the brookjs application files.')
    .action(main('build'))
    .option('--env <env>', 'Build environment target.', ['development', 'production']);

program.parse(process.argv);
