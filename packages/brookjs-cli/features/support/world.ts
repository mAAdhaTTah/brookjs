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
    bin: string;

    cwd: string;

    snapshot: {
      testname: string;
      filename: string;
    };

    output: {
      stdout: string;
      closed: boolean;
      code: number | null;
    };

    defaultRc: File;

    spawned?: IPty;

    createProjectWith(files: File[]): Promise<void>;

    createProject(): Promise<void>;

    outputFile(file: File): Promise<void>;

    appendFile(file: File): Promise<void>;

    getFile(file: string, barrel: string): Promise<string>;

    run(command: string): void;

    spawn(bin: string, command: string): void;

    respondTo(questions: Question[]): Promise<void>;

    outputMatches(matches: string): Promise<void>;

    ended(): Promise<void>;

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
  bin: string = path.join(__dirname, '..', '..', 'bin', 'beaver.js');

  cwd: string = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-'));

  snapshot: {
    testname: string;
    filename: string;
  } = {
    testname: '',
    filename: ''
  };

  output: {
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

  async createProjectWith(files: File[]) {
    const create = [this.defaultRc, ...files];

    await Promise.all(create.map(file => this.outputFile(file)));
  }

  async createProject() {
    this.run('new test-app --yes');
    this.cwd += '/test-app';

    await this.ended();

    this.spawn('npm', 'install');

    await this.ended();
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
    this.spawn(this.bin, command);
  }

  spawn(bin: string, command: string) {
    this.output = {
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
      this.output.stdout += data;
    });

    spawned.on('exit', code => {
      this.output.closed = true;
      this.output.code = code;
    });
  }

  async respondTo(questions: Question[]) {
    if (!this.spawned) {
      throw new Error('Attempted to respond to questions before spawning cli.');
    }

    for (const { text, response } of questions) {
      await this.outputMatches(text);
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

  async outputMatches(matches: string) {
    while (!this.output.stdout.trim().includes(matches)) {
      await this.wait(200);
    }
  }

  async ended() {
    while (this.output.closed !== true) {
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
