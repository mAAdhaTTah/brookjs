declare module 'ink-testing-library' {
  interface MockStdIn {
    write(str: string): void;
  }

  interface Helpers {
    rerender(): void;
    lastFrame(): string;
    unmount(): void;
    stdin: MockStdIn;
  }

  export function render(node: React.ReactNode): Helpers;
}
