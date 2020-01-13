import webpack from 'webpack';
import Spinner from 'ink-spinner';
import { Box, Color, AppContext } from 'ink';
import React, { useEffect, useContext } from 'react';
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

const BuildError: React.FC<{ error: Error; watch: boolean }> = ({
  error,
  watch
}) => {
  const { exit } = useContext(AppContext);

  useEffect(() => {
    if (!watch) {
      exit(error);
    }
  }, [watch, exit, error]);

  return <Box>{error.message}</Box>;
};

const View: React.FC<State> = props => {
  if (props.rc == null) {
    return <Color red>RC file not loaded. Cannot build.</Color>;
  }

  if (props.rc instanceof Error) {
    return <Color red>RC file invalid. {props.rc.message}</Color>;
  }

  if (props.building) {
    return <Building />;
  }

  if (props.results instanceof Error) {
    return <BuildError watch={props.watch} error={props.results} />;
  }

  if (!props.watch && props.results.hasErrors()) {
    const { errors } = props.results.toJson('errors-only');

    return (
      <BuildError
        watch={props.watch}
        error={new Error(`Build failed with errors: ${errors.join(', ')}`)}
      />
    );
  }

  return <Built results={props.results} />;
};

export default View;
