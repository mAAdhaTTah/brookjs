import { Nullable } from 'typescript-nullable';
import { useContext, useEffect } from 'react';
import { AppContext } from 'ink';
import { RC } from './RC';

export const errorToNull = (e: Nullable<RC | Error>): Nullable<RC> => {
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
