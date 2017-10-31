import path from 'path';
import R from 'ramda';
import { lAppDir, lCommandName, lCommandArgs, lCommandOpts, lEnvCwd } from '../lenses';

export const isTestCommand = R.pipe(R.view(lCommandName), R.equals('test'));

export const getTestType = R.view(R.compose(lCommandArgs, R.lensProp('type')));

const getEnv = state =>
    R.view(lCommandOpts, state).env ? `cross-env NODE_ENV=${R.view(lCommandOpts, state).env}` : '';

const getTestReporter = state => `--reporter ${state.mocha.reporter}`;

const getTestUi = state => `--ui ${state.mocha.ui}`;

const getTestRequires = state =>
    state.mocha.requires.map(req => `--require ${req}`).join(' ');

const getTestFilesGlob = state =>
    path.join(R.view(lEnvCwd, state), R.view(lAppDir, state), '**/__tests__/*.spec.js');

const getCoverage = state =>
    R.view(lCommandOpts, state).coverage === true ? 'nyc --reporter=html --reporter=text' : '';

export const getMochaCommand = state =>
    `${getEnv(state)} ${getCoverage(state)} mocha ${getTestReporter(state)} ${getTestUi(state)} ${getTestRequires(state)} --colors ${getTestFilesGlob(state)}`;
