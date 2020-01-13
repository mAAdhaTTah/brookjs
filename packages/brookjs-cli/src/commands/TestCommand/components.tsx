import React from 'react';
import { Box, Color } from 'ink';

export const Globbing: React.FC = () => {
  return <Color yellow>Globbing</Color>;
};

export const Running: React.FC<{
  action: string;
  total: number;
}> = ({ action, total }) => {
  return (
    <Box flexDirection="column">
      <Color yellow>
        {action} files: {total}
      </Color>
    </Box>
  );
};
