import { Maybe } from 'brookjs-types';

type RunnerResult = ReturnType<typeof import('hygen').runner> extends Promise<
  infer T
>
  ? T
  : never;

export type Level = 'notice' | 'warn' | 'error' | 'ok';

export type Log = {
  level: Level;
  msg: string;
};

export type NewProjectConfig = {
  name: string;
  version: string;
  description: string;
  dir: string;
  license: string;
  typescript: boolean;
};

export type ConfiguringState = {
  logs: Log[];
  result: null;
  error: null;
  cwd: string;
  configuring: Configurable;
  config: {
    [K in keyof NewProjectConfig]: Maybe<NewProjectConfig[K]>;
  };
  step: 'configure';
};

export type ConfiguredStep = 'confirm' | 'creating' | 'cancelled';

export type ErrorState = {
  logs: Log[];
  result: null;
  error: Error;
  cwd: string;
  configuring: null;
  config: NewProjectConfig;
  step: 'error';
};

export type CompleteState = {
  logs: Log[];
  result: RunnerResult;
  error: null;
  cwd: string;
  configuring: null;
  config: NewProjectConfig;
  step: 'complete';
};

export type InteractingState = {
  logs: Log[];
  result: null;
  error: null;
  cwd: string;
  configuring: null;
  config: NewProjectConfig;
  step: ConfiguredStep;
};

export type ConfiguredState = ErrorState | CompleteState | InteractingState;

export type State = ConfiguringState | ConfiguredState;

export type Step = State['step'];

export type Configurable = Exclude<
  keyof State['config'],
  'name' | 'typescript'
>;

export type LogAction = { type: 'LOG'; payload: Log };

export type Action =
  | { type: 'INPUT'; payload: { value: string } }
  | { type: 'SUBMIT' }
  | { type: 'CONFIRM'; payload: { value: boolean } }
  | LogAction
  | { type: 'CREATED'; payload: { result: RunnerResult } }
  | { type: 'FAILED'; error: true; payload: { error: Error } };

export type Args = {
  name: string;
  yes: boolean;
  typescript: boolean;
};

export const unreachable = (x: never): never => {
  throw new Error('unreachable value found ' + x);
};
