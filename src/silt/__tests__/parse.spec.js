/* eslint-env mocha */
import { expect } from 'chai';
import { VARIABLE } from '../parse/expression';

import parse from '../parse';

describe('parse', () => {
    it('should throw with multiple root nodes', () => {
        expect(() => parse('<div></div><div></div>')).to.throw(Error);
    });

    it('should return null from an empty string', () => {
        const source = '';
        const expected = null;

        expect(parse(source)).to.equal(expected);
    });

    it('should parseExpression a plain div', () => {
        const source = '<div></div>';
        const expected = ['div', [], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parseExpression a div with text', () => {
        const source = `<div>Some text</div>`;
        const expected = ['div', [], [
            ['#text', 'Some text']
        ]];

        expect(parse(source)).to.eql(expected);
    });

    it('should parseExpression an expression', () => {
        const source = '{{foo}}';
        const expected = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expression: VARIABLE,
            name: 'foo',
            unescaped: false
        }];

        expect(parse(source)).to.eql(expected);
    });
});
