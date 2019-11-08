import React from 'react';
import cosmiconfig from 'cosmiconfig';
import { render, Color } from 'ink';
import { Nullable } from 'typescript-nullable';
import { ValidationError, getFunctionName, Context } from 'io-ts';
import esm from 'esm';
import { RC } from './RC';
import ErrorBoundary from './ErrorBoundary';
import { Commands, Command } from './Command';

const loadEsm = esm(module);

const loaders = {
  '.js': {
    sync: (filename: string) => loadEsm(filename),
    async: (filename: string) => loadEsm(filename)
  }
};

export class App {
  static create(name: string, commands?: Commands) {
    return new App(name, commands);
  }

  private constructor(
    private name: string,
    private commands: Commands = new Commands()
  ) {
    this.name = name;
    this.commands = commands;
  }

  addCommand(cmd: Command<any>): App {
    if (!Command.is(cmd)) {
      throw new Error();
    }

    return new App(this.name, this.commands.add(cmd));
  }

  loadCommandsFrom(dir: string) {
    // It's not a consistent reference,
    // so we don't want to suggest it's a `this` alias.
    // eslint-disable-next-line consistent-this
    let app: App = this;
    let commands: { [key: string]: Command<any> } = {};

    try {
      commands = this.load(dir);
    } catch {
      return app;
    }

    for (const key in commands) {
      try {
        app = app.addCommand(commands[key]);
      } catch (e) {
        console.error(`${key} is not a valid command.`);
      }
    }

    return app;
  }

  private load(dir: string) {
    // @TODO(mAAdhaTTah) harmonize usage of preset
    require('@babel/register')({
      only: [dir],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelrc: true,
      presets: [
        '@babel/typescript',
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    });

    return require(dir);
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
    let rc: Nullable<RC | Error> = null;
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

      rc = RC.decode(result.config).fold<RC | Error>(
        function failure(es) {
          return new Error('Errors: ' + es.map(getMessage).join('; '));
        },
        function success(value) {
          return value as RC;
        }
      );
    }

    const { command, args } = this.commands.get(argv);

    const instance = render(
      <ErrorBoundary>
        {command == null ? (
          <Color red>Command not found for {argv.join(' ')}</Color>
        ) : (
          <command.View args={args} cwd={cwd} rc={rc} />
        )}
      </ErrorBoundary>,
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
