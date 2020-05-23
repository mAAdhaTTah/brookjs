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

const Instance: React.FC<Props & { central$: Pool<any, never> }> = ({
  children,
  central$,
}) => (
  <Provider value={central$}>
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
    const central$ = Kefir.pool<any, never>();
    const wrapper = render(
      <Instance children={'Click me!'} central$={central$} />,
    );

    expect(central$).toEmit([
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
    const central$ = Kefir.pool<any, never>();
    const wrapper = render(
      <Instance children={'Click me!'} central$={central$} />,
    );

    wrapper.unmount();

    expect((central$ as any)._curSources).toHaveLength(0);
  });

  it('should replace central$', () => {
    const central$ = Kefir.pool<any, never>();
    const newcentral$ = Kefir.pool<any, never>();
    const wrapper = render(
      <Instance children={'Click me!'} central$={central$} />,
    );

    wrapper.rerender(
      <Instance children={'Click me!'} central$={newcentral$} />,
    );

    expect((central$ as any)._curSources).toHaveLength(0);
    expect((newcentral$ as any)._curSources).toHaveLength(1);

    expect(newcentral$).toEmit([
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
    const central$ = Kefir.pool<any, never>();
    const wrapper = render(
      <Instance children={'Click me!'} central$={central$} />,
    );
    const ref$ = wrapper.container.querySelector('button');

    expect(central$).toEmit(
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
          <Instance children={'Click me too!'} central$={central$} />,
        );
      },
    );
  });

  it('should work with components that can take a ref directly', () => {
    const central$ = Kefir.pool<any, never>();
    const Button = withRef$(refback)('button');
    const Instance: React.FC<any> = ({ text, central$ }) => (
      <Provider value={central$}>
        <Button children={text} />
      </Provider>
    );

    const wrapper = render(<Instance text={'Click me!'} central$={central$} />);

    expect(central$).toEmit([
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
