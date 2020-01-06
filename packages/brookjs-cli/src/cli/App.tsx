import React from 'react';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';
import { render } from 'ink';
import esm from 'esm';
import { Command } from './Command';
import Commands from './Commands';
import ErrorBoundary, {
  CommandValidationError,
  LoadDirError,
  Root
} from './components';

const loadEsm = esm(module);

const loaders = {
  ...defaultLoaders,
  '.js': (filename: string) => loadEsm(filename)
};

export class App {
  static create(name: string, commands?: Commands) {
    return new App(name, commands);
  }

  private constructor(
    private name: string,
    private commands: Commands = new Commands(),
    private errors: React.ReactNode[] = []
  ) {}

  addCommand(name: string, cmd: unknown): App {
    return Command.decode(cmd).fold(
      errors =>
        new App(this.name, this.commands, [
          ...this.errors,
          <CommandValidationError
            key={this.errors.length}
            name={name}
            errors={errors}
          />
        ]),
      cmd =>
        new App(this.name, this.commands.add(cmd as Command<any>), this.errors)
    );
  }

  loadCommandsFrom(dir: string) {
    try {
      return Object.entries(this.load(dir)).reduce<App>(
        (app, [name, cmd]) => app.addCommand(name, cmd),
        this
      );
    } catch (error) {
      return new App(this.name, this.commands, [
        ...this.errors,
        <LoadDirError key={this.errors.length} error={error} dir={dir} />
      ]);
    }
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
    const rc: unknown =
      (await cosmiconfig(this.name, { loaders }).search())?.config ?? null;

    const { command, args } = this.commands.get(argv);

    const instance = render(
      <ErrorBoundary>
        <Root {...{ command, argv, args, cwd, rc, errors: this.errors }} />
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
