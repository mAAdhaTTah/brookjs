import React, { ErrorInfo } from 'react';
import { AppContext, Color, Box } from 'ink';

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
