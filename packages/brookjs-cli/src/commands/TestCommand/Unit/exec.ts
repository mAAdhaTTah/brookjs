import path from 'path';
import Kefir, { Stream, Property } from 'kefir';
import jest from 'jest';
import { Maybe } from 'brookjs-types';
import * as project from '../../../project';
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
        updateSnapshot: Kefir.constant(state.updateSnapshot),
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
    .map(({ dir, coverage, watch, updateSnapshot, jest, setupTests }) => {
      const argv = [];

      const config: any = {
        roots: [path.join('<rootDir>', dir)],
        collectCoverageFrom: [
          `${dir}/**/*.{js,jsx,mjs,ts,tsx}`,
          `!${dir}/index.{js,jsx,mjs,ts,tsx}`,
          `!${dir}/**/__tests__/**`,
          `!${dir}/**/*.d.ts`
        ],
        setupFilesAfterEnv: setupTests,
        testMatch: [
          // Anything with `spec/test` is a test file
          // Don't glob `__tests__` because test utils
          `<rootDir>/${dir}/**/*.{spec,test}.{js,jsx,mjs,ts,tsx}`
        ],
        testEnvironment: 'jest-environment-jsdom-fourteen',
        transform: {
          // require.resolve is relative to brookjs-cli/dist
          '^.+\\.(js|jsx|ts|tsx)$': require.resolve(
            path.join(__dirname, '..', 'jest', 'babelTransform.js')
          ),
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
          '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
          // @TODO(mAAdhaTTah) remove when https://github.com/storybookjs/storybook/pull/9292 is merged
          'react-syntax-highlighter/dist/esm/(.*)':
            'react-syntax-highlighter/dist/cjs/$1',
          '@babel/runtime/helpers/esm/(.*)': '@babel/runtime/helpers/$1'
        },
        moduleFileExtensions: ['js', 'jsx', 'json', 'mjs', 'ts', 'tsx', 'node']
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

      if (updateSnapshot) {
        argv.push('-u');
      }

      return argv;
    })
    .flatMap(argv =>
      Kefir.stream(emitter => {
        process.env.BABEL_ENV = process.env.NODE_ENV = 'test';
        emitter.value(testRun.request());
        jest
          .run(argv)
          .then(() => emitter.value(testRun.success()))
          .catch(() => emitter.value(testRun.failure()));
      })
    );

export default exec;
