import { App } from './cli';
import { BuildCommand, NewCommand, TestCommand } from './commands';

const create = () =>
  App.create('beaver')
    .addCommand('NewCommand', NewCommand)
    .addCommand('BuildCommand', BuildCommand)
    .addCommand('TestCommand', TestCommand);

export default create;
