export type Step = 'version' | 'description' | 'complete';

export type State = {
  name: string;
  version: string;
  description: string;
  step: Step;
};

export type Action =
  | { type: 'INPUT'; payload: { value: string } }
  | { type: 'SUBMIT'; payload: { value: string } };

export type Args = {
  name: string;
};
