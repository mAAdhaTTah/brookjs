/* eslint-env jest */
import Kefir from 'kefir';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toJunction } from '../toJunction';
import { Provider } from '../context';

const { value, stream, send } = KTU;

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

  const clickButton = ({ container }: { container: HTMLElement }) =>
    fireEvent.click(container.querySelector('button')!);

  it('should warn if rendered outside of provider', () => {
    const mock = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Button />);

    expect(mock).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  describe('events', () => {
    it('should render normally', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      expect(wrapper.container.innerHTML).toBe('<button>Click me</button>');
    });

    it('should update normally', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.rerender(
        <ProvidedButton root$={root$} text={'Click me'} enabled={false} />
      );

      expect(wrapper.container.innerHTML).toBe('<span>nothing to click</span>');
    });

    it('should emit events through root stream', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      expect(root$).toEmit([value({ type: 'CLICK' })], () => {
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

      expect(root$).toEmit([value({ type: 'CLICK' })], () => {
        clickButton(wrapper);
      });
    });

    it('should unplug if unmounted', () => {
      const root$ = Kefir.pool();
      const wrapper = render(
        <ProvidedButton root$={root$} text={'Click me'} enabled={true} />
      );

      wrapper.unmount();

      expect(root$._curSources).toHaveLength(0);
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
      expect(root$._curSources).toHaveLength(0);
      expect(newAggregated$._curSources).toHaveLength(1);
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

      expect(root$).toEmit([value({ type: 'CLICK' })], () => {
        clickButton(wrapper);
      });
    });
  });

  describe('combine', () => {
    it('should call combine with correct arguments and use returned stream', () => {
      const source$ = stream();
      const combine = jest.fn(() => source$);
      const Button = toJunction(
        events,
        combine
      )(({ onButtonClick, text, enabled }) =>
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

      expect(root$).toEmit([value({ type: 'EMITTED' })], () => {
        send(source$, [value({ type: 'EMITTED' })]);
      });
      expect(combine).toHaveBeenCalledTimes(1);

      expect(combine).toHaveBeenCalledWith(
        expect.any(Kefir.Observable),
        {
          onButtonClick$: expect.any(Kefir.Observable),
          children$: expect.any(Kefir.Observable)
        },
        { text: 'Click me', enabled: true }
      );
    });

    it('should call combine with updated props', () => {
      const combine = jest.fn(() => Kefir.never());
      const Button = toJunction(
        events,
        combine
      )(({ onButtonClick, text, enabled }) =>
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

      expect(combine).toHaveBeenCalledTimes(2);
      expect(combine).toHaveBeenNthCalledWith(
        1,
        expect.any(Kefir.Observable),
        {
          onButtonClick$: expect.any(Kefir.Observable),
          children$: expect.any(Kefir.Observable)
        },
        { text: 'Click me', enabled: true }
      );
      expect(combine).toHaveBeenNthCalledWith(
        2,
        expect.any(Kefir.Observable),
        {
          onButtonClick$: expect.any(Kefir.Observable),
          children$: expect.any(Kefir.Observable)
        },
        { text: 'Click you', enabled: true }
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

      expect(root$).toEmit([value({ type: 'BUTTON_CLICK' })], () => {
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

      expect(root$).toEmit([value({ type: 'BUTTON_CLICK' })], () => {
        clickButton(wrapper);
      });
    });
  });
});
