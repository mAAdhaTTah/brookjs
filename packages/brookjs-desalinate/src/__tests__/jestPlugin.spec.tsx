/* eslint-env jest */
import Kefir from 'kefir';
import { toJunction } from 'brookjs-silt';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Delta } from 'brookjs-types';

const { value } = KTU;

describe('jestPlugin', () => {
  describe('toEmitFromDelta', () => {
    const action = { type: 'DO' };
    const state = { active: true };
    let respond = ([action, state]: any) => Kefir.constant({ action, state });
    const delta: Delta<any, any> = (action$, state$) =>
      Kefir.zip([action$, state$]).flatMap(respond);

    it('should send state & action to delta', () => {
      expect(delta).toEmitFromDelta([[0, value({ action, state })]], send => {
        send(action, state);
      });
    });

    it('should provide tick function', () => {
      respond = ([action, state]: any) => Kefir.later(100, { action, state });

      expect(delta).toEmitFromDelta(
        [
          [100, value({ action, state })],
          [200, value({ action, state })],
        ],
        (send, tick) => {
          // One tick
          send(action, state);
          tick(100);

          // Broken up ticks
          send(action, state);
          tick(50);
          tick(50);
        },
        {},
      );
    });

    it('should drain queue', () => {
      respond = ([action, state]: any) => Kefir.later(100, { action, state });

      expect(delta).toEmitFromDelta(
        [[100, value({ action, state })]],
        send => {
          send(action, state);
        },
        {
          timeLimit: 100,
        },
      );
    });
  });

  describe('toEmitFromJunction', () => {
    const Component: React.FC<{
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }> = ({ onClick }) => <button onClick={onClick}>Click me!</button>;

    const AsJunction = toJunction({
      onClick: e$ => e$.map(() => ({ type: 'CLICK' })),
    })(Component);

    it('should emit event from Component', () => {
      expect(<AsJunction />).toEmitFromJunction(
        [
          [0, value({ type: 'CLICK' })],
          [10, value({ type: 'CLICK' })],
        ],
        ({ container }, tick) => {
          fireEvent.click(container.firstElementChild!);
          tick(10);
          fireEvent.click(container.firstElementChild!);
        },
      );
    });
  });
});
