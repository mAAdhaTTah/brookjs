import * as t from 'io-ts';
import webpack from 'webpack';

export const plugin = t.type({});

export type Plugin = t.TypeOf<typeof plugin>;

export const rc = t.partial({
  plugins: t.array(t.union([t.string, plugin])),
  dir: t.string,
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

type RCBase = t.TypeOf<typeof rc>;

type WebpackBase = RCBase['webpack'];

type WebpackState = {
  env: Required<webpack.Configuration>['mode'];
  cmd: 'build' | 'start';
};

type Webpack = Exclude<WebpackBase, 'modifer'> & {
  modifier?: (
    config: webpack.Configuration,
    state: WebpackState
  ) => webpack.Configuration;
};

export interface RC extends RCBase {
  webpack: Webpack;
}
