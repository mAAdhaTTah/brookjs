import { useEffect } from 'react';
import { useApp } from 'ink';

export class ExitError extends Error {
  public code: number;

  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
  }
}

export const useExit = (error?: Error) => {
  const { exit } = useApp();

  useEffect(() => {
    exit(error);
  }, [exit, error]);
};
