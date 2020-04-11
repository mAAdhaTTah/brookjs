import React from 'react';
import { Text } from 'ink';

export const ValidCommand = {
  builder(yargs) {
    return yargs;
  },
  cmd: 'valid',
  describe: 'A valid command!',
  View: () => <Text>Success from ValidCommand!</Text>,
};
