import React from 'react';
import { Argv, Arguments } from 'yargs';
import * as t from 'io-ts';

export const Command = t.type({
  builder: t.Function,
  cmd: t.string,
  describe: t.string,
  View: t.Function,
});

export type Command<A> = Omit<t.TypeOf<typeof Command>, 'builder' | 'View'> & {
  builder: (yargs: Argv<A>) => Argv<A>;
  View: React.ComponentType<{
    args: Arguments<A>;
    rc: unknown;
    cwd: string;
  }>;
};
