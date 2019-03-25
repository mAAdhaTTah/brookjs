/* eslint-env mocha */
import React from 'react';
import { render } from 'ink-testing-library';
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
  before(function() {
    chaiJestSnapshot.resetSnapshotRegistry();
  });

  beforeEach(function() {
    chaiJestSnapshot.configureUsingMochaContext(this);
  });

  it('should render missing rc view', () => {
    const { lastFrame, unmount } = render(
      <View
        building={true}
        results={null}
        env="development"
        cwd="/path/to/wd"
        rc={null}
      />
    );

    expect(lastFrame()).to.matchSnapshot();

    unmount();
  });

  it('should render building view', () => {
    const { lastFrame, unmount } = render(
      <View
        building={true}
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

    unmount();
  });

  it('should render error view', () => {
    const results = new Error('Compilation error');

    const { lastFrame, unmount } = render(
      <View
        building={false}
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

    unmount();
  });

  it('should render built view', () => {
    const results: webpack.Stats = {
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
    };
    const { lastFrame, unmount } = render(
      <View
        building={false}
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

    unmount();
  });
});
