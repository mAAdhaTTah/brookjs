/* eslint-env mocha */
import { expect } from 'chai';

import { parseExpression, VARIABLE } from '../expression';

describe('expression', () => {
    it('should parse basic variable expression', () => {
        const text = '{{foo}}';
        const actual = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expression: VARIABLE,
            name: 'foo',
            unescaped: false
        }];

        expect(parseExpression(text)).to.eql(actual);
    });
});
