const path = require('path');
const { When, Then } = require('cucumber');
const { expect, use } = require('chai');

use(require('chai-string'));
use(require('chai-fs'));

const DOWN = '\x1B\x5B\x42';
// const UP = '\x1B\x5B\x41';
const ENTER = '\x0D';

When('I run beaver with {string}', function(command) {
    this.run(command);
});

When('I respond to the {string} prompts', { timeout: 20000 }, async function (command) {
    let questions;

    switch (command) {
        case 'new':
            questions = [
                {
                    text: 'What is the application name? ',
                    response: 'test-app' + ENTER
                },
                {
                    text: 'What is the application version? (0.0.0)',
                    response: '1.0.0' + ENTER
                },
                {
                    text: 'What is the application description? ()',
                    response: 'A test application.' + ENTER
                },
                {
                    text: 'Where will the application source live? (src)',
                    response: 'client' + ENTER
                },
                {
                    text: 'Choose a license. (Use arrow keys)',
                    response: DOWN + ENTER
                },
                {
                    text: 'Confirm your app configuration:',
                    response: 'y' + ENTER
                }
            ];
            break;
        default:
            throw new Error(`Invalid command to respond to: ${command}`);
    }

    await this.respondTo(questions);
});

Then('I have a new project', { timeout: 20000 }, async function() {
    const appPath = path.join(this.cwd, 'test-app');

    await this.ended();
    await this.removeNodeModules(appPath);

    expect(this.output.stdout.trim()).to.endWith('npm finished with code 0');
    expect(appPath).to.be.a.directory().with.deep.contents([
        '.beaverrc.js',
        'client',
        'client/actions',
        'client/actions/app.js',
        'client/actions/index.js',
        'client/app.js',
        'client/components',
        'client/components/index.js',
        'client/deltas',
        'client/deltas/index.js',
        'client/dom.js',
        'client/reducers',
        'client/reducers/index.js',
        'client/selectors',
        'client/selectors/index.js',
        'client/services',
        'client/services/index.js',
        'client/view.hbs',
        'package-lock.json',
        'package.json'
    ]);
});
