import webpack from 'webpack';
import Spinner from 'ink-spinner';
import { Box, Color } from 'ink';
import React from 'react';
import { Nullable } from 'typescript-nullable';
import { State } from './types';

const Building: React.FC<{}> = () => (
  <Box>
    <Spinner type="arrow3" />
    <Box paddingLeft={1}>Building application...</Box>
  </Box>
);

const Built: React.FC<{ results: webpack.Stats }> = ({ results }) => (
  <Box>{results.toString({ colors: true })}</Box>
);

const BuildError: React.FC<{ results: Error }> = ({ results }) => (
  <Box>{results.message}</Box>
);

const View: React.FC<State> = props => {
  if (Nullable.isNone(props.rc)) {
    return <Color red>RC file not loaded. Cannot build.</Color>;
  }

  if (props.rc instanceof Error) {
    return <Color red>RC file invalid. {props.rc.message}</Color>;
  }

  if (props.building) {
    return <Building />;
  }

  if (props.results instanceof Error) {
    return <BuildError results={props.results} />;
  }

  return <Built results={props.results} />;
};

export default View;
