import path from 'path';
import vm from 'vm';
import React from 'react';
import { defaultLoaders, cosmiconfigSync } from 'cosmiconfig';
import { render, RenderOptions } from 'ink';
import { TransformOptions, transformFileSync } from '@babel/core';
import * as t from 'io-ts';
import resolve from 'resolve';
import { BabelRC } from '../babel';
import { Command } from './Command';
import Commands from './Commands';
import ErrorBoundary, {
  CommandValidationError,
  LoadDirError,
  Root
} from './components';

const RC = t.partial({
  babel: BabelRC
});

type RC = t.Type<typeof RC>;

export class App {
  private rc?: unknown;

  static create(name: string, commands?: Commands) {
    return new App(name, commands);
  }

  static resolve(target: string, basedir?: string): string {
    return resolve.sync(target, {
      basedir,
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx']
    });
  }

  static load(target: string) {
    const filename = App.resolve(target);

    const oldNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const result = transformFileSync(filename, {
      babelrc: false,
      configFile: false,
      presets: [
        [
          require.resolve('babel-preset-brookjs'),
          {
            useESModules: false,
            helpers: false
          }
        ]
      ],
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
    });
    process.env.NODE_ENV = oldNodeEnv;

    if (result?.code == null) {
      throw new Error('No code returned from transform');
    }

    const exports = {};
    const module = { exports };
    const context = vm.createContext({
      module,
      exports,
      __dirname: path.dirname(filename),
      process,
      require: (target: string) => {
        const resolvedTarget = App.resolve(target, path.dirname(filename));

        if (
          resolvedTarget.includes('node_modules') ||
          !resolvedTarget.includes(path.sep)
        ) {
          return require(resolvedTarget);
        }

        return this.load(resolvedTarget);
      }
    });

    vm.runInNewContext(result.code, context, {
      filename: filename
    });

    return module.exports;
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

  loadCommandsFrom(target: string) {
    try {
      return Object.entries(App.load(target)).reduce<App>(
        (app, [name, cmd]) => app.addCommand(name, cmd),
        this
      );
    } catch (error) {
      return new App(this.name, this.commands, [
        ...this.errors,
        <LoadDirError key={this.errors.length} error={error} dir={target} />
      ]);
    }
  }

  getRC(): unknown {
    if (this.rc !== undefined) {
      return this.rc;
    }

    return (this.rc =
      cosmiconfigSync(this.name, {
        loaders: {
          ...defaultLoaders,
          '.js': (filename: string) => App.load(filename),
          '.ts': (filename: string) => App.load(filename),
          '.tsx': (filename: string) => App.load(filename)
        }
      }).search()?.config ?? null);
  }

  getBabelConfig(base: TransformOptions): TransformOptions {
    return (
      RC.decode(this.getRC())
        .getOrElse({})
        ?.babel?.modifier?.(base) ?? base
    );
  }

  run(
    argv: string[],
    { cwd = process.cwd(), ...opts }: RenderOptions & { cwd?: string } = {}
  ) {
    const rc = this.getRC();

    const { command, args } = this.commands.get(argv);

    const instance = render(
      <ErrorBoundary>
        <Root {...{ command, argv, args, cwd, rc, errors: this.errors }} />
      </ErrorBoundary>,
      opts
    );

    return {
      waitUntilExit: instance.waitUntilExit
    };
  }
}
