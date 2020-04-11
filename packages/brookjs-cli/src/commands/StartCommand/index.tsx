import React, { useEffect } from 'react';
import { useDelta, RootJunction } from 'brookjs-silt';
import { EddyReducer, loop } from 'brookjs-eddy';
import { ActionType, getType } from 'typesafe-actions';
import Kefir from 'kefir';
import { Delta, Maybe } from 'brookjs-types';
import * as t from 'io-ts';
import { ofType } from 'brookjs-flow';
import { Box, Color } from 'ink';
import webpack from 'webpack';
import { Command } from '../../cli';
import {
  WebpackRC,
  delta as webpackDelta,
  actions as webpackActions,
} from '../../webpack';
import {
  actions as projectActions,
  delta as projectDelta,
} from '../../project';
import { Built } from '../components';

type Args = {};

type State = {
  args: Args;
  cwd: string;
  rc: Maybe<RC>;
  extension: Maybe<'js' | 'ts'>;
  error: Maybe<Error>;
  running: boolean;
  building: boolean;
  stats?: Maybe<webpack.Stats>;
};

type Action = ActionType<typeof actions>;

type RC = t.TypeOf<typeof RC>;

const RC = t.partial({
  dir: t.string,
  webpack: WebpackRC,
});

const actions = {
  ...projectActions,
  ...webpackActions,
};

const reducer: EddyReducer<State, Action> = (
  state = initialState({}, { rc: null, cwd: '/' }),
  action,
) => {
  switch (action.type) {
    case getType(actions.extension.success):
      return loop(
        { ...state, extension: action.payload },
        actions.start.request(),
      );
    case getType(actions.start.failure):
      return { ...state, error: action.payload };
    case getType(actions.start.success):
      return {
        ...state,
        running: true,
        building: true,
      };
    case getType(actions.invalidated):
      return {
        ...state,
        building: true,
      };
    case getType(actions.done):
      return {
        ...state,
        building: false,
        stats: action.payload,
      };
    default:
      return state;
  }
};

const initialState = (
  args: Args,
  { rc, cwd }: { rc: unknown; cwd: string },
): State => ({
  args,
  cwd,
  extension: null,
  rc: RC.decode(rc).fold(
    () => null,
    rc => rc,
  ),
  error: null,
  running: false,
  building: false,
});

const exec: Delta<Action, State> = (action$, state$) => {
  const project$ = projectDelta(
    action$.thru(ofType(actions.extension.request)),
    state$,
  );

  const webpack$ = webpackDelta(
    action$.thru(ofType(actions.start.request)),
    state$.map(state => ({
      cwd: state.cwd,
      extension: state.extension ?? 'js',
      rc: state.rc,
      cmd: 'start',
      env: 'development',
      watch: true,
    })),
  );

  return Kefir.merge<Action, never>([project$, webpack$]);
};

const View: React.FC<State> = ({ error, building, running, stats }) => {
  if (error) {
    return (
      <Box>
        <Color red>An error occurred: {error.message}</Color>
      </Box>
    );
  }

  if (building) {
    return (
      <Box>
        <Color yellow>Rebuild bundle...</Color>
      </Box>
    );
  }

  if (!running) {
    return (
      <Box>
        <Color yellow>Starting server...</Color>
      </Box>
    );
  }

  if (stats) {
    return <Built results={stats} watch={true} />;
  }

  return null;
};

const StartCommand: Command<Args> = {
  cmd: 'start',
  describe: 'Start the brookjs development server.',
  builder(yargs) {
    return yargs;
  },

  View: ({ args, rc, cwd }) => {
    const { state, root$, dispatch } = useDelta(
      reducer,
      initialState(args, { rc, cwd }),
      exec,
    );

    useEffect(() => {
      dispatch(projectActions.extension.request());
    }, [dispatch]);

    return (
      <RootJunction root$={root$}>
        <View {...state} />
      </RootJunction>
    );
  },
};

export default StartCommand;
