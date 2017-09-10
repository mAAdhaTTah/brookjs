/* eslint-env mocha */
import { expect } from 'chai';
import { PARTIAL, VARIABLE } from '../parse/expression';

import parse from '../parse';

describe('parse', () => {
    it('should return null from an empty string', () => {
        const source = '';
        const expected = null;

        expect(parse(source)).to.equal(expected);
    });

    it('should parse a plain div', () => {
        const source = '<div></div>';
        const expected = ['div', [], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse 2 divs as #document-fragment', () => {
        const source = '<div></div><div></div>';
        const expected = ['#document-fragment', [], [
            ['div', [], []],
            ['div', [], []]
        ]];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse a div with text', () => {
        const source = '<div>Some text</div>';
        const expected = ['div', [], [
            ['#text', 'Some text']
        ]];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse a div with an attribute', () => {
        const source = '<div class="my-class"></div>';
        const expected = ['div', [
            ['class', 'my-class']
        ], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an expression', () => {
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

    it('should parse an expression as attribute name', () => {
        const source = '<div {{foo}}="my-class"></div>';
        const expected = ['div', [
            [['hbs:expression', {
                args: undefined,
                context: undefined,
                expression: VARIABLE,
                name: 'foo',
                unescaped: false
            }], 'my-class']
        ], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an expression as attribute value', () => {
        const source = '<div class="{{foo}}"></div>';
        const expected = ['div', [
            ['class', ['hbs:expression', {
                args: undefined,
                context: undefined,
                expression: VARIABLE,
                name: 'foo',
                unescaped: false
            }]]
        ], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse a partial expression', () => {
        const source = '{{> foo}}';
        const expected = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expression: PARTIAL,
            name: 'foo',
            unescaped: false
        }];

        expect(parse(source)).to.eql(expected);
    });
});
