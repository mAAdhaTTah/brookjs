/* eslint-env mocha */
import { expect, use } from 'chai';
import Kefir from 'kefir';
import React from 'react';
import { chaiPlugin } from 'brookjs-desalinate';
import sinon from 'sinon';
import { render, fireEvent } from 'react-testing-library';
import { toJunction } from '../toJunction';
import { Provider } from '../context';

const { plugin, value, stream, send } = chaiPlugin({ Kefir });

use(plugin);

describe('toJunction', () => {
  const events = { onButtonClick: e$ => e$.map(() => ({ type: 'CLICK' })) };
  const Button = toJunction(events)(({ onButtonClick, text, enabled }) =>
    enabled ? (
      <button onClick={onButtonClick}>{text}</button>
    ) : (
      <span>nothing to click</span>
    )
  );

  const ProvidedButton = ({ root$, text, enabled }) => (
    <Provider value={root$}>
      <Button text={text} enabled={enabled} />
    </Provider>
  );

  const clickButton = ({ container }) =>
    fireEvent.click(container.querySelector('button'));

  describe('events', () => {
    it('should render normally', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      expect(wrapper.container.innerHTML).to.equal('<button>Click me</button>');
    });

    it('should update normally', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.rerender(
        <ProvidedButton root$={root$} text={'Click me'} enabled={false} />
      );

      expect(wrapper.container.innerHTML).to.equal(
        '<span>nothing to click</span>'
      );
    });

    it('should emit events through root stream', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      expect(root$).to.emit([value({ type: 'CLICK' })], () => {
        clickButton(wrapper);
      });
    });

    it('should emit one event after updating', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.rerender(
        <ProvidedButton root$={root$} text={'Click you'} enabled={true} />
      );

      expect(root$).to.emit([value({ type: 'CLICK' })], () => {
        clickButton(wrapper);
      });
    });

    it('should unplug if unmounted', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.unmount();

      expect(root$._curSources).to.have.lengthOf(0);
    });

    it('should unplug from old root stream if new root stream provided', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      const newAggregated$ = Kefir.pool();

      wrapper.rerender(
        <ProvidedButton
          root$={newAggregated$}
          text={'Click me'}
          enabled={true}
        />
      );
      expect(root$._curSources).to.have.lengthOf(0);
      expect(newAggregated$._curSources).to.have.lengthOf(1);
    });

    it('should take events directly', () => {
      const Button = toJunction(events)(({ onButtonClick, text, enabled }) =>
        enabled ? (
          <button onClick={onButtonClick}>{text}</button>
        ) : (
          <span>nothing to click</span>
        )
      );

      const ProvidedButton = ({ root$, text, enabled }) => (
        <Provider value={root$}>
          <Button text={text} enabled={enabled} />
        </Provider>
      );

      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      expect(root$).to.emit([value({ type: 'CLICK' })], () => {
        clickButton(wrapper);
      });
    });
  });

  describe('combine', () => {
    it('should call combine with correct arguments and use returned stream', () => {
      const source$ = stream();
      const combine = sinon.spy(() => source$);
      const Button = toJunction(events, combine)(
        ({ onButtonClick, text, enabled }) =>
          enabled ? (
            <button onClick={onButtonClick}>{text}</button>
          ) : (
            <span>nothing to click</span>
          )
      );

      const ProvidedButton = ({ root$, text, enabled }) => (
        <Provider value={root$}>
          <Button text={text} enabled={enabled} />
        </Provider>
      );
      const root$ = Kefir.pool();
      render(<ProvidedButton root$={root$} text={'Click me'} enabled={true} />);

      expect(root$).to.emit([value({ type: 'EMITTED' })], () => {
        send(source$, [value({ type: 'EMITTED' })]);
      });
      expect(combine).to.have.been.calledOnce.and.have.been.calledWith(
        sinon.match.instanceOf(Kefir.Observable),
        sinon.match({
          onButtonClick$: sinon.match.instanceOf(Kefir.Observable)
        }),
        sinon.match({ text: 'Click me', enabled: true })
      );
    });

    it('should call combine with updated props', () => {
      const combine = sinon.spy(() => Kefir.never());
      const Button = toJunction(events, combine)(
        ({ onButtonClick, text, enabled }) =>
          enabled ? (
            <button onClick={onButtonClick}>{text}</button>
          ) : (
            <span>nothing to click</span>
          )
      );

      const ProvidedButton = ({ root$, text, enabled }) => (
        <Provider value={root$}>
          <Button text={text} enabled={enabled} />
        </Provider>
      );
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.rerender(
        <ProvidedButton root$={root$} text={'Click you'} enabled={true} />
      );

      expect(combine)
        .to.have.been.calledTwice.and.have.been.calledWith(
          sinon.match.instanceOf(Kefir.Observable),
          sinon.match({
            onButtonClick$: sinon.match.instanceOf(Kefir.Observable)
          }),
          sinon.match({ text: 'Click me', enabled: true })
        )
        .and.have.been.calledWith(
          sinon.match.instanceOf(Kefir.Observable),
          sinon.match({
            onButtonClick$: sinon.match.instanceOf(Kefir.Observable)
          }),
          sinon.match({ text: 'Click you', enabled: true })
        );
    });
  });

  describe('preplug', () => {
    it('should map stream', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <Provider value={root$}>
          <Button
            text={'Click me'}
            enabled={true}
            preplug={child$ => child$.map(() => ({ type: 'BUTTON_CLICK' }))}
          />
        </Provider>
      );

      expect(root$).to.emit([value({ type: 'BUTTON_CLICK' })], () => {
        clickButton(wrapper);
      });
    });

    it('should map children', () => {
      const root$ = Kefir.pool();
      const Wrapper = toJunction()(() => (
        <Button text={'Click me'} enabled={true} />
      ));

      const wrapper = render(
        <Provider value={root$}>
          <Wrapper
            preplug={child$ => child$.map(() => ({ type: 'BUTTON_CLICK' }))}
          />
        </Provider>
      );

      expect(root$).to.emit([value({ type: 'BUTTON_CLICK' })], () => {
        clickButton(wrapper);
      });
    });
  });
});
