import React from 'react';
import { useDeltas, RootJunction } from 'brookjs-silt';
import { Command } from '../../cli';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { Args } from './types';

const TestCommand: Command<Args> = {
  builder(yargs) {
    return yargs
      .positional('type', {
        describe: 'Type of test to run. One of: unit.'
      })
      .option('coverage', {
        describe: 'Add coverage data to output.',
        default: false
      })
      .option('watch', {
        describe: 'Watch files & rerun the tests on changes.',
        default: false
      });
  },
  cmd: 'test <type>',
  describe: 'Run the application tests.',
  View: ({ args, rc, cwd }) => {
    const { state, root$ } = useDeltas(
      reducer,
      initialState(args, { rc, cwd }),
      [exec]
    );

    return (
      <RootJunction root$={root$}>
        <View {...state} />
      </RootJunction>
    );
  }
};

export default TestCommand;
