const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { setWorldConstructor } = require('cucumber');
const { constant } = require('change-case');

const keypresses = {
    ENTER: '\x0D',
    DOWN: '\x1B\x5B\x42',
    UP: '\x1B\x5B\x41'
};

class CliWorld {
    constructor ({ attach, parameters }) {
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

    outputFile (file) {
        return fs.outputFile(path.join(this.cwd, file.path), file.contents);
    }

    appendFile (file) {
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

        this.spawned = spawn(bin, command.split(' '), { cwd: this.cwd });
        this.spawned.stdin.setEncoding('utf-8');

        this.spawned.stdout.on('data', data => {
            this.output.stdout += data.toString();
        });

        this.spawned.stderr.on('data', data => {
            this.output.stderr += data.toString();
        });

        this.spawned.on('close', code => {
            this.output.closed = true;
            this.output.code = code;
        });
    }

    async respondTo(questions) {
        for (const { text, response } of questions) {
            await this.outputMatches(text);
            this.spawned.stdin.write(
                response
                    .replace(/KEY:(.*)/, val => keypresses[val.split(':')[1]])
                    + keypresses.ENTER
            );
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

    ended() {
        return new Promise(resolve => {
            const loop = () => {
                if (this.output.closed === true) {
                    resolve(this.output.code);
                } else {
                    setTimeout(loop, 200);
                }
            };

            loop();
        });
    }
}

setWorldConstructor(CliWorld);
