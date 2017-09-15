// @flow
import type { BlockMeta, SiltNode } from '../ast';
import type { ContextSource } from '../context';
import { IF, UNLESS } from '../parse/expression';
import { getContextValue } from '../context';
import generate from './index';

export function handleBlock (meta: BlockMeta, children: SiltNode, context: ContextSource) {
    switch (meta.block) {
        case IF:
            if (getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return null;
        case UNLESS:
            if (!getContextValue(meta.context, context)) {
                return generate(['#document-fragment', [], children], context);
            }

            return null;
        default:
            return '';
    }
}
