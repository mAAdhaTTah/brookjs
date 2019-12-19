import { useContext, useEffect } from 'react';
import { AppContext } from 'ink';
import { RCError } from './RC';

export type Maybe<T> = T | null | undefined;

export const rcErrorToNull = <T>(e: Maybe<T | RCError>): Maybe<T> => {
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
