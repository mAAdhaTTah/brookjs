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

    outputFile (file) {
        return fs.outputFile(path.join(this.cwd, file.path), file.contents);
    }

    appendFile (file) {
        return fs.appendFile(path.join(this.cwd, file.path), file.contents);
    }

    getBarrel(barrel) {
        return fs.readFile(path.join(this.cwd, 'src', barrel, 'index.js'), 'utf-8');
    }

    getFile(file, barrel) {
        return fs.readFile(path.join(this.cwd, 'src', barrel, file), 'utf-8');
    }

    run(command) {
        const args = [this.bin, ...command.split(' ')];

        this.spawned = spawn(args[0], args.slice(1), { cwd: this.cwd });
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

    async *filesToFixtures(files) {
        for (const { filename, fixture } of files) {
            let content = '';
            const target = path.join(__dirname, '..', '.fixtures', fixture);

            try {
                content = (await fs.readFile(target)).toString();
            } catch (e) {
                // create new empty fixture
                await fs.writeFile(target, content);
            }

            yield { filename, content };
        }
    }

    getInstanceForType(name, barrel) {
        switch (barrel) {
            case 'actions':
                return `export const ${constant(name)} = '${constant(name)}';

export const ${name} = () => ({
    type: ${constant(name)}
});`;
            case 'components':
                return `import { component, children, render } from 'brookjs';
import template from './${name}.hbs';

export default component({
    children: children({

    }),
    events: events({

    }),
    render: render(template)
})`;
            case 'deltas':
                return `import { Kefir } from 'brookjs';
import {} from '../actions';
import {} from '../selectors';

export default ({ /* services */ }) => (actions$, state$) => {
    // Create delta streams.

    return Kefir.merge([
        // Add new streams here.
    ]);
};`;
            case 'reducers':
                return `import { combineActionReducers } from 'brookjs';
import { } from '../actions';

const defaults = {};

const cond = [

];

export default combineActionReducers(cond, defaults);`;
            case 'selectors':
                return `export const ${name} = state => ({});`;
            case 'services':
                return `import { Kefir } from 'brookjs';

export default () => Kefir.never();`;
            default:
                throw new Error('Invalid barrel ' + barrel);
        }
    }

    getExportForType(name, barrel) {
        switch (barrel) {
            case 'actions':
            case 'selectors':
                return `export * from './${name}';`;
            case 'components':
            case 'deltas':
            case 'reducers':
            case 'services':
                return `export { default as ${name} } from './${name}';`;
            default:
                throw new Error('Invalid barrel ' + barrel);
        }
    }
}

setWorldConstructor(CliWorld);
