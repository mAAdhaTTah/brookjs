import React from 'react';
import { useDelta, RootJunction } from 'brookjs-silt';
import { Arguments } from 'yargs';
import exec from './exec';
import initialState from './initialState';
import reducer from './reducer';
import View from './View';
import { Args } from './types';

const Unit: React.FC<{ args: Arguments<Args>; rc: unknown; cwd: string }> = ({
  args,
  rc,
  cwd,
}) => {
  const { state, root$ } = useDelta(
    reducer,
    initialState(args, { rc, cwd }),
    exec,
  );

  return (
    <RootJunction root$={root$}>
      <View {...state} />
    </RootJunction>
  );
};

export default Unit;
