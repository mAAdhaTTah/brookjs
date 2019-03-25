import Spinner from 'ink-spinner';
import { Box, Color } from 'ink';
import React from 'react';
import { Nullable } from 'typescript-nullable';
import { useExit } from '../../cli';
import { State, CompleteState } from './types';

const Running: React.FC<{ command: string }> = ({ command }) => (
  <Box>
    <Spinner type="arrow3" />
    <Box paddingLeft={1}>Running command {command}...</Box>
  </Box>
);

const Results: React.FC<{
  code: number;
  out: string;
  err: Nullable<string>;
}> = ({ code, out, err }) => {
  useExit(code !== 0 ? new Error(code + '') : undefined);

  return (
    <Box>
      <Box>{out.trim()}</Box>
      {Nullable.maybe(
        null,
        err => (
          <Color red>{err}</Color>
        ),
        err
      )}
    </Box>
  );
};

const isComplete = (state: State): state is CompleteState =>
  Nullable.isSome(state.code);

const View: React.FC<State> = props => {
  if (Nullable.isNone(props.rc)) {
    return <Color red>RC file not loaded. Cannot build.</Color>;
  }

  if (props.rc instanceof Error) {
    return <Color red>RC file invalid. {props.rc.message}</Color>;
  }

  if (!isComplete(props)) {
    if (Nullable.isNone(props.command)) {
      return null;
    }
    return <Running command={props.command.replace(props.cwd + '/', '')} />;
  }

  return <Results code={props.code} out={props.out} err={props.err} />;
};

export default View;
