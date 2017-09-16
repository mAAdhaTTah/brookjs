/* eslint-env mocha */
import { expect } from 'chai';
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
            ['#text', [], 'Some text']
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
            expr: 'variable',
            name: 'foo',
            unescaped: false
        }, []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse a dotted expression', () => {
        const source = '{{foo.bar}}';
        const expected = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo.bar',
            unescaped: false
        }, []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an expression with numbers', () => {
        const source = '{{num1}}';
        const expected = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'num1',
            unescaped: false
        }, []];

        expect(parse(source)).to.eql(expected);
    });

    it('should not parse an escaped expression', () => {
        const source = '\\{{foo}}';
        const expected = ['#text', [], '{{foo}}'];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an escaped escaped expression', () => {
        const source = '\\\\{{foo}}';
        const expected = ['#document-fragment', [], [
            ['#text', [], '\\'],
            ['hbs:expression', {
                args: undefined,
                context: undefined,
                expr: 'variable',
                name: 'foo',
                unescaped: false
            }, []]
        ]];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an expression as attribute name', () => {
        const source = '<div {{foo}}="my-class"></div>';
        const expected = ['div', [
            [['hbs:expression', {
                args: undefined,
                context: undefined,
                expr: 'variable',
                name: 'foo',
                unescaped: false
            }, []], 'my-class']
        ], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an expression as attribute value', () => {
        const source = '<div class="{{foo}}"></div>';
        const expected = ['div', [
            ['class', ['hbs:expression', {
                args: undefined,
                context: undefined,
                expr: 'variable',
                name: 'foo',
                unescaped: false
            }, []]]
        ], []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse a partial expression', () => {
        const source = '{{> foo}}';
        const expected = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'partial',
            name: 'foo',
            unescaped: false
        }, []];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an each block', () => {
        const source = '<div>{{#each names}}{{this}}{{/each}}</div>';
        const expected = ['div', [], [
            ['hbs:block', {
                args: undefined,
                context: 'names',
                block: 'each',
            }, [
                ['hbs:expression', {
                    args: undefined,
                    context: undefined,
                    expr: 'variable',
                    name: 'this',
                    unescaped: false
                }, []]
            ]]
        ]];

        expect(parse(source)).to.eql(expected);
    });

    it('should parse an unless block', () => {
        const source = '<div>{{#unless bar}}foo!{{/each}}</div>';
        const expected = ['div', [], [
            ['hbs:block', {
                args: undefined,
                context: 'bar',
                block: 'unless',
            }, [
                ['#text', [], 'foo!']
            ]]
        ]];

        expect(parse(source)).to.eql(expected);
    });
});
