/* eslint-env mocha */
import { expect } from 'chai';
import { placeholderize } from '../placeholder';

describe('placeholder', () => {
    it('should placeholderize regular', () => {
        expect(placeholderize('{{foo}}')).to.deep.equal([[
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
        expect(placeholderize('\\\\{{foo}}')).to.deep.equal([[
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
