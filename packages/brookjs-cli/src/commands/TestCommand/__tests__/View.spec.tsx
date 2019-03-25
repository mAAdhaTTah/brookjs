import React from 'react';
import { render } from 'ink-testing-library';
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import chaiJestSnapshot from 'chai-jest-snapshot';
import View from '../View';
import webpack from 'webpack';

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
    const { lastFrame, unmount } = render(<View rc={null} />);

    expect(lastFrame()).to.matchSnapshot();

    unmount();
  });
});
