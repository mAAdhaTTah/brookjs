import React, { useEffect } from 'react';
import { useDelta, RootJunction } from 'brookjs-silt';
import { ActionType, StateType } from 'typesafe-actions';
import Kefir from 'kefir';
import { Delta, Maybe } from 'brookjs-types';
import * as t from 'io-ts';
import { ofType } from 'brookjs-flow';
import { Box, Color } from 'ink';
import { combineReducers } from 'brookjs-eddy';
import webpack from 'webpack';
import { Command } from '../../cli';
import {
  WebpackRC,
  delta as webpackDelta,
  actions as webpackActions,
  reducer as webpackReducer,
  State as WebpackState,
  getEnv,
} from '../../webpack';
import {
  actions as projectActions,
  delta as projectDelta,
  reducer as projectReducer,
  State as ProjectState,
  useInitializeProject,
} from '../../project';
import { RootAction } from '../../types';
import { Built } from '../components';

type Args = {};

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

const reducer = combineReducers<
  {
    project: ProjectState;
    webpack: WebpackState;
  },
  RootAction
>({
  project: projectReducer,
  webpack: webpackReducer,
});

type State = StateType<typeof reducer>[0];

const exec: Delta<RootAction, State> = (action$, state$) => {
  const project$ = projectDelta(
    action$.thru(ofType(actions.initialize.request)),
    state$.map(({ project }) => project),
  );

  const webpack$ = webpackDelta(
    action$.thru(ofType(actions.start.request)),
    state$.map(({ webpack }) => webpack),
  );

  return Kefir.merge<Action, never>([project$, webpack$]);
};

const View: React.FC<{
  error: Maybe<Error>;
  building: boolean;
  running: boolean;
  stats: Maybe<webpack.Stats>;
}> = ({ error, building, running, stats }) => {
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

const initialState: State = {
  webpack: { status: 'idle' },
  project: { status: 'uninitialized' },
};

const StartCommand: Command<Args> = {
  cmd: 'start',
  describe: 'Start the brookjs development server.',
  builder(yargs) {
    return yargs;
  },

  View: ({ args, rc, cwd }) => {
    const { state, root$, dispatch } = useDelta(reducer, initialState, exec);

    useInitializeProject(state.project, cwd, dispatch);

    useEffect(() => {
      if (state.project.status === 'initialized') {
        dispatch(
          webpackActions.start.request({
            name: state.project.pkg.name,
            cmd: 'start',
            cwd,
            env: getEnv(args.env),
            extension: state.project.ext,
            watch: typeof args.watch === 'boolean' ? args.watch : false,
            rc: RC.decode(rc).getOrElse({}) as RC,
          }),
        );
      }
    }, [dispatch, cwd, state, args, rc]);

    return (
      <RootJunction root$={root$}>
        <View
          building={
            state.webpack.status === 'idle' ||
            (state.webpack.status === 'running' && state.webpack.building)
          }
          running={state.webpack.status === 'running'}
          error={
            state.webpack.status === 'running' &&
            state.webpack.results instanceof Error
              ? state.webpack.results
              : null
          }
          stats={
            state.webpack.status === 'running' &&
            !(state.webpack.results instanceof Error)
              ? state.webpack.results
              : null
          }
        />
      </RootJunction>
    );
  },
};

export default StartCommand;
