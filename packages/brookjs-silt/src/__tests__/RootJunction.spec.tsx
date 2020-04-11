/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import RootJunction from '../RootJunction';

describe('RootJunction', () => {
  it('should provide aggregated$ as context', () => {
    const spy = jest.fn();
    render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBeObservable();
  });

  it('should call unsubscribe when unmounted', () => {
    const spy = jest.fn(x => x.observe());
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    wrapper.unmount();

    expect(spy.mock.calls[0][0]).not.toBeActiveObservable();
  });

  it('should function correctly when nothing returned', () => {
    const spy = jest.fn();
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    wrapper.unmount();

    expect(spy.mock.calls[0][0]).not.toBeActiveObservable();
  });

  it('should maintain root$ if it does not change', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const wrapper = render(
      <RootJunction root$={spy1}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    wrapper.rerender(
      <RootJunction root$={spy1}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('should replace root$ if it changes', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const wrapper = render(
      <RootJunction root$={spy1}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    wrapper.rerender(
      <RootJunction root$={spy2}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should unsub when replacing root$ if it changes', () => {
    const spy1 = jest.fn(x => x.observe());
    const spy2 = jest.fn();
    const wrapper = render(
      <RootJunction root$={spy1}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    wrapper.rerender(
      <RootJunction root$={spy2}>
        <p>Hello world!</p>
      </RootJunction>,
    );

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});
