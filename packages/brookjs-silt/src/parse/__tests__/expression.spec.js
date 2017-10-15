import { test } from 'brookjs-desalinate';
import { parseExpression } from '../expression';

test('should parse basic variable expression', t => {
    t.plan(1);

    const text = '{{foo}}';
    const actual = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'foo',
        unescaped: false
    }, []];

    t.deepEquals(parseExpression(text), actual);
});
