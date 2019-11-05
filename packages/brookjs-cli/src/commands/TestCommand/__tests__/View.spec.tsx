/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { jestPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import View from '../View';

const { extensions } = jestPlugin({ Kefir });
expect.extend(extensions);

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
        command={'jest'}
      />
    );

    expect(lastFrame()).toMatchSnapshot();
  });
});
