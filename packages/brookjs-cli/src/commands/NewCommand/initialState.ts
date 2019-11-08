import { Arguments } from 'yargs';
import { ConfiguredState, ConfiguringState, State } from './types';
import { defaultSteps } from './constants';

const base = {
  logs: [],
  result: null,
  error: null
};

const creating = (argv: Arguments, cwd: string): ConfiguredState => ({
  ...base,
  cwd,
  config: {
    ...defaultSteps,
    name: argv.name as string
  },
  step: 'creating',
  configuring: null
});

const configure = (argv: Arguments, cwd: string): ConfiguringState => ({
  ...base,
  cwd,
  config: {
    name: typeof argv.name === 'string' ? argv.name : null,
    version: null,
    description: null,
    dir: null,
    license: null
  },
  step: 'configure',
  configuring: 'version'
});

const initialState = (argv: Arguments, { cwd }: { cwd: string }): State =>
  argv.yes ? creating(argv, cwd) : configure(argv, cwd);

export default initialState;
