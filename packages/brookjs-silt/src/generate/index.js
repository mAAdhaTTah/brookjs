// @flow
import R from 'ramda';
import { createTree } from 'diffhtml';
import type { SiltNode } from '../ast';
import type { ContextSource } from '../context';
import { generateAttributes } from './attributes';
import { handleExpression } from './expression';
import { handleBlock } from './block';

/**
 * Generate vTree's from a provide Silt AST and a context.
 *
 * @param {SiltAst} ast - Abstract Syntax Tree provided by parseExpression.
 * @param {Object|Array} context - Context to apply to the AST.
 * @returns {vTree} diffhtml vTree.
 */
export default R.curry(function generate (ast: SiltNode, context: ContextSource): vTree {
    // We'll handle null special, since it's valid.
    if (ast == null) {
        return createTree(null);
    }

    if (!Array.isArray(ast)) {
        throw new TypeError(`invalid ast: not an array, got type ${typeof ast}`);
    }

    const [tag, attributes, children] = ast;

    switch (tag) {
        case 'hbs:comment':
            return createTree(null);
        case 'hbs:expression':
            // $FlowFixMe
            const next = handleExpression(attributes, context);

            if (typeof next === 'string') {
                return generate(['#text', [], next], context);
            }

            return generate(next, context);
        case 'hbs:block':
            // $FlowFixMe
            return handleBlock(attributes, children, context);
    }

    return createTree(
        tag,
        generateAttributes(attributes, context),
        Array.isArray(children) ?
            // $FlowFixMe
            R.map(child => generate(child, context), children) :
            children
    );
});
