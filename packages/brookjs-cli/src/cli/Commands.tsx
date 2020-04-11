import yargs, { Argv, Arguments } from 'yargs';
import { Command } from './Command';

export default class Commands {
  private commands: Command<any>[] = [];
  constructor(commands: Command<any>[] = []) {
    this.commands = commands;
  }
  add(command: Command<any>) {
    return new Commands([...this.commands, command]);
  }
  get<A>(
    argv: string[],
  ): {
    command: Command<A> | null;
    args: Arguments<A>;
  } {
    let running: Command<A> | null = null;
    const args = this.commands
      .reduce<Argv>(
        (yargs: Argv, command) =>
          yargs.command(
            command.cmd,
            command.describe,
            command.builder,
            () => (running = command),
          ),
        yargs,
      )
      .parse(argv) as Arguments<A>;
    return { command: running, args };
  }
}
