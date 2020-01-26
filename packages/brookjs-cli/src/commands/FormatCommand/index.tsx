import React, { useEffect } from 'react';
import { Argv } from 'yargs';
import { useDelta, RootJunction } from 'brookjs-silt';
import { EddyReducer, loop } from 'brookjs-eddy';
import {
  ActionType,
  getType,
  createAsyncAction,
  createAction
} from 'typesafe-actions';
import Kefir from 'kefir';
import { Delta, Maybe, unreachable } from 'brookjs-types';
import * as t from 'io-ts';
import { ofType, sampleStateAtAction } from 'brookjs-flow';
import { Box, Color } from 'ink';
import { Command, useExit, ExitError } from '../../cli';
import * as glob from '../../glob';
import { service as fs } from '../../fs';
import { ESLintService } from '../../eslint';
import * as prettier from '../../prettier';

type Args = {};

type State = {
  status: 'init' | 'globbing' | 'formatting' | 'finished' | 'errored';
  cwd: string;
  rc: Maybe<RC>;
  paths: string[];
  results: Record<string, FormatResults>;
  error: Maybe<Error>;
};

type Action = ActionType<typeof glob.actions | typeof actions>;

type RC = t.TypeOf<typeof RC>;

const RC = t.partial({
  dir: t.string
});

type FormatResults = {
  path: string;
  contents: string;
  changed: boolean;
};

const actions = {
  fileFormatted: createAction('FILE_FORMATTED')<FormatResults>(),
  format: createAsyncAction(
    'FORMAT_REQUESTED',
    'FORMAT_SUCCEEDED',
    'FORMAT_FAILED'
  )<void, void, Error>()
};

const reducer: EddyReducer<State, Action> = (
  state = initialState({}, { rc: null, cwd: '/' }),
  action
) => {
  switch (action.type) {
    case getType(glob.actions.format.request):
      return {
        ...state,
        status: 'globbing'
      };
    case getType(glob.actions.format.success):
      return loop(
        { ...state, status: 'formatting', paths: action.payload },
        actions.format.request()
      );
    case getType(actions.fileFormatted):
      return {
        ...state,
        results: {
          ...state.results,
          [action.payload.path]: action.payload
        }
      };
    case getType(actions.format.success):
      return {
        ...state,
        status: 'finished'
      };
    case getType(actions.format.failure):
      return {
        ...state,
        status: 'errored',
        error: action.payload
      };
    default:
      return state;
  }
};

const initialState = (
  args: Args,
  { rc, cwd }: { rc: unknown; cwd: string }
): State => ({
  status: 'init',
  cwd,
  rc: RC.decode(rc).fold(
    () => null,
    rc => rc
  ),
  paths: [],
  results: {},
  error: null
});

const exec: Delta<Action, State> = (action$, state$) => {
  const glob$ = glob.delta(
    action$.thru(ofType(glob.actions.format.request)),
    state$.map(state => ({
      cwd: state.cwd,
      rc: state.rc
    }))
  );

  const format$ = sampleStateAtAction(
    action$,
    state$,
    actions.format.request
  ).flatMap(state => {
    const eslint = ESLintService.create({ cwd: state.cwd, fix: true });

    return Kefir.constant(state.paths)
      .flatten(paths => paths)
      .flatMapConcurLimit(
        file => fs.readFile(file).map(buffer => ({ buffer, file })),
        4
      )
      .flatMap(({ buffer, file }) => prettier.format(file, buffer))
      .flatMap(result =>
        eslint.check(result.path, result.contents).map(r => ({
          path: result.path,
          contents: r.results[0].output ?? result.contents,
          changed: result.changed || r.results[0].output != null
        }))
      )
      .flatMap(result =>
        result.changed
          ? fs.writeFile(result.path, result.contents).map(() => result)
          : Kefir.constant(result)
      )
      .map(actions.fileFormatted)
      .concat(Kefir.constant(actions.format.success()))
      .takeErrors(1)
      .flatMapErrors(err => Kefir.constant(actions.format.failure(err)));
  });

  return Kefir.merge<Action, never>([glob$, format$]);
};

const Errored: React.FC<{ message: string }> = ({ message }) => {
  useExit(new ExitError(1));

  return (
    <Box flexDirection="column">
      <Color red>Failure! Error formatting files.</Color>
      <Color redBright>{message}</Color>
    </Box>
  );
};

const View: React.FC<State> = ({ status, paths, results, error }) => {
  switch (status) {
    case 'init':
    case 'globbing':
    case 'formatting':
      return (
        <Box>
          <Color yellow>Formatting...</Color>
        </Box>
      );
    case 'finished':
      const total = paths.reduce(
        (total, path) => total + (results[path].changed ? 1 : 0),
        0
      );
      return (
        <Box flexDirection="column">
          <Color green>Success! All files have been formatted.</Color>
          <Color greenBright>
            Formatted {total} file{total === 1 ? '' : 's'}
          </Color>
        </Box>
      );
    case 'errored':
      return <Errored message={error?.message ?? 'Unknown error.'} />;
    default:
      return unreachable(status);
  }
};

const FormatCommand: Command<Args> = {
  cmd: 'format',
  describe: 'Format all the files in the brookjs application.',
  builder(yargs: Argv<Args>): Argv<Args> {
    return yargs;
  },

  View: ({ args, rc, cwd }) => {
    const { state, root$, dispatch } = useDelta(
      reducer,
      initialState(args, { rc, cwd }),
      exec
    );

    useEffect(() => {
      dispatch(glob.actions.format.request());
    }, [dispatch]);

    return (
      <RootJunction root$={root$}>
        <View {...state} />
      </RootJunction>
    );
  }
};

export default FormatCommand;
