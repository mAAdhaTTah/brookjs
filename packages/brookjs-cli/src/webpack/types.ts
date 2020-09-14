import webpack from 'webpack';
import * as t from 'io-ts';
import { ActionType } from 'typesafe-actions';
import { Maybe } from 'brookjs-types';
import { BabelRC } from '../babel';
import { Ext } from '../project';
import * as actions from './actions';

type Idle = {
  status: 'idle';
};

type Running = {
  status: 'running';
  building: boolean;
  serverStarted: boolean;
  results: null | webpack.Stats | Error;
  watch: boolean;
};

export type State = Idle | Running;

export const WebpackRC = t.partial({
  modifier: t.Function,
  entry: t.union([
    t.string,
    t.dictionary(t.string, t.string),
    t.array(t.string),
  ]),
  output: t.type({
    path: t.string,
    filename: t.union([t.Function, t.string]),
  }),
});

export type WebpackRC = Omit<t.TypeOf<typeof WebpackRC>, 'modifier'> & {
  modifier?: (
    config: webpack.Configuration,
    state: {
      cmd: 'build' | 'start';
      env: webpack.Configuration['mode'];
      extension: Ext;
      watch: boolean;
    },
  ) => webpack.Configuration;
};

export const RC = t.partial({
  dir: t.string,
  babel: BabelRC,
  webpack: WebpackRC,
});

export type RC = Omit<t.TypeOf<typeof RC>, 'babel'> & {
  babel?: BabelRC;
};

export type Action = ActionType<typeof actions>;

export type BuildConfig = {
  name: string;
  cmd: 'build' | 'start';
  cwd: string;
  env: webpack.Configuration['mode'];
  extension: Ext;
  watch: boolean;
  rc: Maybe<RC>;
};
