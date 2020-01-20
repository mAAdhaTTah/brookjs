import React, { useEffect } from 'react';
import { Argv } from 'yargs';
import { useDeltas, RootJunction } from 'brookjs-silt';
import { Command } from '../../cli';
import * as project from '../../project';
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
        default: 'production'
      })
      .option('watch', {
        describe: 'Watch the files and rebuild on changes',
        default: false
      });
  },

  View: ({ args, rc, cwd }) => {
    const { state, root$, dispatch } = useDeltas(
      reducer,
      initialState(args, { rc, cwd }),
      [exec]
    );

    useEffect(() => {
      dispatch(project.actions.extension.request());
    }, []);

    return (
      <RootJunction root$={root$}>
        <View {...state} />
      </RootJunction>
    );
  }
};

export default BuildCommand;
