/* eslint-env jest */
import Kefir from 'kefir';
import { toJunction } from 'brookjs-silt';
import React from 'react';
import { fireEvent } from 'react-testing-library';
import jestPlugin from '../jestPlugin';

const { extensions, value } = jestPlugin({ Kefir });
expect.extend(extensions);

describe('jestPlugin', () => {
  describe('toEmitFromDelta', () => {
    const action = { type: 'DO' };
    const state = { active: true };
    const delta = ({ respond }) => (action$, state$) =>
      Kefir.zip([action$, state$]).flatMap(respond);

    it('should send state & action to delta', () => {
      const services = {
        respond: ([action, state]) => Kefir.constant({ action, state })
      };

      expect(delta(services)).toEmitFromDelta(
        [[0, value({ action, state })]],
        send => {
          send(action, state);
        }
      );
    });

    it('should provide tick function', () => {
      const services = {
        respond: ([action, state]) => Kefir.later(100, { action, state })
      };

      expect(delta(services)).toEmitFromDelta(
        [[100, value({ action, state })], [200, value({ action, state })]],
        (send, tick) => {
          // One tick
          send(action, state);
          tick(100);

          // Broken up ticks
          send(action, state);
          tick(50);
          tick(50);
        },
        {}
      );
    });

    it('should drain queue', () => {
      const services = {
        respond: ([action, state]) => Kefir.later(100, { action, state })
      };

      expect(delta(services)).toEmitFromDelta(
        [[100, value({ action, state })]],
        send => {
          send(action, state);
        },
        {
          timeLimit: 100
        }
      );
    });
  });

  describe('toEmitFromJunction', () => {
    const Component = ({ onClick }) => (
      <button onClick={onClick}>Click me!</button>
    );

    const AsJunction = toJunction({
      onClick: e$ => e$.map(() => ({ type: 'CLICK' }))
    })(Component);

    it('should emit event from Component', () => {
      expect(<AsJunction />).toEmitFromJunction(
        [[0, value({ type: 'CLICK' })], [10, value({ type: 'CLICK' })]],
        ({ container }, tick) => {
          fireEvent.click(container.firstChild);
          tick(10);
          fireEvent.click(container.firstChild);
        }
      );
    });
  });
});
