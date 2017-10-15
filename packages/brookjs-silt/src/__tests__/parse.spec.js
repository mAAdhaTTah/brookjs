import { test } from 'brookjs-desalinate';
import parse from '../parse';

test('should return null from an empty string', t => {
    t.plan(1);

    const source = '';
    const expected = null;

    t.equal(parse(source), expected);
});

test('should parse a plain div', t => {
    t.plan(1);

    const source = '<div></div>';
    const expected = ['div', [], []];

    t.deepEquals(parse(source), expected);
});

test('should parse 2 divs as #document-fragment', t => {
    t.plan(1);

    const source = '<div></div><div></div>';
    const expected = ['#document-fragment', [], [
        ['div', [], []],
        ['div', [], []]
    ]];

    t.deepEquals(parse(source), expected);
});

test('should parse a div wtesth text', t => {
    t.plan(1);

    const source = '<div>Some text</div>';
    const expected = ['div', [], [
        ['#text', [], 'Some text']
    ]];

    t.deepEquals(parse(source), expected);
});

test('should parse a div wtesth an attribute', t => {
    t.plan(1);

    const source = '<div class="my-class"></div>';
    const expected = ['div', [
        ['class', 'my-class']
    ], []];

    t.deepEquals(parse(source), expected);
});

test('should parse an expression', t => {
    t.plan(1);

    const source = '{{foo}}';
    const expected = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'foo',
        unescaped: false
    }, []];

    t.deepEquals(parse(source), expected);
});

test('should parse a dotted expression', t => {
    t.plan(1);

    const source = '{{foo.bar}}';
    const expected = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'foo.bar',
        unescaped: false
    }, []];

    t.deepEquals(parse(source), expected);
});

test('should parse an expression wtesth numbers', t => {
    t.plan(1);

    const source = '{{num1}}';
    const expected = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'num1',
        unescaped: false
    }, []];

    t.deepEquals(parse(source), expected);
});

test('should not parse an escaped expression', t => {
    t.plan(1);

    const source = '\\{{foo}}';
    const expected = ['#text', [], '{{foo}}'];

    t.deepEquals(parse(source), expected);
});

test('should parse an escaped escaped expression', t => {
    t.plan(1);

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

    t.deepEquals(parse(source), expected);
});

test('should parse an expression as attribute name', t => {
    t.plan(1);

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

    t.deepEquals(parse(source), expected);
});

test('should parse an expression as attribute value', t => {
    t.plan(1);

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

    t.deepEquals(parse(source), expected);
});

test('should parse a partial expression', t => {
    t.plan(1);

    const source = '{{> foo}}';
    const expected = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'partial',
        name: 'foo',
        unescaped: false
    }, []];

    t.deepEquals(parse(source), expected);
});

test('should parse an each block', t => {
    t.plan(1);

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

    t.deepEquals(parse(source), expected);
});

test('should parse an unless block', t => {
    t.plan(1);

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

    t.deepEquals(parse(source), expected);
});
