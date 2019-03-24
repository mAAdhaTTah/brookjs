import { Command } from '../../cli';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { State, Action, Args } from './types';
import { Argv } from 'yargs';

export default class BuildCommand extends Command<
  State,
  Action,
  Args,
  typeof import('../../services')
> {
  builder(yargs: Argv): Argv {
    return yargs.option('env', {
      default: 'development'
    });
  }
  cmd = 'build';

  describe = 'Build the brookjs application.';

  initialState = initialState;

  exec = exec;

  reducer = reducer;

  View = View;
}
