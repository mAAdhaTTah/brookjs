/* eslint-env jest */
import { placeholderize } from '../placeholder';

describe('placeholder', () => {
    it('should placeholderize regular', () => {
        expect(placeholderize('{{foo}}')).toEqual([[
            ['hbs:expression', {
                args: undefined,
                context: undefined,
                expr: 'variable',
                name: 'foo',
                unescaped: false
            }, []]
        ], [], '__silt_0__']);
    });

    it('should placeholderize escaped escape character', () => {
        expect(placeholderize('\\\\{{foo}}')).toEqual([[
            ['hbs:expression', {
                args: undefined,
                context: undefined,
                expr: 'variable',
                name: 'foo',
                unescaped: false
            }, []]
        ], [], '\\__silt_0__']);
    });
});
