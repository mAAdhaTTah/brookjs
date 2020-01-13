import { Box, Color } from 'ink';
import React from 'react';
import { useExit } from '../../../cli';
import { State, CompleteState, ErrorState } from './types';

const Running: React.FC = React.memo(() => (
  <Box>
    <Color yellow>Running Jest...</Color>
  </Box>
));

const Results: React.FC = () => {
  useExit();

  return (
    <Box>
      <Color green>Finished running tests</Color>
    </Box>
  );
};

const isDone = (state: State): state is CompleteState | ErrorState =>
  state.status === 'complete';

const View: React.FC<State> = props => {
  if (props.rc == null) {
    return <Color red>RC file not loaded. Cannot build.</Color>;
  }

  if (props.rc instanceof Error) {
    return <Color red>RC file invalid. {props.rc.message}</Color>;
  }

  if (!isDone(props)) {
    return <Running />;
  }

  return <Results />;
};

export default View;
