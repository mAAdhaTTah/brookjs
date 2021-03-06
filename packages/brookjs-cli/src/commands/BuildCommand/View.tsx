import Spinner from 'ink-spinner';
import { Box, Color } from 'ink';
import React from 'react';
import { Maybe } from 'brookjs-types';
import webpack from 'webpack';
import { ExitError, useExit } from '../../cli';
import { Built, BuildErrors } from '../components';
import { RC } from '../../webpack';

const Building: React.FC<{}> = () => (
  <Box>
    <Color green>
      <Spinner type="arrow3" />
    </Color>
    <Box paddingLeft={1}>Building application...</Box>
  </Box>
);

const RCNotLoaded: React.FC = () => {
  useExit(new ExitError(1));

  return <Color red>RC file not loaded. Cannot build.</Color>;
};

const RCInvalid: React.FC<{ message: string }> = ({ message }) => {
  useExit(new ExitError(1));

  return <Color red>RC file invalid. {message}</Color>;
};

const View: React.FC<{
  rc: Maybe<RC>;
  building: boolean;
  results: Maybe<Error | webpack.Stats>;
  watch: Maybe<boolean>;
}> = props => {
  if (props.rc == null) {
    return <RCNotLoaded />;
  }

  if (props.rc instanceof Error) {
    return <RCInvalid message={props.rc.message} />;
  }

  if (props.building) {
    return <Building />;
  }

  if (props.results instanceof Error) {
    return (
      <BuildErrors watch={!!props.watch} errors={[props.results.message]} />
    );
  }

  if (!props.watch && props.results!.hasErrors()) {
    const { errors, warnings } = props.results!.toJson('errors-warnings');

    return (
      <BuildErrors watch={!!props.watch} errors={[...errors, ...warnings]} />
    );
  }

  return <Built results={props.results!} watch={!!props.watch} />;
};

export default View;
