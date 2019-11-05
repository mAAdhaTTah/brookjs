import { Argv } from 'yargs';
import { Command } from '../../cli';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { State, Action, Args } from './types';

export default class TestCommand extends Command<
  State,
  Action,
  Args,
  typeof import('../../services')
> {
  builder(yargs: Argv): Argv {
    return yargs
      .option('coverage', {
        default: false
      })
      .option('watch', {
        default: false
      });
  }
  cmd = 'test';

  describe = 'Run the brookjs unit tests.';

  initialState = initialState;

  exec = exec;

  reducer = reducer;

  View = View;
}
