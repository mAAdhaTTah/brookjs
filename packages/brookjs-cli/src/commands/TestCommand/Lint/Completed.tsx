import React from 'react';
import { Box, Color } from 'ink';
import { CLIEngine, Linter } from 'eslint';
import { ExitError, useExit, ExplosiveBullet } from '../../../cli';

const Message: React.FC<Linter.LintMessage> = ({
  line,
  column,
  message,
  fatal,
  severity,
  ruleId
}) => (
  <Box flexDirection="row">
    <Box marginLeft={2}>
      <Color whiteBright>
        Line {line}:{column}:
      </Color>
    </Box>
    <Box marginLeft={2}>
      <Color>{message}</Color>
    </Box>
    {ruleId && (
      <Box marginLeft={3}>
        <Color underline red={fatal || severity === 2} yellow={severity === 1}>
          {ruleId}
        </Color>
      </Box>
    )}
  </Box>
);

type Issue = {
  path: string;
  result: CLIEngine.LintResult;
};

const Issue: React.FC<Issue> = ({ path, result }) => (
  <Box flexDirection="column">
    <Box marginBottom={1}>
      <ExplosiveBullet message={path} />
    </Box>
    {result.messages.map((msg, i) => (
      <Message key={i} {...msg} />
    ))}
  </Box>
);

const Failed: React.FC<{
  issues: Issue[];
  errors: number;
  warnings: number;
}> = ({ issues, warnings, errors }) => {
  useExit(new ExitError(1));

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Color red>Failure! These files have lint issues:</Color>
      <Box flexDirection="column" marginBottom={1}>
        {issues.map((issue, i) => (
          <Issue key={i} {...issue} />
        ))}
      </Box>
      {warnings > 0 && <Color yellow>Warnings: {warnings}</Color>}
      {errors > 0 && <Color red>Errors: {errors}</Color>}
    </Box>
  );
};

const Succeeded: React.FC<{ total: number }> = ({ total }) => {
  useExit();

  return (
    <Box flexDirection="column">
      <Color green>Success! All files are correctly linted.</Color>
      <Color greenBright>
        Checked {total} file{total === 1 ? '' : 's'}
      </Color>
    </Box>
  );
};

export const Completed: React.FC<{
  total: number;
  errors: number;
  warnings: number;
  issues: Issue[];
}> = ({ total, errors, warnings, issues }) => {
  const failed = errors !== 0 || warnings !== 0;

  return failed ? (
    <Failed issues={issues} warnings={warnings} errors={errors} />
  ) : (
    <Succeeded total={total} />
  );
};
