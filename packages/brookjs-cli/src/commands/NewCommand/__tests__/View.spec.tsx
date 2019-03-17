import React from 'react';
import { render } from 'ink-testing-library';
import { AppContext } from 'ink';
import sinon from 'sinon';
import { expect, use } from 'chai';
import { RootJunction } from 'brookjs-silt';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import chaiJestSnapshot from 'chai-jest-snapshot';
import View from '../View';

const { plugin, value } = chaiPlugin({ Kefir });
use(plugin);
use(chaiJestSnapshot);

describe('NewCommand#View', () => {
  before(function() {
    chaiJestSnapshot.resetSnapshotRegistry();
  });

  beforeEach(function() {
    chaiJestSnapshot.configureUsingMochaContext(this);
  });

  describe('configure step', () => {
    it('should show an error when no name provided', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="version"
          config={{
            name: null,
            version: null,
            description: null,
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the first question', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="version"
          config={{
            name: 'test-app',
            version: null,
            description: null,
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the first question with version provided', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="version"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: null,
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the second question', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="description"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: null,
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the second question with description provided', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="description"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the third question', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="dir"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: null,
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the third question with dir provided', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="dir"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: 'client',
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the fourth question', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="license"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: 'client',
            license: null
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should show the fourth question with license provided', () => {
      const { lastFrame, unmount } = render(
        <View
          step="configure"
          configuring="license"
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: 'client',
            license: 'ISC'
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should respond to input', () => {
      let r$;
      const { stdin } = render(
        <RootJunction
          root$={(root$: any) => {
            r$ = root$;
          }}
        >
          <View
            step="configure"
            configuring="version"
            config={{
              name: 'test-app',
              version: null,
              description: null,
              dir: null,
              license: null
            }}
          />
        </RootJunction>
      );

      expect(r$).to.emit(
        [
          value({ type: 'INPUT', payload: { value: 'test word' } }),
          value({ type: 'SUBMIT' })
        ],
        () => {
          stdin.write('test word');
          stdin.write('\r');
        }
      );
    });
  });

  describe('confirm step', () => {
    it('should display the current configruation', () => {
      const { lastFrame, unmount } = render(
        <View
          step="confirm"
          configuring={null}
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: 'client',
            license: 'ISC'
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });

    it('should respond to confirm', () => {
      let r$;
      const { stdin } = render(
        <RootJunction
          root$={(root$: any) => {
            r$ = root$;
          }}
        >
          <View
            step="confirm"
            configuring={null}
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC'
            }}
          />
        </RootJunction>
      );

      expect(r$).to.emit(
        [value({ type: 'CONFIRM', payload: { value: true } })],
        () => {
          stdin.write('\r');
        }
      );
    });

    it('should respond to confirm with false if selected', () => {
      let r$;
      const { stdin } = render(
        <RootJunction
          root$={(root$: any) => {
            r$ = root$;
          }}
        >
          <View
            step="confirm"
            configuring={null}
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC'
            }}
          />
        </RootJunction>
      );

      expect(r$).to.emit(
        [value({ type: 'CONFIRM', payload: { value: false } })],
        () => {
          stdin.write('\u001B[B');
          stdin.write('\r');
        }
      );
    });
  });

  describe('cancelled', () => {
    it('should render cancelled message and call exit', done => {
      const exit = sinon.spy();
      const { lastFrame, unmount } = render(
        <AppContext.Provider value={{ exit }}>
          <View
            step="cancelled"
            configuring={null}
            config={{
              name: 'test-app',
              version: '1.0.0',
              description: 'A test application',
              dir: 'client',
              license: 'ISC'
            }}
          />
        </AppContext.Provider>
      );

      setTimeout(() => {
        expect(lastFrame()).to.matchSnapshot();
        expect(exit.calledOnce).to.equal(true);

        unmount();

        done();
      }, 10);
    });
  });

  describe('creating', () => {
    it('should render spinner during creating', () => {
      const { lastFrame, unmount } = render(
        <View
          step="creating"
          configuring={null}
          config={{
            name: 'test-app',
            version: '1.0.0',
            description: 'A test application',
            dir: 'client',
            license: 'ISC'
          }}
        />
      );

      expect(lastFrame()).to.matchSnapshot();

      unmount();
    });
  });
});
