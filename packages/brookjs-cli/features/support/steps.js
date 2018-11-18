const path = require('path');
const fs = require('fs-extra');
const { BeforeAll, Before, Given, When, Then } = require('cucumber');
const { expect, use } = require('chai');
const chaiJestSnapshot = require('chai-jest-snapshot');

use(require('chai-string'));
use(require('chai-fs'));

use(chaiJestSnapshot);

BeforeAll(function () {
    chaiJestSnapshot.resetSnapshotRegistry();
});

Before(function (testCase) {
    const { name } = testCase.pickle;

    this.snapshot.testname = name;
    this.snapshot.filename =  `features/__snaps__/${
        name.toLowerCase().replace(/\s/g, '-')
    }.snap`;
});

/**
 * Given I Have
 */
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

Given('I have a project', { timeout: -1 }, async function () {
    await this.createProject();
});

/**
 * When I Do
 */
When('I run beaver with {string}', function(command) {
    this.run(command);
});

When('I respond to the prompts with:', { timeout: -1 }, async function (questions) {
    await this.respondTo(questions.hashes());
});

When('I wait for the command to finish with code {int}', { timeout: -1 }, async function(code) {
    await this.ended();

    expect(this.output.code).to.equal(code, `Error: exited with code ${this.output.code}
Message: ${this.output.stderr || this.output.stdout}`);
});

/**
 * Then I see
 */
Then('I see a project dir called {string} with file snapshots:', async function(project, files) {
    const expected = files.raw().map(([_]) => _);
    const target = path.join(this.cwd, project);
    expect(target).to.be.a.directory()
        .with.deep.contents.that.include.members(expected);

    for (const filename of expected) {
        const contents = fs.readFileSync(path.join(target, filename)).toString();
        expect(contents).to.matchSnapshot(
            this.snapshot.filename,
            `${this.snapshot.testname}-${filename}`
        );
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

Then('I see {string} with a file size between {int} and {int} bytes', function (bundle, lower, upper) {
    const file = path.join(this.cwd, bundle);
    expect(file).to.be.a.file(this.output.stdout);

    expect(fs.statSync(file).size).to.be.above(lower).and.below(upper);
});
