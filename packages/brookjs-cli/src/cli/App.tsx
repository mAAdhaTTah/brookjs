import Kefir, { Stream, Pool, Subscription } from 'kefir';
import React, { useEffect, useState } from 'react';
import cosmiconfig from 'cosmiconfig';
import yargs from 'yargs';
import { Argv, Arguments } from 'yargs';
import { render, Color } from 'ink';
import { RootJunction } from 'brookjs-silt';
import { Action } from 'redux';
import Command from './Command';

type RootProps = {
  commands: Commands;
  argv: string[];
  onExit: (code: number) => void;
};

const Root = <S, A extends Action>({ commands, argv }: RootProps) => {
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
    const state$ = action$.scan(command.reducer, command.initialState(args));
    const exec$ = command.exec(action$, state$);
    const onValue = (action: A): void => (action$ as any)._emitValue(action);
    const root = (root$: Pool<A, Error>) => root$.observe(onValue);

    const execSub = exec$.observe(onValue);
    const stateSub = state$.observe(state =>
      setState({ state, View, root })
    );

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
  running?: Command<any, any, any>;

  private commands: Command<any, any, any>[] = [];

  constructor(commands: Command<any, any, any>[] = []) {
    this.commands = commands;
  }

  add(command: Command<any, any, any>) {
    return new Commands([...this.commands, command]);
  }

  get<A>(
    argv: string[]
  ): { command: Command<any, any, A> | null; args: Arguments<A> } {
    let running: Command<any, any, any> | null = null;

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

interface Config {
  commands: Commands;
}

const defaultConfig: Config = { commands: new Commands() };

export default class App {
  code: number | null = null;

  debug: boolean = false;

  private commands: Commands;

  private running: boolean = false;

  static create(name: string, config: Config = defaultConfig) {
    return new App(name, config);
  }

  private constructor(private name: string, { commands }: Config) {
    this.commands = commands;
  }

  addCommand(cmd: Command<any, any, any>): App {
    if (this.running) {
      throw new Error(
        `${this.name} is already running. Cannot add additional commands.`
      );
    }

    return new App(this.name, {
      commands: this.commands.add(cmd)
    });
  }

  run(
    argv: string[],
    {
      stdin = process.stdin,
      stdout = process.stdout,
      debug = false,
      onExit = (code: number) => {
        process.exitCode = this.code = code;
      }
    }: {
      stdin?: typeof process.stdin;
      stdout?: typeof process.stdout;
      debug?: boolean;
      onExit?: (code: number) => void;
    } = {}
  ) {
    if (this.running) {
      throw new Error(`${this.name} is already running. Cannot run again.`);
    }

    this.running = true;
    this.debug = debug;

    const instance = render(
      <Root commands={this.commands} argv={argv} onExit={onExit} />,
      {
        stdout,
        stdin,
        debug
      }
    );

    return (code?: number) => {
      this.running = false;
      instance.unmount();
      code != null && onExit(code);
    };
  }

  // make(argv: string[]) {
  //   return this.search()
  //     .flatMap(result => this.process(result))
  //     .flatMap(rc => {
  //       const { running, v } = this.commands.parse(argv);
  //
  //       if (!running) {
  //         return Kefir.constantError(new Error('No command matched'));
  //       }
  //
  //       return this.exec(running, v, rc);
  //     })
  //     .flatMapErrors((err: Error) => {
  //       renderToString(<Color red>Error: {err.message}</Color>);
  //
  //       return Kefir.never();
  //     });
  // }
  //
  // private search(): Observable<cosmiconfig.CosmiconfigResult, Error> {
  //   return Kefir.fromPromise(cosmiconfig(this.name).search());
  // }
  //
  // private process(
  //   result: cosmiconfig.CosmiconfigResult
  // ): Observable<RC, Error> {
  //   if (result == null) {
  //     return Kefir.constant<RC>({});
  //   }
  //
  //   return rc.is(result.config)
  //     ? Kefir.constant(result.config)
  //     : Kefir.constantError(new Error('Invalid rc file loaded'));
  // }
}
