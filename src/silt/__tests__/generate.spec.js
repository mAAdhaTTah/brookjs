/* eslint-env mocha */
import { expect } from 'chai';
import { createTree } from 'diffhtml';
import { VARIABLE } from '../parse/expression';

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

    it('should generate a div with text', () => {
        const ast = ['div', [], [
            ['#text', 'Some text']
        ]];
        const context = {};
        const expected = createTree('div', {}, [
            createTree('#text', 'Some text')
        ]);

        expect(generate(ast, context)).to.eql(expected);
    });

    it('should generate a text node from context', () => {
        const ast = ['hbs:expression', {
            args: undefined,
            context: undefined,
            expression: VARIABLE,
            name: 'foo',
            unescaped: false
        }];
        const context = { foo: 'bar' };
        const expected = createTree('#text', 'bar');

        expect(generate(ast, context)).to.eql(expected);
    });
});
