const path = require('path');
const { Given, When, Then } = require('cucumber');
const { expect, use } = require('chai');

use(require('chai-string'));
use(require('chai-fs'));

Given('I have project with {string}', async function (type) {
    await this.createProjectWith([
        {
            path: `src/${type}/index.js`,
            contents: ''
        }
    ]);
});

Given('I have a file called {string} exported from {string}', async function (file, barrel) {
    await Promise.all([
        this.outputFile({ path: path.join('src', barrel, file), contents: '' }),
        this.appendFile({ path: path.join('src', barrel, 'index.js'), contents: `export * from './${file}';` })
    ]);
});

When('I run beaver with {string}', function(command) {
    this.run(command);
});

When('I respond to the prompts with:', async function (questions) {
    await this.respondTo(questions.hashes());
});

When('I wait for the command to finish with code {int}', { timeout: -1 }, async function(code) {
    await this.ended();

    expect(this.output.code).to.equal(code);
});

Then('I have a project dir called {string} with:', async function(project, files) {
    expect(path.join(this.cwd, project)).to.be.a.directory();

    for await (const { filename, content } of this.filesToFixtures(files.hashes())) {
        expect(path.join(this.cwd, project, filename))
            .to.be.a.file(`${filename} is not a file`)
            .with.content(content, `${filename} did not match fixture'`);
    }
});

Then('I see an {string} added to barrel for {string}', async function (name, barrel) {
    expect(await this.getBarrel(barrel)).to.have.string(this.getInstanceForType(name, barrel));
});

Then('I see {string} exported from barrel for {string}', async function (name, barrel) {
    expect(await this.getBarrel(barrel)).to.have.string(this.getExportForType(name, barrel));
});

Then('I see {string} with {string} in {string}', async function (file, name, barrel) {
    expect(await this.getFile(file, barrel)).to.have.string(this.getInstanceForType(name, barrel));
});
