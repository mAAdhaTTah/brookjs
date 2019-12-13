/* eslint-env jest */
import Kefir from 'kefir';
import React from 'react';
import { jestPlugin } from 'brookjs-desalinate';
import { render } from '@testing-library/react';
import { withRef$ } from '../withRef';
import { Provider } from '../context';

const { extensions, value } = jestPlugin({ Kefir });

expect.extend(extensions);

const refback = (ref$, props$) => Kefir.combine({ props$ }, { ref$ });

const _Button = ({ text }, ref) => <button ref={ref}>{text}</button>;

const Button = withRef$(refback)(_Button);

const Instance = ({ text, aggregated$ }) => (
  <Provider value={aggregated$}>
    <Button text={text} />
  </Provider>
);

describe('withRef$', () => {
  it('should warn if rendered outside of provider', () => {
    const mock = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Button />);

    expect(mock).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  it('should emit value from ref$', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );

    expect(aggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { text: 'Click me!' }
        },
        { current: true }
      )
    ]);
  });

  it('should remove ref$ when unmounted', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );

    wrapper.unmount();

    expect(aggregated$._curSources).toHaveLength(0);
  });

  it('should replace aggregated$', () => {
    const aggregated$ = Kefir.pool();
    const newAggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );

    wrapper.rerender(
      <Instance text={'Click me!'} aggregated$={newAggregated$} />
    );

    expect(aggregated$._curSources).toHaveLength(0);
    expect(newAggregated$._curSources).toHaveLength(1);

    expect(newAggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { text: 'Click me!' }
        },
        { current: true }
      )
    ]);
  });

  it('should emit new props', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );
    const ref$ = wrapper.container.querySelector('button');

    expect(aggregated$).toEmit(
      [
        value(
          {
            ref$,
            props$: { text: 'Click me!' }
          },
          {
            current: true
          }
        ),
        value({ ref$, props$: { text: 'Click me too!' } })
      ],
      () => {
        wrapper.rerender(
          <Instance text={'Click me too!'} aggregated$={aggregated$} />
        );
      }
    );
  });

  it('should work with components that can take a ref directly', () => {
    const aggregated$ = Kefir.pool();
    const Button = withRef$(refback)('button');
    const Instance = ({ text, aggregated$ }) => (
      <Provider value={aggregated$}>
        <Button text={text} />
      </Provider>
    );

    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );

    expect(aggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { text: 'Click me!' }
        },
        { current: true }
      )
    ]);
  });
});
