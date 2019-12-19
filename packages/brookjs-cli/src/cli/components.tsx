import React, { ErrorInfo } from 'react';
import { Color, Static, Box, AppContext } from 'ink';
import * as t from 'io-ts';
import { Maybe } from 'brookjs-types';
import { RCResult } from './RC';
import { Command } from './Command';
import { getMessage } from './format';

export const LoadDirError: React.FC<{ dir: string; error: Error }> = ({
  dir,
  error
}) => {
  return (
    <Box flexDirection="column">
      <Box>An error occurred attempting to load commands from {dir}</Box>
      <Box>{error.message}</Box>
      <Box>{error.stack}</Box>
    </Box>
  );
};

export const CommandValidationError: React.FC<{
  name: string;
  errors: t.Errors;
}> = ({ name, errors }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Color yellowBright>
        Command {name} was not loaded due to validation errors:
      </Color>
      {errors.map((error, i) => (
        <Box key={i} flexDirection="row">
          <Box marginRight={2}>💥</Box>
          <Box>{getMessage(error)}</Box>
        </Box>
      ))}
    </Box>
  );
};

export const Root: React.FC<{
  command: Maybe<Command<any>>;
  argv: string[];
  args: any;
  cwd: string;
  rc: Maybe<RCResult>;
  errors: JSX.Element[];
}> = ({ command, argv, args, cwd, rc, errors }) => (
  <>
    <Static>{errors}</Static>
    {command == null ? (
      <Color red>Command not found for {argv.join(' ')}</Color>
    ) : (
      <command.View args={args} cwd={cwd} rc={rc} />
    )}
  </>
);

type ErrorState = { error: null | Error; errorInfo: null | ErrorInfo };

export default class ErrorBoundary extends React.Component<{}, ErrorState> {
  state: ErrorState = {
    error: null,
    errorInfo: null
  };

  static contextType = AppContext;

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo }, () => {
      this.context.exit(1);
    });
  }

  render() {
    const { error, errorInfo } = this.state;

    if (error != null && errorInfo != null) {
      return (
        <Box>
          <Color red>An error occurred:</Color> {error.message}
        </Box>
      );
    }

    return this.props.children;
  }
}
