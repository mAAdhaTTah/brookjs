import React, { useEffect } from 'react';
import { useDeltas } from 'brookjs-silt';
import { unreachable } from 'brookjs-types';
import { Arguments } from 'yargs';
import * as glob from '../../../glob';
import { Args } from './types';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { Globbing, Running } from '../components';
import { exec } from './exec';
import { Completed } from './Completed';

const Check: React.FC<{ args: Arguments<Args>; rc: unknown; cwd: string }> = ({
  rc,
  cwd
}) => {
  const { state, dispatch } = useDeltas(reducer, initialState(cwd, rc), [exec]);

  useEffect(() => {
    dispatch(glob.actions.lint.request());
  }, [dispatch]);

  switch (state.status) {
    case 'globbing':
      return <Globbing />;
    case 'checking':
      return <Running action="Checking" total={state.files.length} />;
    case 'completed':
      return (
        <Completed
          total={state.files.length}
          unformatted={state.files
            .filter(file => file.status === 'checked' && !file.correct)
            .map(file => file.path.replace(`${state.cwd}/`, ''))}
        />
      );
    default:
      return unreachable(state.status);
  }
};

export default Check;
