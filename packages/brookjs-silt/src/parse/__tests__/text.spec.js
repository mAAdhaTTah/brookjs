/* eslint-env jest */
import { parseText } from '../text';

describe('text', () => {
    it('should replace placeholder with expression', () => {
        const text = '__silt_0__';
        const expressions = [
            ['hbs:expression']
        ];
        const actual = [
            ['hbs:expression']
        ];

        expect(parseText(text, expressions)).toEqual(actual);
    });
});
