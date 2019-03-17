import { Arguments, Argv } from 'yargs';
import Kefir, { Property, Stream } from 'kefir';
import { Command } from '../../cli';
import View from './View';
import {
  Step,
  State,
  Action,
  Args,
  unreachable,
  ConfiguringState,
  ConfiguredState
} from './types';
import { defaultSteps } from './constants';
import { Nullable } from 'typescript-nullable';

const applyDefaults = (
  config: ConfiguringState['config']
): ConfiguredState['config'] =>
  (Object.keys(config) as (keyof typeof config)[]).reduce<
    ConfiguredState['config']
  >(
    (acc, key) => ({
      ...acc,
      [key]: Nullable.withDefault(acc[key], config[key])
    }),
    defaultSteps
  );

export default class NewCommand extends Command<State, Action, Args> {
  builder(yargs: Argv): Argv {
    return yargs;
  }

  cmd = 'new <name>';

  describe = 'Create a new brookjs application';

  initialState = (argv: Arguments): ConfiguringState => ({
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

  exec = (action$: Stream<Action, never>, state$: Property<State, never>) =>
    Kefir.never();

  reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'INPUT':
        // Only handle input on configure step.
        if (state.step !== 'configure') {
          return state;
        }
        return {
          ...state,
          config: {
            ...state.config,
            [state.configuring]: action.payload.value
          }
        };
      case 'SUBMIT':
        switch (state.step) {
          case 'configure':
            switch (state.configuring) {
              case 'version':
                return {
                  ...state,
                  configuring: 'description'
                };
              case 'description':
                return {
                  ...state,
                  configuring: 'dir'
                };
              case 'dir':
                return {
                  ...state,
                  configuring: 'license'
                };
              case 'license':
                return {
                  ...state,
                  step: 'confirm',
                  configuring: null,
                  config: applyDefaults(state.config)
                };
              default:
                return unreachable(state.configuring);
            }
          case 'confirm':
          case 'creating':
          case 'complete':
          case 'cancelled':
            // SUBMIT is only relevant to the configure step.
            // This code won't ever actually run.
            return state;
          default:
            return unreachable(state);
        }
      case 'CONFIRM':
        // CONFIRM should only be emitted from confirm step.
        if (state.step !== 'confirm') {
          return state;
        }

        if (action.payload.value) {
          return {
            ...state,
            step: 'creating'
          };
        } else {
          return {
            ...state,
            step: 'cancelled'
          };
        }
      default:
        return state;
    }
  };

  // @TODO(mAAdhaTTah) This needs to actually work.
  View = View as any;
}
