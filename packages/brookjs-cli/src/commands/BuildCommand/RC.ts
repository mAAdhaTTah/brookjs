import * as t from 'io-ts';
import webpack from 'webpack';

export const RC = t.partial({
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
