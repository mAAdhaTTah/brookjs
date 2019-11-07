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
      .positional('type', {
        describe: 'Type of test to run. One of: unit.'
      })
      .option('coverage', {
        describe: 'Add coverage data to output.',
        default: false
      })
      .option('watch', {
        describe: 'Watch files & rerun the tests on changes.',
        default: false
      });
  }
  cmd = 'test <type>';

  describe = 'Run the application tests.';

  initialState = initialState;

  exec = exec;

  reducer = reducer;

  View = View;
}
