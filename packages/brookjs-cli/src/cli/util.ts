import { useContext, useEffect } from 'react';
import { AppContext } from 'ink';
import { RC } from './RC';

export type Maybe<T> = T | null | undefined;

export const errorToNull = (e: Maybe<RC | Error>): Maybe<RC> => {
  if (e instanceof Error) {
    return null;
  }

  return e;
};

export const useExit = (error?: Error) => {
  const { exit } = useContext(AppContext);

  useEffect(() => {
    exit(error);
  }, [exit]);
};
