import { test } from 'brookjs-desalinate';
import { parseText } from '../text';

test('should replace placeholder with expression', t => {
    t.plan(1);

    const text = '__silt_0__';
    const expressions = [
        ['hbs:expression']
    ];
    const actual = [
        ['hbs:expression']
    ];

    t.deepEquals(parseText(text, expressions), actual);
});
