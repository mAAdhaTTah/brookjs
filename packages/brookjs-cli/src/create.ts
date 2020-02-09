import { App } from './cli';
import {
  BuildCommand,
  FormatCommand,
  NewCommand,
  StartCommand,
  TestCommand
} from './commands';

const create = () =>
  App.create('beaver')
    .addCommand('BuildCommand', BuildCommand)
    .addCommand('FormatCommand', FormatCommand)
    .addCommand('NewCommand', NewCommand)
    .addCommand('StartCommand', StartCommand)
    .addCommand('TestCommand', TestCommand);

export default create;
