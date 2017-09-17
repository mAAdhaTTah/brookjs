/* eslint-env jest */
import { parseExpression } from '../expression';

describe('expression', () => {
    it('should parse basic variable expression', () => {
        const text = '{{foo}}';
        const actual = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo',
            unescaped: false
        }, []];

        expect(parseExpression(text)).toEqual(actual);
    });
});
