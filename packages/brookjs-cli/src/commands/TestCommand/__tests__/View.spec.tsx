/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import chaiJestSnapshot from 'chai-jest-snapshot';
import View from '../View';

const { plugin } = chaiPlugin({ Kefir });
use(plugin);
use(chaiJestSnapshot);

describe('BuildCommand#View', () => {
  afterEach(cleanup);

  it('should render missing rc view', () => {
    const { lastFrame } = render(
      <View
        rc={null}
        code={null}
        out={null}
        err={null}
        cwd="/path/to/cwd"
        env="test"
        coverage={false}
        watch={false}
        command={'mocha'}
      />
    );

    expect(lastFrame()).to.matchSnapshot();
  });
});
