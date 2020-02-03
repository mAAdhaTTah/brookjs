import webpack from 'webpack';
import Spinner from 'ink-spinner';
import { Box, Color, useApp } from 'ink';
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { ExitError, useExit } from '../../cli';
import { State } from './types';

const Asset: React.FC<{
  name: string;
  entry: webpack.Stats.ChunkGroup;
}> = ({ name }) => {
  return (
    <Box flexDirection="row" paddingLeft={2}>
      <Color magentaBright>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <Box marginRight={2}>🤖</Box>
        {name}
      </Color>
    </Box>
  );
};

const Warning: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box>
      <Color yellow>{message}</Color>
    </Box>
  );
};

const ErrorMsg: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box>
      <Color redBright>{message}</Color>
    </Box>
  );
};

const Building: React.FC<{}> = () => (
  <Box>
    <Color green>
      <Spinner type="arrow3" />
    </Color>
    <Box paddingLeft={1}>Building application...</Box>
  </Box>
);

const Built: React.FC<{ results: webpack.Stats; watch: boolean }> = ({
  results,
  watch
}) => {
  const {
    assets = [],
    entrypoints = {},
    builtAt = Date.now(),
    warnings,
    errors
  } = results.toJson('verbose');

  return (
    <Box flexDirection="column">
      <Color cyan>{format(builtAt, "'Finished compiling at 'HH:mm:ss")}</Color>
      <Color cyanBright>
        Generated {assets.length} asset{assets.length === 1 ? '' : 's'} from
        entrypoints:
      </Color>
      <Box flexDirection="column" marginBottom={1}>
        {Object.entries(entrypoints).map(([name, entry]) => (
          <Asset key={name} name={name} entry={entry} />
        ))}
      </Box>
      {warnings.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Box marginBottom={1}>
            <Color yellowBright>Compilation warnings:</Color>
          </Box>
          {warnings.map((warning, i) => (
            <Warning key={i} message={warning} />
          ))}
        </Box>
      )}
      {errors.length > 0 && <BuildErrors errors={errors} watch={watch} />}
    </Box>
  );
};

const BuildErrors: React.FC<{ errors: string[]; watch: boolean }> = ({
  errors,
  watch
}) => {
  const { exit } = useApp();

  useEffect(() => {
    if (!watch) {
      exit(new ExitError(1));
    }
  }, [watch, exit]);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box marginBottom={1}>
        <Color redBright>Compilation errors:</Color>
      </Box>
      {errors.map((error, i) => (
        <ErrorMsg key={i} message={error} />
      ))}
    </Box>
  );
};

const RCNotLoaded: React.FC = () => {
  useExit(new ExitError(1));

  return <Color red>RC file not loaded. Cannot build.</Color>;
};

const RCInvalid: React.FC<{ message: string }> = ({ message }) => {
  useExit(new ExitError(1));

  return <Color red>RC file invalid. {message}</Color>;
};

const View: React.FC<State> = props => {
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
    return <BuildErrors watch={props.watch} errors={[props.results.message]} />;
  }

  if (!props.watch && props.results.hasErrors()) {
    const { errors } = props.results.toJson('errors-only');

    return <BuildErrors watch={props.watch} errors={errors} />;
  }

  return <Built results={props.results} watch={props.watch} />;
};

export default View;
