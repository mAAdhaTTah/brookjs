import { App } from './cli';
import { NewCommand } from './commands';

export const create = () => App.create('beaver').addCommand(new NewCommand());
