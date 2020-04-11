/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import View from '../View';

describe('BuildCommand#View', () => {
  afterEach(cleanup);

  it('should render missing rc view', () => {
    const { lastFrame } = render(
      <View
        status="running"
        rc={null}
        cwd="/path/to/cwd"
        env="test"
        coverage={false}
        watch={false}
        updateSnapshot={false}
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });
});
