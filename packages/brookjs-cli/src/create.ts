import { App } from './cli';
import { BuildCommand, NewCommand, TestCommand } from './commands';

const create = () =>
  App.create('beaver')
    .addCommand(NewCommand)
    .addCommand(BuildCommand)
    .addCommand(TestCommand);

export default create;
