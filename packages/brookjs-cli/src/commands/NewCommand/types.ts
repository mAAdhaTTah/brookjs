import { Nullable } from 'typescript-nullable';

export type ConfiguringState = {
  configuring: Configurable;
  config: {
    name: Nullable<string>;
    version: Nullable<string>;
    description: Nullable<string>;
    dir: Nullable<string>;
    license: Nullable<string>;
  };
  step: 'configure';
};

export type ConfiguredStep = 'confirm' | 'creating' | 'cancelled' | 'complete';

export type ConfiguredState = {
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

export type State = ConfiguringState | ConfiguredState;

export type Step = State['step'];

export type Configurable = Exclude<keyof State['config'], 'name'>;

export type Action =
  | { type: 'INPUT'; payload: { value: string } }
  | { type: 'SUBMIT' }
  | { type: 'CONFIRM'; payload: { value: boolean } };

export type Args = {
  name: string;
};

export const unreachable = (x: never): never => {
  throw new Error('unreachable value found ' + x);
};
