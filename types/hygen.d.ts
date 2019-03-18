declare module 'hygen' {
  interface Logger {
    ok: (msg: string) => void;
    notice: (msg: string) => void;
    warn: (msg: string) => void;
    err: (msg: string) => void;
    log: (msg: string) => void;
    colorful: (msg: string) => void;
  }

  interface Prompter {
    prompt(a: any): Promise<any>;
  }

  interface RunnerConfig {
    exec: (sh: string, body: string) => void;
    templates: string;
    cwd: string;
    logger: Logger;
    debug: boolean;
    helpers?: object;
    createPrompter: () => Prompter;
  }

  interface RunnerResult {
    success: boolean;
    time: number;
    actions: any[];
    failure?: {
      message: string;
      availableActions: string[];
    };
  }

  export const runner: (
    argv: string[],
    config: RunnerConfig
  ) => Promise<RunnerResult>;
}
