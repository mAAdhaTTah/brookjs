import React, { useEffect } from 'react';
import { useDeltas } from 'brookjs-silt';
import { unreachable } from 'brookjs-types';
import { Arguments } from 'yargs';
import * as glob from '../../../glob';
import { Globbing, Running } from '../components';
import { exec } from './exec';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { Args } from './types';
import { Completed } from './Completed';

const Lint: React.FC<{ args: Arguments<Args>; rc: unknown; cwd: string }> = ({
  rc,
  cwd
}) => {
  const { state, dispatch } = useDeltas(reducer, initialState(cwd, rc), [exec]);

  useEffect(() => {
    dispatch(glob.actions.lint.request());
  }, [dispatch]);

  switch (state.status) {
    case 'globbing':
      return <Globbing />;
    case 'linting':
      return <Running action="Linting" total={state.files.length} />;
    case 'completed':
      return (
        <Completed
          {...state.files.reduce<React.ComponentProps<typeof Completed>>(
            (props, file) => {
              if (file.status !== 'linted') {
                return props;
              }

              const added = file.report.errorCount + file.report.warningCount;

              return {
                total: props.total + 1,
                errors: props.errors + file.report.errorCount,
                warnings: props.warnings + file.report.warningCount,
                issues:
                  added > 0
                    ? [
                        ...props.issues,
                        {
                          path: file.path.replace(`${state.cwd}/`, ''),
                          result: file.report.results[0]
                        }
                      ]
                    : props.issues
              };
            },
            {
              total: 0,
              errors: 0,
              warnings: 0,
              issues: []
            }
          )}
        />
      );
    default:
      return unreachable(state.status);
  }
};

export default Lint;
