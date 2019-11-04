/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import chaiJestSnapshot from 'chai-jest-snapshot';
import webpack from 'webpack';
import View from '../View';

const { plugin } = chaiPlugin({ Kefir });
use(plugin);
use(chaiJestSnapshot);

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

    expect(lastFrame()).to.matchSnapshot();
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

    expect(lastFrame()).to.matchSnapshot();
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

    expect(lastFrame()).to.matchSnapshot();
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

    expect(lastFrame()).to.matchSnapshot();
  });
});
