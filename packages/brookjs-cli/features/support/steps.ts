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
        },
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

Given('I have a passing test', async function() {
  await this.outputFile({
    path: path.join('src', '__tests__', 'App.spec.js'),
    contents: `describe('passing test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});`
  });
});

Given('I have a failing test', async function() {
  await this.outputFile({
    path: path.join('src', '__tests__', 'App.spec.js'),
    contents: `describe('failing test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(3);
  });
});`
  });
});

Given('I add a {string} command with body', async function(
  ext: string,
  contents: string
) {
  if (!['ts', 'tsx', 'js'].includes(ext)) {
    throw new Error(`ext should be ts or js, got ${ext}`);
  }

  await this.outputFile({
    path: path.join('src', '..', 'commands', `index.${ext}`),
    contents
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

    expect(this.output.code).toBe(
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

Then('I see passing test results', function() {
  expect(this.output.stdout).toMatch(/1 passed/);
});

Then('I see failing test results', function() {
  expect(this.output.stdout).toMatch(/1 failed/);
});

Then('I see this in stdout', function(output: string) {
  expect(this.output.stdout).toMatch(output);
});
