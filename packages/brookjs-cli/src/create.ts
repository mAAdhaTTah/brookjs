import { App } from './cli';
import {
  BuildCommand,
  NewCommand,
  TestCommand,
  FormatCommand
} from './commands';

const create = () =>
  App.create('beaver')
    .addCommand('NewCommand', NewCommand)
    .addCommand('BuildCommand', BuildCommand)
    .addCommand('TestCommand', TestCommand)
    .addCommand('FormatCommand', FormatCommand);

export default create;
