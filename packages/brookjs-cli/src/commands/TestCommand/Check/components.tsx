import React from 'react';
import { Box, Color } from 'ink';
import { useExit, ExitError, ExplosiveBullet } from '../../../cli';

export const Globbing: React.FC = () => {
  return <Color yellow>Globbing</Color>;
};

export const Checking: React.FC<{
  total: number;
}> = ({ total }) => {
  return (
    <Box flexDirection="column">
      <Color yellow>
        Checking {total} file{total === 1 ? '' : 's'}
      </Color>
    </Box>
  );
};

export const Completed: React.FC<{
  total: number;
  unformatted: string[];
}> = ({ total, unformatted }) => {
  useExit(unformatted.length !== 0 ? new ExitError(1) : undefined);
  return unformatted.length === 0 ? (
    <Box flexDirection="column">
      <Color green>Success! All files are correctly formatted.</Color>
      <Color greenBright>
        Checked {total} file{total === 1 ? '' : 's'}
      </Color>
    </Box>
  ) : (
    <Box flexDirection="column">
      <Color red>Failure! These files are incorrectly formatted:</Color>
      {unformatted.map((file, i) => (
        <ExplosiveBullet key={i} message={file} />
      ))}
      <Color red>Total: {unformatted.length}</Color>
    </Box>
  );
};
