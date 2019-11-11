import { useContext, useEffect } from 'react';
import { AppContext } from 'ink';

export type Maybe<T> = T | null | undefined;

export const errorToNull = <T>(e: Maybe<T | Error>): Maybe<T> => {
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
