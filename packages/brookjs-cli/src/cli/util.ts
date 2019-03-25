import { Nullable } from 'typescript-nullable';
import { RC } from './RC';
import { useContext, useEffect } from 'react';
import { AppContext } from 'ink';

export const errorToNull = (e: Nullable<RC | Error>): Nullable<RC> => {
  if (e instanceof Error) {
    return null;
  }

  return e;
};

export const useExit = (error?: Error) => {
  const { exit } = useContext(AppContext);

  useEffect(() => {
    (exit as any)(error);
  }, [exit]);
};
