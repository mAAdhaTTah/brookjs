import React from 'react';
import { Argv, Arguments } from 'yargs';
import * as t from 'io-ts';

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
    rc: unknown;
    cwd: string;
  }>;
}
