import React from 'react';
import yargs, { Argv, Arguments } from 'yargs';
import * as t from 'io-ts';
import { RC } from './RC';
import { Maybe } from './util';

export const Command = t.type({
  builder: t.Function,
  cmd: t.string,
  describe: t.string,
  View: t.Function
});

type CommandBase = Omit<t.TypeOf<typeof Command>, 'builder' | 'View'>;
type Builder<A> = (yargs: Argv<A>) => Argv<A>;

export interface Command<A> extends CommandBase {
  builder: Builder<A>;
  View: React.ComponentType<{
    args: Arguments<A>;
    rc: Maybe<RC | Error>;
    cwd: string;
  }>;
}

export class Commands {
  private commands: Command<any>[] = [];

  constructor(commands: Command<any>[] = []) {
    this.commands = commands;
  }

  add(command: Command<any>) {
    return new Commands([...this.commands, command]);
  }

  get<A>(argv: string[]): { command: Command<A> | null; args: Arguments<A> } {
    let running: Command<any> | null = null;

    const args = this.commands
      .reduce<Argv>(
        (yargs: Argv, command) =>
          yargs.command(
            command.cmd,
            command.describe,
            command.builder,
            () => (running = command)
          ),
        yargs
      )
      .parse(argv) as Arguments<A>;

    return { command: running, args };
  }
}
