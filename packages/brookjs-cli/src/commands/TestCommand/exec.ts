import path from 'path';
import Kefir, { Stream, Property } from 'kefir';
import jest from 'jest';
import { Maybe } from 'brookjs-types';
import { project } from '../../services';
import { testRun } from './actions';
import { RC } from './RC';
import { State, Action } from './types';

const getDir = (rc: Maybe<RC>) => rc?.dir ?? 'src';

const exec = (
  action$: Stream<Action, never>,
  state$: Property<State, never>
): Stream<Action, never> =>
  state$
    .take(1)
    .flatMap(state =>
      Kefir.combine({
        dir: Kefir.constant(getDir(state.rc)),
        coverage: Kefir.constant(state.coverage),
        watch: Kefir.constant(state.watch),
        jest: Kefir.constant(state.rc?.jest ?? {}),
        setupTests: project
          .extension$(state.cwd)
          .flatMap(testExtension =>
            project.setupTestsConfig$(
              state.cwd,
              getDir(state.rc),
              testExtension
            )
          )
      })
    )
    .map(({ dir, coverage, watch, jest, setupTests }) => {
      const argv = [];

      const config: any = {
        roots: [path.join('<rootDir>', dir)],
        collectCoverageFrom: [
          `${dir}/**/*.{js,jsx,ts,tsx}`,
          `!${dir}/**/*.d.ts`
        ],
        setupFilesAfterEnv: setupTests,
        testMatch: [
          // Anything with `spec/test` is a test file
          // Don't glob `__tests__` because test utils
          `<rootDir>/${dir}/**/*.{spec,test}.{js,jsx,ts,tsx}`
        ],
        testEnvironment: 'jest-environment-jsdom-fourteen',
        transform: {
          '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
          // require.resolve is relative to brookjs-cli/dist
          '^.+\\.css$': require.resolve(
            path.join(__dirname, '..', 'jest', 'cssTransform.js')
          ),
          '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': require.resolve(
            path.join(__dirname, '..', 'jest', 'fileTransform.js')
          )
        },
        transformIgnorePatterns: [
          '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
          '^.+\\.module\\.(css|sass|scss)$'
        ],
        moduleNameMapper: {
          '^react-native$': 'react-native-web',
          '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
        },
        moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'node']
      };

      for (const [key, value] of Object.entries(jest)) {
        config[key] = value;
      }

      argv.push(`--config`, JSON.stringify(config));
      argv.push('--env', 'jsdom');

      if (coverage) {
        argv.push('--coverage');
      }

      if (watch) {
        argv.push('--watch');
      }

      return argv;
    })
    .flatMap(argv =>
      Kefir.stream(emitter => {
        process.env.NODE_ENV = 'test';
        process.env.BABEL_ENV = 'test';
        emitter.value(testRun.request());
        jest
          .run(argv)
          .then(() => emitter.value(testRun.success()))
          .catch(() => emitter.value(testRun.failure()));
      })
    );

export default exec;
