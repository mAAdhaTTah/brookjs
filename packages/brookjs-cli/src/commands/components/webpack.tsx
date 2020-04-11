import webpack from 'webpack';
import { Box, Color, useApp } from 'ink';
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { ExitError } from '../../cli';

export const Built: React.FC<{
  results: webpack.Stats;
  watch: boolean;
}> = ({ results, watch }) => {
  const {
    assets = [],
    entrypoints = {},
    builtAt = Date.now(),
    warnings,
    errors,
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
            <Message key={i} level="warning" message={warning} />
          ))}
        </Box>
      )}
      {errors.length > 0 && <BuildErrors errors={errors} watch={watch} />}
    </Box>
  );
};

export const BuildErrors: React.FC<{ errors: string[]; watch: boolean }> = ({
  errors,
  watch,
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
        <Message key={i} level="error" message={error} />
      ))}
    </Box>
  );
};

export const Asset: React.FC<{
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

export const Message: React.FC<{
  level: 'error' | 'warning';
  message: string;
}> = ({ level, message }) => {
  return (
    <Box>
      <Color redBright={level === 'error'} yellow={level === 'warning'}>
        {message}
      </Color>
    </Box>
  );
};
