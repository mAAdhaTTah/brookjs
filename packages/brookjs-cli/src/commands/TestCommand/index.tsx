import React from 'react';
import { unreachable } from 'brookjs-types';
import { Command } from '../../cli';
import Check from './Check';
import Unit from './Unit';
import Lint from './Lint';

const types = ['check', 'lint', 'unit'] as const;

type Args = {
  coverage: boolean;
  watch: boolean;
  type: typeof types extends ReadonlyArray<infer T> ? T : never;
};

const TestCommand: Command<Args> = {
  builder(yargs) {
    return yargs.options({
      type: {
        required: true,
        describe: `Type of test to run. One of: ${types.join(', ')}.`,
        choices: types
      },
      coverage: {
        describe: 'Add coverage data to output.',
        default: false
      },
      watch: {
        describe: 'Watch files & rerun the tests on changes.',
        default: false
      }
    });
  },
  cmd: 'test <type>',
  describe: 'Run the application tests.',
  View: props => {
    switch (props.args.type) {
      case 'check':
        return <Check {...props} />;
      case 'unit':
        return <Unit {...props} />;
      case 'lint':
        return <Lint {...props} />;
      default:
        return unreachable(props.args.type);
    }
  }
};

export default TestCommand;
