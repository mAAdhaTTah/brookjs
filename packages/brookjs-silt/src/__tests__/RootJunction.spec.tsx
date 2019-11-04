/* eslint-env jest */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Kefir from 'kefir';
import React from 'react';
import { chaiPlugin } from 'brookjs-desalinate';
import { render } from '@testing-library/react';
import RootJunction from '../RootJunction';

const { plugin } = chaiPlugin({ Kefir });

use(plugin);
use(sinonChai);

describe('RootJunction', () => {
  it('should provide aggregated$ as context', () => {
    const spy = sinon.spy(() => {});
    render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    expect(spy).to.have.callCount(1);
    expect(spy.getCall(0).args[0]).to.be.observable();
  });

  it('should call unsubscribe when unmounted', () => {
    const spy = sinon.spy(x => x.observe());
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    wrapper.unmount();

    expect(spy.getCall(0).args[0]).to.not.be.active();
  });

  it('should function correctly when nothing returned', () => {
    const spy = sinon.spy(() => {});
    const wrapper = render(
      <RootJunction root$={spy}>
        <p>Hello world!</p>
      </RootJunction>
    );

    wrapper.unmount();

    expect(spy.getCall(0).args[0]).to.not.be.active();
  });
});
