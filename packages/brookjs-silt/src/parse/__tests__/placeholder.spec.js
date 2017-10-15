import { test } from 'brookjs-desalinate';
import { placeholderize } from '../placeholder';

test('should placeholderize regular', t => {
    t.plan(1);

    t.deepEquals(placeholderize('{{foo}}'), [[
        ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo',
            unescaped: false
        }, []]
    ], [], '__silt_0__']);
});

test('should placeholderize escaped escape character',t => {
    t.plan(1);

    t.deepEquals(placeholderize('\\\\{{foo}}'), [[
        ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo',
            unescaped: false
        }, []]
    ], [], '\\__silt_0__']);
});
