import * as path from 'path';
import * as fs from 'fs-extra';
import {
  Before,
  Given,
  When,
  Then,
  After,
  TableDefinition,
  BeforeAll
} from 'cucumber';
import expect from 'expect';
import { SnapshotState, toMatchSnapshot } from 'jest-snapshot';
import { Question } from './world';

const addEOL = (str: string) => str + '\n';

BeforeAll(function() {
  expect.extend({
    toMatchSnapshot(actual: string, filename: string, testname: string) {
      const snapshotState = new SnapshotState(filename, {
        updateSnapshot: process.env.SNAPSHOT_UPDATE ? 'all' : 'new'
      } as any);

      const result = toMatchSnapshot.call(
        {
          snapshotState,
          currentTestName: testname
        } as any,
        actual
      );

      snapshotState.save();

      return result;
    }
  });
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
Given('I have a project', { timeout: -1 }, async function() {
  await this.createProject();
});

Given('I create {string} with contents', async function(
  path: string,
  contents: string
) {
  await this.outputFile({ path, contents: addEOL(contents) });
});

Given('I append to {string} with contents', async function(
  path: string,
  contents: string
) {
  await this.appendFile({ path, contents: addEOL(contents) });
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

    try {
      expect(this.output.code).toBe(code);
    } catch(err) {
      err.message += `

Stdout:

${this.output.stdout}

cwd: ${this.cwd}`;
      throw err;
    }
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
  expect(fs.statSync(target).isDirectory()).toBe(true);

  for (const filename of expected) {
    expect(fs.statSync(path.join(target, filename)).isFile()).toBe(true);

    const contents = fs.readFileSync(path.join(target, filename)).toString();
    expect(contents).toMatchSnapshot(
      this.snapshot.filename,
      `${this.snapshot.testname}-${filename}`
    );
  }
});

Then('I see a file called {string}', function(filename: string) {
  const file = path.join(this.cwd, filename);
  expect(fs.statSync(file).isFile()).toBe(true);
});

Then('I see this in stdout', function(output: string) {
  expect(this.output.stdout).toMatch(output);
});
