/* eslint-env mocha */
import { expect } from 'chai';
import { placeholderize } from '../placeholder';
import { VARIABLE } from '../expression';

describe('placeholder', () => {
    it('should placeholderize regular', () => {
        expect(placeholderize('{{foo}}')).to.eql([[
            ['hbs:expression', {
                args: undefined,
                context: undefined,
                expression: VARIABLE,
                name: 'foo',
                unescaped: false
            }]
        ], [], '__silt_0__']);
    });

    it('should placeholderize escaped escape character', () => {
        expect(placeholderize('\\\\{{foo}}')).to.eql([[
            ['hbs:expression', {
                args: undefined,
                context: undefined,
                expression: VARIABLE,
                name: 'foo',
                unescaped: false
            }]
        ], [], '\\__silt_0__']);
    });
});
