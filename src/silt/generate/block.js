// @flow
import type { BlockMeta, SiltNode } from '../ast';
import type { ContextSource } from '../context';
import { getContextValue } from '../context';
import generate from './index';

export function handleBlock (meta: BlockMeta, children: SiltNode, context: ContextSource) {
    switch (meta.block) {
        case 'if':
            if (getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return null;
        case 'unless':
            if (!getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return null;
        default:
            return '';
    }
}
