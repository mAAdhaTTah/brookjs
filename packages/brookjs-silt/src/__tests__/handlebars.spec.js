import { test } from 'brookjs-desalinate';
import renderToString from 'diffhtml-render-to-string';
import basic from 'handlebars-spec/spec/basic.json'; // eslint-disable-line import/no-internal-modules
import { parse, generate } from '../index';

const runSpec = spec => {
    test.skip(spec[0].description, t => {
        for (const test of spec) {
            t.test(test.it, t => {
                t.plan(1);

                const vdom = generate(parse(test.template), test.data);
                const actual = renderToString(vdom);

                t.deepEquals(actual, test.expected);
            });
        }
    });
};

runSpec(basic);
