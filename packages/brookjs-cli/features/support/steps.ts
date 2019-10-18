import * as path from 'path';
import * as fs from 'fs-extra';
import {
  BeforeAll,
  Before,
  Given,
  When,
  Then,
  After,
  TableDefinition
} from 'cucumber';
import { expect, use } from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import chaiFs from 'chai-fs';
import chaiString from 'chai-string';
import { Question } from './world';

use(chaiString);
use(chaiFs);

use(chaiJestSnapshot);

BeforeAll(function() {
  chaiJestSnapshot.resetSnapshotRegistry();
});

After(function() {
  if (this.spawned && !this.output.closed) {
    this.spawned.kill();
  }
});

Before(function(testCase) {
  const { name } = testCase.pickle;

  this.snapshot.testname = name;
  this.snapshot.filename = `features/__snaps__/${name
    .toLowerCase()
    .replace(/\s/g, '-')}.snap`;
});

/**
 * Given I Have
 */
Given('I have project with {string}', async function(type: string) {
  await this.createProjectWith([
    {
      path: `src/${type}/index.js`,
      contents: ''
    }
  ]);
});

Given('I have a file called {string} exported from {string}', async function(
  file: string,
  barrel: string
) {
  await Promise.all([
    this.outputFile({ path: path.join('src', barrel, file), contents: '' }),
    this.appendFile({
      path: path.join('src', barrel, 'index.js'),
      contents: `export * from './${file}';`
    })
  ]);
});

Given('I have a project', { timeout: -1 }, async function() {
  await this.createProject();
});

Given('I import an unknown file', async function() {
  await this.appendFile({
    path: path.join('src', 'app.js'),
    contents: "import './file-does-not-exist';\n"
  });
});

/**
 * When I Do
 */
When('I run beaver with {string}', function(command: string) {
  this.run(command);
});

When('I respond to the prompts with:', async function(
  questions: TableDefinition
) {
  await this.respondTo(questions.hashes() as Question[]);
});

When(
  'I wait for the command to finish with code {int}',
  { timeout: -1 },
  async function(code) {
    await this.ended();

    expect(this.output.code).to.equal(
      code,
      `Error: exited with code ${this.output.code}
Message: ${this.output.stderr || this.output.stdout}`
    );
  }
);

/**
 * Then I see
 */
Then('I see a project dir called {string} with file snapshots:', async function(
  project: string,
  files: TableDefinition
) {
  const expected = files.raw().map(([_]) => _);
  const target = path.join(this.cwd, project);
  expect(target)
    .to.be.a.directory()
    .with.deep.contents.that.include.members(expected);

  for (const filename of expected) {
    const contents = fs.readFileSync(path.join(target, filename)).toString();
    expect(contents).to.matchSnapshot(
      this.snapshot.filename,
      `${this.snapshot.testname}-${filename}`
    );
  }
});

Then('I see a file called {string}', function(filename: string) {
  const file = path.join(this.cwd, filename);
  expect(file).to.be.a.file(this.output.stdout);
});

Then('I expect the output to match the snapshot', async function() {
  expect(this.output.stdout).to.matchSnapshot(
    this.snapshot.filename,
    `${this.snapshot.testname}-output`
  );
});
