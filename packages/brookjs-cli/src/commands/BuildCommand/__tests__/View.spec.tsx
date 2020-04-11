/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import webpack from 'webpack';
import View from '../View';

jest.mock('date-fns', () => ({
  format: (_builtAt: number, formatString: string) =>
    formatString.replace('HH:mm:ss', '07:58:40').replace(/'/g, ''),
}));

describe('BuildCommand#View', () => {
  afterEach(cleanup);

  it('should render missing rc view', () => {
    const { lastFrame } = render(
      <View
        building={true}
        watch={false}
        results={null}
        env="development"
        cwd="/path/to/wd"
        rc={null}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('should render building view', () => {
    const { lastFrame } = render(
      <View
        building={true}
        watch={false}
        results={null}
        env="development"
        cwd="/path/to/wd"
        rc={{
          dir: 'src',
          webpack: {
            entry: 'client.js',
            output: {
              path: 'dist',
              filename: '[name].js',
            },
          },
        }}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('should render error view', () => {
    const results = new Error('Cannot compile.');

    const { lastFrame } = render(
      <View
        building={false}
        watch={false}
        results={results}
        env="development"
        cwd="/path/to/wd"
        rc={{
          dir: 'src',
          webpack: {
            entry: 'client.js',
            output: {
              path: 'dist',
              filename: '[name].js',
            },
          },
        }}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('should render built view', () => {
    const results = {
      compilation: {} as any,
      hasErrors() {
        return false;
      },
      hasWarnings() {
        return false;
      },
      toJson() {
        return {
          _showErrors: true,
          _showWarnings: true,
          assets: [{} as any],
          builtAt: 1580129920074,
          warnings: [],
          errors: [],
        };
      },
      toString() {
        return 'Compilation results!';
      },
    } as webpack.Stats;
    const { lastFrame } = render(
      <View
        building={false}
        watch={false}
        results={results}
        env="development"
        cwd="/path/to/wd"
        rc={{
          dir: 'src',
          webpack: {
            entry: 'client.js',
            output: {
              path: 'dist',
              filename: '[name].js',
            },
          },
        }}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });
});
