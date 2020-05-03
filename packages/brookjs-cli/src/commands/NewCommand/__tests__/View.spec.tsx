/* eslint-env jest */
import React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { AppContext } from 'ink';
import { RootJunction } from 'brookjs-silt';
import View from '../View';

const { value } = KTU;

describe('NewCommand#View', () => {
  afterEach(cleanup);

  describe('configure step', () => {
    it('should show an error when no name provided', () => {
      const { lastFrame, rerender } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="version"
            cwd="/path/to/cwd"
            config={{
              name: null,
              version: null,
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();

      rerender(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="creating"
            configuring="version"
            cwd="/path/to/cwd"
            config={{
              name: null,
              version: null,
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the first question', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="version"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: null,
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the first question with version provided', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="version"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the second question', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="description"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the second question with description provided', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="description"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the third question', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="dir"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the third question with dir provided', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="dir"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the fourth question', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="license"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should show the fourth question with license provided', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="license"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should respond to input', () => {
      let r$;
      const { stdin } = render(
        <RootJunction root$={(root$: any) => void (r$ = root$)}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="configure"
            configuring="version"
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: null,
              description: null,
              dir: null,
              license: null,
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(r$).toEmit(
        [
          value({ type: 'INPUT', payload: { value: 'test word' } }),
          value({ type: 'SUBMIT' }),
        ],
        () => {
          stdin.write('test word');
          stdin.write('\r');
        },
      );
    });
  });

  describe('confirm step', () => {
    it('should display the current configruation', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="confirm"
            configuring={null}
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should respond to confirm', () => {
      let r$;

      const element = (
        <RootJunction root$={root$ => void (r$ = root$)}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="confirm"
            configuring={null}
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>
      );
      const { stdin, rerender } = render(element);

      // @TODO(mAAdhaTTah) needed to flush effects
      // remove when this is fixed: https://github.com/vadimdemedes/ink-testing-library/issues/3
      rerender(element);

      expect(r$).toEmit(
        [value({ type: 'CONFIRM', payload: { value: true } })],
        () => {
          stdin.write('\r');
        },
      );
    });

    it('should respond to confirm with false if selected', () => {
      let r$;
      const { stdin } = render(
        <RootJunction root$={root$ => void (r$ = root$)}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="confirm"
            configuring={null}
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(r$).toEmit(
        [value({ type: 'CONFIRM', payload: { value: false } })],
        () => {
          stdin.write('\u001B[B');
          stdin.write('\r');
        },
      );
    });
  });

  describe('cancelled', () => {
    it('should render cancelled message and call exit', done => {
      const exit = jest.fn();
      const { lastFrame } = render(
        <AppContext.Provider value={{ exit }}>
          <RootJunction root$={jest.fn()}>
            <View
              error={null}
              logs={[]}
              result={null}
              step="cancelled"
              configuring={null}
              cwd="/path/to/cwd"
              config={{
                name: 'test-app',
                version: '1.0.0',
                description: 'A test application',
                dir: 'client',
                license: 'ISC',
                typescript: false,
              }}
            />
          </RootJunction>
        </AppContext.Provider>,
      );

      setTimeout(() => {
        expect(lastFrame()).toMatchSnapshot();
        expect(exit).toHaveBeenCalledTimes(1);

        done();
      }, 10);
    });
  });

  describe('creating', () => {
    it('should render spinner', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[]}
            result={null}
            step="creating"
            configuring={null}
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });

    it('should render all logs', () => {
      const { lastFrame } = render(
        <RootJunction root$={jest.fn()}>
          <View
            error={null}
            logs={[
              {
                level: 'notice',
                msg: 'This is a notice mesasge.',
              },
              {
                level: 'warn',
                msg: 'This is a warn message.',
              },
              {
                level: 'error',
                msg: 'This is a error message.',
              },
              {
                level: 'ok',
                msg: 'This is a ok message.',
              },
            ]}
            result={null}
            step="creating"
            configuring={null}
            cwd="/path/to/cwd"
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC',
              typescript: false,
            }}
          />
        </RootJunction>,
      );

      expect(lastFrame()).toMatchSnapshot();
    });
  });

  describe('error', () => {
    it('should render error message and call exit', done => {
      const exit = jest.fn();
      const error = new Error('Creating failed');
      const { lastFrame } = render(
        <AppContext.Provider value={{ exit }}>
          <RootJunction root$={jest.fn()}>
            <View
              error={error}
              logs={[]}
              result={null}
              step="error"
              configuring={null}
              cwd="/path/to/cwd"
              config={{
                name: 'test-app',
                version: '1.0.0',
                description: 'A test application',
                dir: 'client',
                license: 'ISC',
                typescript: false,
              }}
            />
          </RootJunction>
        </AppContext.Provider>,
      );

      setTimeout(() => {
        expect(lastFrame()).toMatchSnapshot();
        expect(exit).toHaveBeenCalledTimes(1);
        expect(exit.mock.calls[0][0]).toBe(error);

        done();
      }, 10);
    });
  });

  describe('complete', () => {
    it('should render complete message and call exit', done => {
      const exit = jest.fn();
      const { lastFrame } = render(
        <AppContext.Provider value={{ exit }}>
          <RootJunction root$={jest.fn()}>
            <View
              error={null}
              logs={[]}
              result={{ success: true, time: Date.now(), actions: [] }}
              step="complete"
              configuring={null}
              cwd="/path/to/cwd"
              config={{
                name: 'test-app',
                version: '1.0.0',
                description: 'A test application',
                dir: 'client',
                license: 'ISC',
                typescript: false,
              }}
            />
          </RootJunction>
        </AppContext.Provider>,
      );

      setTimeout(() => {
        expect(lastFrame()).toMatchSnapshot();
        expect(exit).toHaveBeenCalledTimes(1);

        done();
      }, 10);
    });
  });
});
