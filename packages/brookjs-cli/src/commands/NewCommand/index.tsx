import { Arguments, Argv } from 'yargs';
import Kefir, { Property, Stream } from 'kefir';
import { Command } from '../../cli';
import View from './View';
import { Step, State, Action, Args } from './types';
import { defaultSteps } from './constants';

const advance = (step: Step): Step => {
  switch (step) {
    case 'version':
      return 'description';
    case 'description':
      return 'complete';
  }

  throw new Error(step);
};

export default class NewCommand extends Command<State, Action, Args> {
  builder(yargs: Argv): Argv {
    return yargs;
  }

  cmd = 'new <name>';

  describe = 'Create a new brookjs application';

  initialState = (argv: Arguments): State => ({
    name: typeof argv.name === 'string' ? argv.name : '',
    version: '',
    description: '',
    step: 'version'
  });

  exec = (action$: Stream<Action, never>, state$: Property<State, never>) =>
    Kefir.never();

  reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'INPUT':
        return { ...state, [state.step]: action.payload.value };
      case 'SUBMIT':
        if (state.step === 'complete') {
          return state;
        }

        return {
          ...state,
          // Set the default value if nothing entered.
          [state.step]: state[state.step] || defaultSteps[state.step],
          step: advance(state.step)
        };
      default:
        return state;
    }
  };

  View = View;
}
