/* eslint-env mocha */
import { expect, use } from 'chai';
import Kefir from 'kefir';
import React from 'react';
import { chaiPlugin } from 'brookjs-desalinate';
import withRef$ from '../withRef';
import { Provider } from '../context';
import { render } from 'react-testing-library';

const { plugin, value } = chaiPlugin({ Kefir });

use(plugin);

const refback = (ref$, props$) => Kefir.combine({ props$ }, { ref$ });

const _Button = ({ text }, ref) => <button ref={ref}>{text}</button>;

const Button = withRef$(refback)(_Button);

const Instance = ({ text, aggregated$ }) => (
  <Provider value={aggregated$}>
    <Button text={text} />
  </Provider>
);

describe('withRef$', () => {
  it('should emit value from ref$', () => {
    const aggregated$ = Kefir.pool();
    const wrapper = render(
      <Instance text={'Click me!'} aggregated$={aggregated$} />
    );

    expect(aggregated$).to.emit([
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

    expect(aggregated$._curSources).to.have.lengthOf(0);
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

    expect(aggregated$._curSources).to.have.lengthOf(0);
    expect(newAggregated$._curSources).to.have.lengthOf(1);

    expect(newAggregated$).to.emit([
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

    expect(aggregated$).to.emit(
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
});
