import { createTree } from 'diffhtml';
import { test } from 'brookjs-desalinate';
import generate from '../generate';


test('should create a template function', t => {
    t.plan(1);

    t.equal(typeof generate([]), 'function');
});

test('should generate a null value', t => {
    t.plan(1);

    const ast = null;
    const context = {};
    const expected = createTree(null);

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a plain div', t => {
    t.plan(1);

    const ast = ['div', [], []];
    const context = {};
    const expected = createTree('div', {}, []);

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a plain div wtesth an attribute', t => {
    t.plan(1);

    const ast = ['div', [
        ['class', 'my-class']
    ], []];
    const context = {};
    const expected = createTree('div', { class: 'my-class' }, []);

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a div wtesth text', t => {
    t.plan(1);

    const ast = ['div', [], [
        ['#text', [], 'Some text']
    ]];
    const context = {};
    const expected = createTree('div', {}, [
        createTree('#text', {}, 'Some text')
    ]);

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a text node from context', t => {
    t.plan(1);

    const ast = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'foo',
        unescaped: false
    }, []];
    const context = { foo: 'bar' };
    const expected = createTree('#text', 'bar');

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a text node from dot context', t => {
    t.plan(1);

    const ast = ['hbs:expression', {
        args: undefined,
        context: undefined,
        expr: 'variable',
        name: 'foo.bar',
        unescaped: false
    }, []];
    const context = { foo: { bar: 'baz' } };
    const expected = createTree('#text', 'baz');

    t.deepEqual(generate(ast, context), expected);
});

test('should generate a div wtesth dynamic attribute name and value', t => {
    t.plan(1);

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

    t.deepEqual(generate(ast, context), expected);
});

test('should generate an if block if the context is true', t => {
    t.plan(1);

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

    t.deepEqual(generate(ast, context), expected);
});

test('should not generate an unless block if the context is false', t => {
    t.plan(1);

    const ast = ['hbs:block', {
        args: undefined,
        context: 'bar',
        block: 'if',
    }, [
        ['#text', [], 'foo!']
    ]];
    const context = { bar: false };
    const expected = createTree(null);

    t.deepEqual(generate(ast, context), expected);
});

test('should generate an unless block if the context is false', t => {
    t.plan(1);

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

    t.deepEqual(generate(ast, context), expected);
});

test('should not generate an unless block if the context is true', t => {
    t.plan(1);

    const ast = ['hbs:block', {
        args: undefined,
        context: 'bar',
        block: 'unless',
    }, [
        ['#text', [], 'foo!']
    ]];
    const context = { bar: true };
    const expected = createTree(null);

    t.deepEqual(generate(ast, context), expected);
});
