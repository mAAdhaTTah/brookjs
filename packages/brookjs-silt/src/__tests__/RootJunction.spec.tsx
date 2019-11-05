/* eslint-env jest */
import Kefir from 'kefir';
import React from 'react';
import { jestPlugin } from 'brookjs-desalinate';
import { render } from '@testing-library/react';
import RootJunction from '../RootJunction';

const { extensions } = jestPlugin({ Kefir });

expect.extend(extensions);

describe('RootJunction', () => {
  it('should provide aggregated$ as context', () => {
    const spy = jest.fn();
    render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBeObservable();
  });

  it('should call unsubscribe when unmounted', () => {
    const spy = jest.fn(x => x.observe());
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    wrapper.unmount();

    expect(spy.mock.calls[0][0]).not.toBeActiveObservable();
  });

  it('should function correctly when nothing returned', () => {
    const spy = jest.fn();
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    wrapper.unmount();

    expect(spy.mock.calls[0][0]).not.toBeActiveObservable();
  });
});
