import path from 'path';
import { State } from './types';
import { Nullable } from 'typescript-nullable';
import { errorToNull } from '../../cli';

const getEnv = (state: State) =>
  state.env ? `cross-env NODE_ENV=${state.env}` : '';

const getWatchCommand = (state: State) =>
  state.watch === true ? '--watch' : '';

const getTestReporter = (state: State) =>
  `--reporter ${Nullable.maybe(
    'spec',
    rc => Nullable.maybe('bdd', mocha => mocha.reporter || 'spec', rc.mocha),
    errorToNull(state.rc)
  )}`;

const getTestUi = (state: State) =>
  `--ui ${Nullable.maybe(
    'bdd',
    rc => Nullable.maybe('bdd', mocha => mocha.ui || 'bdd', rc.mocha),
    errorToNull(state.rc)
  )}`;

const getTestRequires = (state: State) =>
  // This seems bad / wrong but add some tests maybe?
  Nullable.maybe(
    '',
    rc =>
      Nullable.maybe(
        '',
        mocha =>
          Nullable.maybe(
            [],
            requires => requires.map(req => `--require ${req}`),
            mocha.requires
          ).join(' '),
        rc.mocha
      ),
    errorToNull(state.rc)
  );

const getTestFilesGlob = (state: State) =>
  path.join(
    state.cwd,
    Nullable.maybe('src', rc => rc.dir || state.cwd, errorToNull(state.rc)),
    '**/__tests__/*.{test,spec}.{js,ts,tsx}'
  );

const getCoverage = (state: State) =>
  state.coverage === true
    ? `nyc --reporter=text --reporter=lcov --extension .js --extension .ts --extension .tsx ${getTestRequires(
        state
      )}`
    : '';

export const getMochaCommand = (state: State) =>
  `${getEnv(state)} ${getCoverage(state)} mocha ${getWatchCommand(
    state
  )} ${getTestReporter(state)} ${getTestUi(state)} ${
    state.coverage !== true ? getTestRequires(state) : ''
  } --colors ${getTestFilesGlob(state)}`
    .replace(/\s\s/g, ' ')
    .trim();
