import { Arguments } from 'yargs';
import { ConfiguredState, ConfiguringState, State, Args } from './types';
import { defaultSteps } from './constants';

const base = {
  logs: [],
  result: null,
  error: null,
};

const creating = (argv: Arguments<Args>, cwd: string): ConfiguredState => ({
  ...base,
  cwd,
  config: {
    ...defaultSteps,
    name: argv.name as string,
    typescript: argv.typescript,
  },
  step: 'creating',
  configuring: null,
});

const configure = (argv: Arguments<Args>, cwd: string): ConfiguringState => ({
  ...base,
  cwd,
  config: {
    name: typeof argv.name === 'string' ? argv.name : null,
    version: null,
    description: null,
    dir: null,
    license: null,
    typescript: argv.typescript,
  },
  step: 'configure',
  configuring: 'version',
});

const initialState = (argv: Arguments<Args>, { cwd }: { cwd: string }): State =>
  argv.yes ? creating(argv, cwd) : configure(argv, cwd);

export default initialState;
