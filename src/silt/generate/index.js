import R from 'ramda';
import { createTree } from 'diffhtml';
import { generateAttributes } from './attributes';
import { handleExpression } from './expression';

/**
 * Generate vTree's from a provide Silt AST and a context.
 *
 * @param {SiltAst} ast - Abstract Syntax Tree provided by parseExpression.
 * @param {Object|Array} context - Context to apply to the AST.
 * @returns {vTree} diffhtml vTree.
 */
export default R.curry(function generate(ast, context) {
    // We'll handle null special, since it's valid.
    if (ast === null) {
        return createTree(null);
    }

    if (!Array.isArray(ast)) {
        throw new TypeError(`invalid ast: not an array, got type ${typeof ast}`);
    }

    const [tag, meta] = ast;

    switch (tag) {
        case 'hbs:expression':
            const next = handleExpression(meta, context);

            if (typeof next === 'string') {
                return generate(['#text', next], context);
            }

            return generate(next, context);
    }

    // #text nodes only have 1 or 2 values.
    if (ast.length === 3) {
        ast = [
            ast[0],
            generateAttributes(ast[1], context),
            R.map(child => generate(child, context), ast[2])
        ];
    }

    return createTree(...ast);
});
