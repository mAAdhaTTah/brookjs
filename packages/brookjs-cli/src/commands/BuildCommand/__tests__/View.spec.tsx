/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { jestPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import webpack from 'webpack';
import View from '../View';

const { extensions } = jestPlugin({ Kefir });
expect.extend(extensions);

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
      />
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
              filename: '[name].js'
            }
          }
        }}
      />
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('should render error view', () => {
    const results = new Error('Compilation error');

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
              filename: '[name].js'
            }
          }
        }}
      />
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
        return {};
      },
      toString() {
        return 'Compilation results!';
      }
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
              filename: '[name].js'
            }
          }
        }}
      />
    );

    expect(lastFrame()).toMatchSnapshot();
  });
});
