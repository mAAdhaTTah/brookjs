#!/usr/bin/env node
const program = require('caporal');
const pkg = require('../package.json');
const { main } = require('../src');

program
    .version(pkg.version)
    .description(pkg.description);

program
    .command('new', 'Create a new brookjs application.')
    .action(main('new'));

program
    .command('make', 'Create a new file of a given type for brookjs application.')
    .action(main('make'))
    .argument('<type>', 'Type to make.', ['action', 'component', 'delta', 'reducer', 'selector', 'service'])
    .argument('<name>', 'Name of the file/type created.');

program
    .command('dev', 'Develop the brookjs application.')
    .action(main('dev'))
    .argument('<type>', 'Development style.', ['app', 'tdd']);

program
    .command('test', 'Run the brookjs application tests.')
    .action(main('test'))
    .argument('<type>', 'Tests to run.', ['unit'])
    .option('--coverage <enable>', 'Whether to generate test coverage (true/false).', program.BOOLEAN)
    .option('--env <node-env>', 'Value to set for the NODE_ENV for the test run.');

program
    .command('build', 'Build the brookjs application files.')
    .action(main('build'))
    .argument('<env>', 'Build environment target.', ['development', 'production']);

program.parse(process.argv);
