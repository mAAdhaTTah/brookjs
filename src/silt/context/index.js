// @flow
import R from 'ramda';
import type { SiltNode } from '../ast';

export type ContextSource = Object;

export const getContextValue = (name: string, context: ContextSource): string | SiltNode => {
    return R.path(name.split('.'), context);
};
