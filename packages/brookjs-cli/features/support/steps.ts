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
import { Question } from './world';

use(require('chai-string'));
use(require('chai-fs'));

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

Given('I have a project', async function() {
  await this.createProject();
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

When('I wait for the command to finish with code {int}', async function(code) {
  await this.ended();

  expect(this.output.code).to.equal(
    code,
    `Error: exited with code ${this.output.code}
Message: ${this.output.stderr || this.output.stdout}`
  );
});

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

Then('I see {string} with a file size between {int} and {int} bytes', function(
  bundle: string,
  lower: number,
  upper: number
) {
  const file = path.join(this.cwd, bundle);
  expect(file).to.be.a.file(this.output.stdout);

  expect(fs.statSync(file).size)
    .to.be.above(lower)
    .and.below(upper);
});
