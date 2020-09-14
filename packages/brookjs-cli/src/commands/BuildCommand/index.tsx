import React, { useEffect, useMemo } from 'react';
import { Argv } from 'yargs';
import { useDelta, RootJunction } from 'brookjs-silt';
import { Command } from '../../cli';
import * as project from '../../project';
import * as webpack from '../../webpack';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { Args } from './types';

const BuildCommand: Command<Args> = {
  cmd: 'build',
  describe: 'Build the brookjs application.',
  builder(yargs: Argv): Argv {
    return yargs
      .option('env', {
        describe: 'Environment build target. One of: development, production.',
        default: 'production',
      })
      .option('watch', {
        describe: 'Watch the files and rebuild on changes',
        default: false,
      });
  },

  View: ({ args, rc, cwd }) => {
    const { state, root$, dispatch } = useDelta(reducer, initialState, exec);

    const decodedRc = useMemo(
      () => webpack.RC.decode(rc).getOrElse({}) as webpack.RC,
      [rc],
    );

    project.useInitializeProject(state.project, cwd, dispatch);

    useEffect(() => {
      if (state.project.status === 'initialized') {
        dispatch(
          webpack.actions.build.request({
            name: state.project.pkg.name,
            cwd,
            cmd: 'build',
            env: webpack.getEnv(args.env),
            extension: state.project.ext,
            watch: typeof args.watch === 'boolean' ? args.watch : false,
            rc: decodedRc,
          }),
        );
      }
    }, [dispatch, cwd, state.project, args.env, args.watch, decodedRc]);

    return (
      <RootJunction root$={root$}>
        <View
          rc={decodedRc}
          building={
            state.webpack.status === 'idle' ||
            (state.webpack.status === 'running' && state.webpack.building)
          }
          watch={
            state.webpack.status === 'running' ? state.webpack.watch : null
          }
          results={
            state.webpack.status === 'running' ? state.webpack.results : null
          }
        />
      </RootJunction>
    );
  },
};

export default BuildCommand;
