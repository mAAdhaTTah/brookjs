// @flow
import type { BlockMeta, SiltNode } from '../ast';
import type { ContextSource } from '../context';
import { UNLESS } from '../parse/expression';
import { getContextValue } from '../context';
import generate from './index';

export function handleBlock (meta: BlockMeta, children: SiltNode, context: ContextSource) {
    switch (meta.block) {
        case UNLESS:
            const value = getContextValue(meta.context, context);

            if (!value) {
                return generate(['#document-fragment', [], children], context);
            }

            return null;
        default:
            return '';
    }
}
