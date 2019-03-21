const path = require('path');
const os = require('os');
const { spawn } = require('node-pty');
const fs = require('fs-extra');
const { setWorldConstructor } = require('cucumber');
const { constant } = require('change-case');

const keypresses = {
  ENTER: '\r',
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41'
};

class CliWorld {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;
    this.bin = path.join(__dirname, '..', '..', 'bin', 'beaver.js');
    this.cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-'));
    this.snapshot = {};
    this.output = {
      stdout: '',
      stderr: '',
      closed: false,
      code: null
    };
    this.defaultRc = {
      path: '.beaverrc.js',
      contents: `export const dir = 'src';`
    };
  }

  async createProjectWith(files) {
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

  outputFile(file) {
    return fs.outputFile(path.join(this.cwd, file.path), file.contents);
  }

  appendFile(file) {
    return fs.appendFile(path.join(this.cwd, file.path), file.contents);
  }

  getFile(file, barrel) {
    return fs.readFile(path.join(this.cwd, 'src', barrel, file), 'utf-8');
  }

  run(command) {
    this.spawn(this.bin, command);
  }

  spawn(bin, command) {
    this.output = {
      stdout: '',
      stderr: '',
      closed: false,
      code: null
    };

    this.spawned = spawn(bin, command.split(' '), {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      encoding: 'utf-8',
      cwd: this.cwd,
      env: process.env
    });

    this.spawned.on('data', data => {
      // console.log(data.toString());
      this.output.stdout += data.toString();
    });

    this.spawned.on('exit', code => {
      this.output.closed = true;
      this.output.code = code;
    });
  }

  async respondTo(questions) {
    for (const { text, response } of questions) {
      await this.outputMatches(text);
      const keys = response.replace(
        /KEY:(.*)/,
        val => keypresses[val.split(':')[1]]
      );

      for (const key of keys) {
        this.spawned.write(key);
        await this.wait(10);
      }

      this.spawned.write('\r');
    }
  }

  outputMatches(matches) {
    return new Promise(resolve => {
      const loop = () => {
        if (this.output.stdout.trim().includes(matches)) {
          resolve();
        } else {
          setTimeout(loop, 200);
        }
      };

      loop();
    });
  }

  async ended() {
    while (this.output.closed !== true) {
      await this.wait(200);
    }
  }

  wait(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
}

setWorldConstructor(CliWorld);
