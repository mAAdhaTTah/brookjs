/* eslint-env jest */
import renderToString from 'diffhtml-render-to-string';
import basic from 'handlebars-spec/spec/basic.json'; // eslint-disable-line import/no-internal-modules
import { parse, generate } from '../index';

const runSpec = spec => {
    describe(spec[0].description, () => {
        for (const test of spec) {
            it(test.it, () => {
                const vdom = generate(parse(test.template), test.data);
                const actual = renderToString(vdom);

                expect(actual).toBe(test.expected);
            });
        }
    });
};

describe.skip('spec', () => {
    runSpec(basic);
});
