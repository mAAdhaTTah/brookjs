import { Argv, Arguments } from 'yargs';
import { Stream, Property } from 'kefir';
import React from 'react';
import { RC } from './RC';

export default abstract class Command<S, A, V> {
  abstract builder(yargs: Argv): Argv;

  abstract cmd: string;

  abstract describe: string;

  abstract initialState: (args: Arguments<V>, rc?: RC) => S;

  abstract exec: (
    action$: Stream<A, never>,
    state$: Property<S, never>
  ) => Stream<A, never>;

  abstract reducer: (state: S, action: A) => S;

  abstract View: React.ComponentType<S>;
}
