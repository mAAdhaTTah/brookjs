/* eslint-env jest */
import Kefir, { Observable, Pool } from 'kefir';
import React from 'react';
import { render } from '@testing-library/react';
import { withRef$, Refback } from '../withRef';
import { Provider } from '../context';

const { value } = KTU;

type Props = {
  children: string;
};

const refback: Refback<Props, HTMLButtonElement, any> = (ref$, props$) =>
  Kefir.combine({ props$ } as any, { ref$ } as any) as Observable<
    { props$: Props; ref$: HTMLButtonElement },
    never
  >;

const _Button: React.RefForwardingComponent<HTMLButtonElement, Props> = (
  { children },
  ref,
) => <button ref={ref}>{children}</button>;

const Button = withRef$(refback)(_Button);

const Instance: React.FC<Props & { aggregated$: Pool<any, any> }> = ({
  children,
  aggregated$,
}) => (
  <Provider value={aggregated$}>
    <Button children={children} />
  </Provider>
);

describe('withRef$', () => {
  it('should warn if rendered outside of provider', () => {
    const mock = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Button children="Hello" />);

    expect(mock).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  it('should emit value from ref$', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance children={'Click me!'} aggregated$={aggregated$} />,
    );

    expect(aggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { children: 'Click me!' },
        },
        { current: true },
      ),
    ]);
  });

  it('should remove ref$ when unmounted', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance children={'Click me!'} aggregated$={aggregated$} />,
    );

    wrapper.unmount();

    expect((aggregated$ as any)._curSources).toHaveLength(0);
  });

  it('should replace aggregated$', () => {
    const aggregated$ = Kefir.pool();
    const newAggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance children={'Click me!'} aggregated$={aggregated$} />,
    );

    wrapper.rerender(
      <Instance children={'Click me!'} aggregated$={newAggregated$} />,
    );

    expect((aggregated$ as any)._curSources).toHaveLength(0);
    expect((newAggregated$ as any)._curSources).toHaveLength(1);

    expect(newAggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { children: 'Click me!' },
        },
        { current: true },
      ),
    ]);
  });

  it('should emit new props', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance children={'Click me!'} aggregated$={aggregated$} />,
    );
    const ref$ = wrapper.container.querySelector('button');

    expect(aggregated$).toEmit(
      [
        value(
          {
            ref$,
            props$: { children: 'Click me!' },
          },
          {
            current: true,
          },
        ),
        value({ ref$, props$: { children: 'Click me too!' } }),
      ],
      () => {
        wrapper.rerender(
          <Instance children={'Click me too!'} aggregated$={aggregated$} />,
        );
      },
    );
  });

  it('should work with components that can take a ref directly', () => {
    const aggregated$ = Kefir.pool();
    const Button = withRef$(refback)('button');
    const Instance: React.FC<any> = ({ text, aggregated$ }) => (
      <Provider value={aggregated$}>
        <Button children={text} />
      </Provider>
    );

    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />,
    );

    expect(aggregated$).toEmit([
      value(
        {
          ref$: wrapper.container.querySelector('button'),
          props$: { children: 'Click me!' },
        },
        { current: true },
      ),
    ]);
  });
});
