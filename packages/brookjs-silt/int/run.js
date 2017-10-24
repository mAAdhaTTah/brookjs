/* eslint-env mocha */
import path from 'path';
import fs from 'fs';
import glob from 'glob';
import Kefir from 'kefir';
import hbs from 'handlebars';
import { expect } from 'chai';
import { Internals } from 'diffhtml/dist/cjs';
import { parse, generate } from '../es';

describe('integration', done => {
    Kefir.fromNodeCallback(callback => glob(path.join(__dirname, '*.int.hbs'), callback))
        .flatten()
        .observe({
            value: filename => {
                const [, name] = filename.match(/(\w+)\.int\.hbs/);

                it(name, () => {
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

                    expect(actual).to.deep.equal(expected);
                });
            },
            end: done
        });
});
