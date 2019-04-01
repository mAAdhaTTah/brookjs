declare module 'ink-testing-library' {
  import * as React from 'react';

  interface MockStdIn {
    write(str: string): void;
  }

  interface Helpers {
    rerender(tree: React.ReactNode): void;
    lastFrame(): string;
    unmount(): void;
    stdin: MockStdIn;
  }

  export function render(node: React.ReactNode): Helpers;

  export function cleanup(): void;
}
