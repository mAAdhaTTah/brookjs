import Kefir, { Stream, Pool, Subscription } from 'kefir';
import React, { useEffect, useState } from 'react';
import cosmiconfig from 'cosmiconfig';
import yargs, { Argv, Arguments } from 'yargs';
import { render, Color } from 'ink';
import { RootJunction } from 'brookjs-silt';
import { Action } from 'redux';
import { Nullable } from 'typescript-nullable';
import { ValidationError, getFunctionName, Context } from 'io-ts';
import Command from './Command';
import { RC, rc } from './RC';

const loadEsm = require('esm')(module);

const loaders = {
  '.js': {
    sync: (filename: string) => loadEsm(filename),
    async: (filename: string) => loadEsm(filename)
  }
};

type RootProps<S> = {
  commands: Commands;
  services: S;
  rc: Nullable<RC | Error>;
  cwd: string;
  argv: string[];
};

const Root = <S, A extends Action, Services>({
  commands,
  services,
  rc,
  cwd,
  argv
}: RootProps<Services>) => {
  const [app, setState] = useState<{
    state: S;
    View: React.ComponentType<S>;
    root: (root$: Pool<A, Error>) => Subscription;
  }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { command, args } = commands.get(argv);

    if (command == null) {
      setError(`Command not found for ${argv.join(' ')}`);
      return;
    }

    const { View } = command;
    const action$ = new Kefir.Stream() as Stream<A, never>;
    const state$ = action$.scan(
      command.reducer,
      command.initialState(args, { rc, cwd })
    );
    const exec$ = command.exec(services)(action$, state$);
    const onValue = (action: A): void => (action$ as any)._emitValue(action);
    const root = (root$: Pool<A, Error>) => root$.observe(onValue);

    const execSub = exec$.observe(onValue);
    const stateSub = state$.observe(state => setState({ state, View, root }));

    return () => {
      execSub.unsubscribe();
      stateSub.unsubscribe();
    };
  }, []);

  if (error != null) {
    return <Color red>{error}</Color>;
  }

  if (app) {
    const { root, state, View } = app;

    return (
      <RootJunction<A> root$={root}>
        <View {...state} />
      </RootJunction>
    );
  }

  return <Color grey>Loading...</Color>;
};

class Commands {
  running?: Command<any, any, any, any>;

  private commands: Command<any, any, any, any>[] = [];

  constructor(commands: Command<any, any, any, any>[] = []) {
    this.commands = commands;
  }

  add(command: Command<any, any, any, any>) {
    return new Commands([...this.commands, command]);
  }

  get<A>(
    argv: string[]
  ): { command: Command<any, any, A, any> | null; args: Arguments<A> } {
    let running: Command<any, any, any, any> | null = null;

    const args = (this.commands.reduce(
      (yargs: Argv, command) =>
        yargs.command(
          command.cmd,
          command.describe,
          command.builder,
          () => (running = command)
        ),
      yargs
    ) as Argv).parse(argv) as Arguments<A>;

    return { command: running, args };
  }
}

export default class App<S> {
  code: number | null = null;

  debug: boolean = false;

  private running: boolean = false;

  static create<S extends object = {}>(
    name: string,
    commands?: Commands,
    services?: S
  ) {
    return new App<S>(name, commands, services);
  }

  private constructor(
    private name: string,
    private commands: Commands = new Commands(),
    private services?: S
  ) {
    this.name = name;
    this.commands = commands;
    this.services = services;
  }

  addCommand(cmd: Command<any, any, any, any>): App<S> {
    if (this.running) {
      throw new Error(
        `${this.name} is already running. Cannot add additional commands.`
      );
    }

    return new App(this.name, this.commands.add(cmd), this.services);
  }

  registerServices(services: S) {
    return new App(this.name, this.commands, services);
  }

  async run(
    argv: string[],
    {
      stdin = process.stdin,
      stdout = process.stdout,
      cwd = process.cwd(),
      debug = false
    }: {
      stdin?: typeof process.stdin;
      stdout?: typeof process.stdout;
      cwd?: string;
      debug?: boolean;
    } = {}
  ) {
    if (this.running) {
      throw new Error(`${this.name} is already running. Cannot run again.`);
    }

    this.running = true;
    this.debug = debug;

    let loaded: Nullable<RC | Error> = null;
    const result = await cosmiconfig(this.name, { loaders }).search();

    if (result != null) {
      // @TODO(mAAdhaTTah) Associate with RCValidationError
      function stringify(v: any): string {
        if (typeof v === 'function') {
          return getFunctionName(v);
        }

        if (typeof v === 'number' && !isFinite(v)) {
          if (isNaN(v)) {
            return 'NaN';
          }
          return v > 0 ? 'Infinity' : '-Infinity';
        }

        return JSON.stringify(v, null, '  ');
      }

      function getContextPath(context: Context): string {
        return context.map(({ key, type }) => `${key}: ${type.name}`).join('/');
      }

      function getMessage(e: ValidationError): string {
        return e.message !== undefined
          ? e.message
          : `Invalid value ${stringify(e.value)} supplied to ${getContextPath(
              e.context
            )}`;
      }

      loaded = rc.decode(result.config).fold<RC | Error>(
        function failure(es) {
          return new Error('Errors: ' + es.map(getMessage).join('; '));
        },
        function success(value) {
          return value;
        }
      );
    }

    const instance = render(
      <Root
        commands={this.commands}
        services={this.services}
        argv={argv}
        cwd={cwd}
        rc={loaded}
      />,
      {
        stdout,
        stdin,
        debug
      }
    );

    return {
      waitUntilExit: instance.waitUntilExit
    };
  }
}
