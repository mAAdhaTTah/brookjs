import { runner } from 'hygen';
import { Maybe } from '../../cli';

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

export type ConfiguringState = {
  logs: Log[];
  result: null;
  error: null;
  cwd: string;
  configuring: Configurable;
  config: {
    name: Maybe<string>;
    version: Maybe<string>;
    description: Maybe<string>;
    dir: Maybe<string>;
    license: Maybe<string>;
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
  config: {
    name: string;
    version: string;
    description: string;
    dir: string;
    license: string;
  };
  step: 'error';
};

export type CompleteState = {
  logs: Log[];
  result: RunnerResult;
  error: null;
  cwd: string;
  configuring: null;
  config: {
    name: string;
    version: string;
    description: string;
    dir: string;
    license: string;
  };
  step: 'complete';
};

export type InteractingState = {
  logs: Log[];
  result: null;
  error: null;
  cwd: string;
  configuring: null;
  config: {
    name: string;
    version: string;
    description: string;
    dir: string;
    license: string;
  };
  step: ConfiguredStep;
};

export type ConfiguredState = ErrorState | CompleteState | InteractingState;

export type State = ConfiguringState | ConfiguredState;

export type Step = State['step'];

export type Configurable = Exclude<keyof State['config'], 'name'>;

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
};

export const unreachable = (x: never): never => {
  throw new Error('unreachable value found ' + x);
};
