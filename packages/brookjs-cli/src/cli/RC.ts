import * as t from 'io-ts';
import webpack from 'webpack';
import * as format from './format';

export const RC = t.partial({
  dir: t.string,
  jest: t.exact(
    t.partial({
      clearMocks: t.boolean,
      collectCoverageFrom: t.array(t.string),
      coveragePathIgnorePatterns: t.array(t.string),
      coverageReporters: t.array(t.string),
      coverageThreshold: t.record(
        t.string,
        t.partial({
          branches: t.number,
          functions: t.number,
          lines: t.number,
          statements: t.number
        })
      ),
      displayName: t.union([
        t.string,
        t.type({
          name: t.string,
          color: t.string
        })
      ]),
      extraGlobals: t.array(t.string),
      globalSetup: t.string,
      globalTeardown: t.string,
      moduleNameMapper: t.record(t.string, t.string),
      resetMocks: t.boolean,
      resetModules: t.boolean,
      restoreMocks: t.boolean,
      snapshotSerializers: t.array(t.string),
      transform: t.record(
        t.string,
        t.union([t.string, t.tuple([t.string, t.object])])
      ),
      transformIgnorePatterns: t.array(t.string),
      watchPathIgnorePatterns: t.array(t.string)
    })
  ),
  webpack: t.partial({
    modifier: t.Function,
    entry: t.union([
      t.string,
      t.dictionary(t.string, t.string),
      t.array(t.string)
    ]),
    output: t.type({
      path: t.string,
      filename: t.union([t.Function, t.string])
    })
  })
});

type RCBase = t.TypeOf<typeof RC>;

type WebpackBase = Required<RCBase>['webpack'];

type WebpackState = {
  env: Required<webpack.Configuration>['mode'];
  cmd: 'build' | 'start';
};

type Webpack = Omit<WebpackBase, 'modifier'> & {
  modifier?: (
    config: webpack.Configuration,
    state: WebpackState
  ) => webpack.Configuration;
};

export interface RC extends RCBase {
  webpack?: Webpack;
}

export class RCError extends Error {
  private errors: t.Errors;

  constructor(errors: t.Errors, message?: string) {
    super(message);
    this.errors = errors;
  }

  toString() {
    return (
      'Errors: ' + this.errors.map(err => format.getMessage(err)).join('; ')
    );
  }
}

export type RCResult = RC | RCError;
