import R from 'ramda';
import { createTree } from 'diffhtml';

/**
 * Generate vTree's from a provide Silt AST and a context.
 *
 * @param {SiltAst} ast - Abstract Syntax Tree provided by parse.
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

    const [tag, attributes, children] = ast;

    if (tag === '#text') {
        return createTree(tag, attributes);
    }

    return createTree(
        tag,
        R.fromPairs(attributes),
        R.map(R.flip(generate)(context), children)
    );
});
