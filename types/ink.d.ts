declare module 'ink' {
  import * as React from 'react';

  interface Disposer {
    (): void;
  }

  interface ColorProps {
    reset?: boolean;
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    inverse?: boolean;
    hidden?: boolean;
    strikethrough?: boolean;

    visible?: boolean;

    black?: boolean;
    red?: boolean;
    green?: boolean;
    yellow?: boolean;
    blue?: boolean;
    magenta?: boolean;
    cyan?: boolean;
    white?: boolean;
    gray?: boolean;
    grey?: boolean;
    blackBright?: boolean;
    redBright?: boolean;
    greenBright?: boolean;
    yellowBright?: boolean;
    blueBright?: boolean;
    magentaBright?: boolean;
    cyanBright?: boolean;
    whiteBright?: boolean;

    bgBlack?: boolean;
    bgRed?: boolean;
    bgGreen?: boolean;
    bgYellow?: boolean;
    bgBlue?: boolean;
    bgMagenta?: boolean;
    bgCyan?: boolean;
    bgWhite?: boolean;
    bgBlackBright?: boolean;
    bgRedBright?: boolean;
    bgGreenBright?: boolean;
    bgYellowBright?: boolean;
    bgBlueBright?: boolean;
    bgMagentaBright?: boolean;
    bgCyanBright?: boolean;
    bgWhiteBright?: boolean;

    children: React.ReactNode;
  }

  interface BoxProps {
    flexDirection?: 'row' | 'column';
  }

  export const StdinContext: React.Context<{ stdin: typeof process.stdin }>;

  export class Color extends React.Component<ColorProps> {}

  export class Box extends React.Component<BoxProps> {}

  interface RenderOptions {
    stdout: typeof process.stdout;
    stdin: typeof process.stdin;
    debug: boolean;
    exitOnCtrlC: boolean;
  }

  export function render(
    node: React.ReactNode,
    options: Partial<RenderOptions>
  ): Disposer;

  export function renderToString(node: React.ReactNode): string;
}
