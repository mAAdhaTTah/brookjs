import { Argv } from 'yargs';
import { Command } from '../../cli';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { State, Action, Args } from './types';

export default class BuildCommand extends Command<
  State,
  Action,
  Args,
  typeof import('../../services')
> {
  builder(yargs: Argv): Argv {
    return yargs
      .option('env', {
        describe: 'Environment build target. One of: development, production.',
        default: 'development'
      })
      .option('watch', {
        describe: 'Watch the files and rebuild on changes',
        default: false
      });
  }
  cmd = 'build';

  describe = 'Build the brookjs application.';

  initialState = initialState;

  exec = exec;

  reducer = reducer;

  View = View;
}
