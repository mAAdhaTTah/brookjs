import * as path from 'path';
import * as os from 'os';
import { spawn, IPty } from 'node-pty';
import * as fs from 'fs-extra';
import { setWorldConstructor, World } from 'cucumber';

const keypresses = {
  ENTER: '\r',
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41'
};

declare module 'cucumber' {
  interface World {
    cwd: string;

    snapshot: {
      testname: string;
      filename: string;
    };

    process: {
      stdout: string;
      closed: boolean;
      code: number | null;
    };

    defaultRc: File;

    spawned?: IPty;

    createProject(type: 'js' | 'ts'): Promise<void>;

    outputFile(file: File): Promise<void>;

    appendFile(file: File): Promise<void>;

    getFile(file: string, barrel: string): Promise<string>;

    run(command: string): void;

    spawn(bin: string, command: string): void;

    respondTo(questions: Question[]): Promise<void>;

    untilOutputContains(matches: string): Promise<void>;

    outputContains(contains: string): boolean;

    untilEnded(): Promise<void>;

    wait(time: number): Promise<void>;
  }
}

type File = {
  path: string;
  contents: string;
};

export type Question = {
  text: string;
  response: string;
};

class CliWorld implements World {
  cwd: string = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-'));

  snapshot: {
    testname: string;
    filename: string;
  } = {
    testname: '',
    filename: ''
  };

  process: {
    stdout: string;
    closed: boolean;
    code: number | null;
  } = {
    stdout: '',
    closed: false,
    code: null
  };

  defaultRc: File = {
    path: '.beaverrc.js',
    contents: `export const dir = 'src';`
  };

  spawned?: IPty;

  async createProject(type: 'js' | 'ts') {
    this.spawn(
      'tar',
      `-C ${this.cwd} -zxvf ${path.join(__dirname, `test-app-${type}.tar.gz`)}`
    );
    this.cwd = path.join(this.cwd, `test-app-${type}`);

    await this.untilEnded();
  }

  outputFile(file: File) {
    return fs.outputFile(path.join(this.cwd, file.path), file.contents);
  }

  appendFile(file: File) {
    return fs.appendFile(path.join(this.cwd, file.path), file.contents);
  }

  async prependFile(file: File) {
    const targetPath = path.join(this.cwd, file.path);
    const contents = await fs.readFile(targetPath, 'utf-8');
    return fs.outputFile(targetPath, file.contents + contents);
  }

  getFile(file: string, barrel: string) {
    return fs.readFile(path.join(this.cwd, 'src', barrel, file), 'utf-8');
  }

  run(command: string) {
    this.spawn('npx', `beaver ${command}`);
  }

  spawn(bin: string, command: string) {
    this.process = {
      stdout: '',
      closed: false,
      code: null
    };

    // Remove constants that indicate it's in CI.
    // This is because Ink will only emit the last frame in CI.
    const {
      CI,
      CONTINUOUS_INTEGRATION,
      TRAVIS,
      BUILD_NUMBER,
      RUN_ID,
      TRAVIS_PULL_REQUEST,
      ...env
    } = process.env as any;

    const spawned = (this.spawned = spawn(bin, command.split(' '), {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      encoding: 'utf-8',
      cwd: this.cwd,
      env
    }));

    spawned.on('data', data => {
      this.process.stdout += data;
    });

    spawned.on('exit', code => {
      this.process.closed = true;
      this.process.code = code;
    });
  }

  async respondTo(questions: Question[]) {
    if (!this.spawned) {
      throw new Error('Attempted to respond to questions before spawning cli.');
    }

    for (const { text, response } of questions) {
      await this.untilOutputContains(text);
      const keys = response.replace(
        /KEY:(.*)/,
        val => keypresses[val.split(':')[1] as keyof typeof keypresses]
      );

      for (const key of keys) {
        this.spawned.write(key);
        await this.wait(10);
      }

      this.spawned.write('\r');
    }
  }

  async untilOutputContains(matches: string) {
    while (!this.outputContains(matches) && !this.process.closed) {
      await this.wait(200);
    }

    if (!this.outputContains(matches)) {
      throw new Error(`Output closed before match found.`);
    }
  }

  outputContains(contains: string) {
    return this.process.stdout.trim().includes(contains);
  }

  async untilEnded() {
    while (this.process.closed !== true) {
      await this.wait(200);
    }
  }

  wait(time: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, time);
    });
  }
}

setWorldConstructor(CliWorld);
