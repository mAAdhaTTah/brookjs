import path from 'path';
import { App } from '../App';
import Commands from '../Commands';

const baseApp = App.create('test');

describe('App', () => {
  describe('loadCommandsFrom', () => {
    const loadedApp = App.create(
      'test',
      new Commands([
        {
          builder: expect.any(Function),
          cmd: 'valid',
          describe: 'A valid command!',
          View: expect.any(Function),
        },
      ]),
    );

    const getFixturePath = (fixture: string) =>
      path.join(__dirname, '__fixtures__', fixture);

    const appFromFixture = (fixture: string) =>
      baseApp.loadCommandsFrom(getFixturePath(fixture));

    const loadCommandsFromTests = [
      ['should load commands from a file', 'commands-file'],
      ['should load commands from a folder', 'commands-folder'],
      [
        'should load commands from a folder with relative import',
        'commands-folder-with-relative',
      ],
    ];

    loadCommandsFromTests.forEach(([testName, testFixture]) => {
      it(testName, () => {
        expect(appFromFixture(testFixture)).toMatchObject(loadedApp);
      });
    });
  });
});
