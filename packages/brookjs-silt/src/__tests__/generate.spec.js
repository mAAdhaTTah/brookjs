/* eslint-env mocha */
import { expect } from 'chai';
import { createTree } from 'diffhtml';
import generate from '../generate';

describe('generate', () => {
    it('should create a template function', () => {
        expect(generate([])).to.be.a('function');
    });

    it('should generate a null value', () => {
        const ast = null;
        const context = {};
        const expected = createTree(null);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a plain div', () => {
        const ast = ['div', [], []];
        const context = {};
        const expected = createTree('div', {}, []);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a plain div with an attribute', () => {
        const ast = ['div', [
            ['class', 'my-class']
        ], []];
        const context = {};
        const expected = createTree('div', { class: 'my-class' }, []);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a div with text', () => {
        const ast = ['div', [], [
            ['#text', [], 'Some text']
        ]];
        const context = {};
        const expected = createTree('div', {}, [
            createTree('#text', {}, 'Some text')
        ]);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a text node from context', () => {
        const ast = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo',
            unescaped: false
        }, []];
        const context = { foo: 'bar' };
        const expected = createTree('#text', 'bar');

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a text node from dot context', () => {
        const ast = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expr: 'variable',
            name: 'foo.bar',
            unescaped: false
        }, []];
        const context = { foo: { bar: 'baz' } };
        const expected = createTree('#text', 'baz');

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a div with dynamic attribute name and value', () => {
        const ast = ['div', [
            [
                ['hbs:expression', {
                    args: undefined,
                    context: undefined,
                    expr: 'variable',
                    name: 'foo',
                    unescaped: false
                }],
                ['hbs:expression', {
                    args: undefined,
                    context: undefined,
                    expr: 'variable',
                    name: 'bar',
                    unescaped: false
                }]
            ]
        ], []];
        const context = { foo: 'class', bar: 'my-class' };
        const expected = createTree('div', { class: 'my-class' }, []);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate an if block if the context is true', () => {
        const ast = ['hbs:block', {
            args: undefined,
            context: 'bar',
            block: 'if',
        }, [
            ['#text', [], 'foo!']
        ]];
        const context = { bar: true };
        const expected = createTree('#document-fragment', {}, [
            createTree('#text', {}, 'foo!')
        ]);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should not generate an unless block if the context is false', () => {
        const ast = ['hbs:block', {
            args: undefined,
            context: 'bar',
            block: 'if',
        }, [
            ['#text', [], 'foo!']
        ]];
        const context = { bar: false };
        const expected = createTree(null);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate an unless block if the context is false', () => {
        const ast = ['hbs:block', {
            args: undefined,
            context: 'bar',
            block: 'unless',
        }, [
            ['#text', [], 'foo!']
        ]];
        const context = { bar: false };
        const expected = createTree('#document-fragment', {}, [
            createTree('#text', {}, 'foo!')
        ]);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should not generate an unless block if the context is true', () => {
        const ast = ['hbs:block', {
            args: undefined,
            context: 'bar',
            block: 'unless',
        }, [
            ['#text', [], 'foo!']
        ]];
        const context = { bar: true };
        const expected = createTree(null);

        expect(generate(ast, context)).to.eql(expected);
    });
});
