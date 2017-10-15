import path from 'path';
import fs from 'fs';
import glob from 'glob';
import Kefir from 'kefir';
import hbs from 'handlebars';
import { test } from 'brookjs-desalinate';
import { Internals } from 'diffhtml/dist/cjs';
import { parse, generate } from '../es';

test('integration', t =>
    Kefir.fromNodeCallback(callback => glob(path.join(__dirname, '*.int.hbs'), callback))
        .flatten()
        .map(filename => {
            const [, name] = filename.match(/(\w+)\.int\.hbs/);

            t.test(name, t => {
                t.plan(1);

                const contents = fs.readFileSync(filename).toString();
                const handlebars = context => {
                    const func = hbs.compile(contents);
                    const text = func(context);
                    return Internals.parse(text);
                };
                const silt = generate(parse(contents));
                const context = require(`./${name}.json`);

                const actual = silt(context);
                const expected = handlebars(context);

                t.deepEqual(actual, expected);
            });
        })
);
