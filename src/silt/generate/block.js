// @flow
import type { BlockMeta, SiltNode } from '../ast';
import type { ContextSource } from '../context';
import { createTree } from 'diffhtml';
import { getContextValue } from '../context';
import generate from './index';

export function handleBlock (meta: BlockMeta, children: Array<SiltNode>, context: ContextSource): vTree {
    switch (meta.block) {
        case 'if':
            if (getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return createTree(null);
        case 'unless':
            if (!getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return createTree(null);
        default:
            return createTree(null);
    }
}
