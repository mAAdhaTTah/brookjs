import path from 'path';
import R from 'ramda';
import { lAppDir, lCommandName, lCommandArgs, lCommandOpts, lEnvCwd } from '../lenses';

export const isTestCommand = R.pipe(R.view(lCommandName), R.equals('test'));

export const getCommandType = R.view(R.compose(lCommandArgs, R.lensProp('type')));

const getEnv = state =>
    R.view(lCommandOpts, state).env ? `cross-env NODE_ENV=${R.view(lCommandOpts, state).env}` : '';

const getWatchCommand = state =>
    state.command.name === 'dev' ? '--watch' : '';

const getTestReporter = state => `--reporter ${state.mocha.reporter}`;

const getTestUi = state => `--ui ${state.mocha.ui}`;

const getTestRequires = state =>
    state.mocha.requires.map(req => `--require ${req}`).join(' ');

const getTestFilesGlob = state =>
    path.join(R.view(lEnvCwd, state), R.view(lAppDir, state), '**/__tests__/*.spec.{js,ts,tsx}');

const getCoverage = state =>
    R.view(lCommandOpts, state).coverage === true ? `nyc --reporter=text --reporter=lcov ${getTestRequires(state)}` : '';

export const getMochaCommand = state =>
    `${getEnv(state)} ${getCoverage(state)} mocha ${getWatchCommand(state)} ${getTestReporter(state)} ${getTestUi(state)} ${R.view(lCommandOpts, state).coverage !== true ? getTestRequires(state) : ''} --colors ${getTestFilesGlob(state)}`
        .replace(/\s\s/g, ' ').trim();
