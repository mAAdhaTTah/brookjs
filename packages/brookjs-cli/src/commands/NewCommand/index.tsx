import { Command } from '../../cli';
import exec from './exec';
import View from './View';
import { Args } from './types';
import { useDeltas, RootJunction } from 'brookjs-silt';
import reducer from './reducer';
import initialState from './initialState';
import React from 'react';

const NewCommand: Command<Args> = {
  cmd: 'new [name]',
  describe: 'Create a new brookjs application',
  builder(yargs) {
    return yargs.options({
      name: {
        required: true,
        type: 'string',
        describe: 'The name of the new brookjs applicaiton'
      },
      yes: {
        alias: 'y',
        describe: 'Create the application with defaults answers to the prompts',
        default: false
      }
    });
  },
  View: ({ args, cwd }) => {
    const { state, root$ } = useDeltas(reducer, initialState(args, { cwd }), [
      exec
    ]);

    return (
      <RootJunction root$={root$}>
        <View {...state} />
      </RootJunction>
    );
  }
};

export default NewCommand;
