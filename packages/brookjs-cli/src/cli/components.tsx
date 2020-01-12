import React, { ErrorInfo } from 'react';
import { Color, Static, Box, AppContext, AppProps } from 'ink';
import * as t from 'io-ts';
import { Maybe } from 'brookjs-types';
import { Command } from './Command';
import { getMessage } from './format';
import { ExitError } from './useExit';

export const ExplosiveBullet: React.FC<{ message: string }> = ({ message }) => (
  <Box flexDirection="row">
    <Box marginRight={2}>💥</Box>
    <Box>{message}</Box>
  </Box>
);

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
        <ExplosiveBullet key={i} message={getMessage(error)} />
      ))}
    </Box>
  );
};

export const Root: React.FC<{
  command: Maybe<Command<any>>;
  argv: string[];
  args: any;
  cwd: string;
  rc: unknown;
  errors: React.ReactNode[];
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

export default class ErrorBoundary extends React.Component<
  {},
  ErrorState,
  AppProps
> {
  state: ErrorState = {
    error: null,
    errorInfo: null
  };

  static contextType = AppContext;

  // @TODO(mAAdhaTTah) use this when plugin ordering is fixed
  // declare context: React.ContextType<typeof AppContext>;
  context!: React.ContextType<typeof AppContext>;

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo }, () => {
      this.context.exit(new ExitError(1));
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
