// @flow
import { EACH, VARIABLE } from '../parse/expression';

export type BlockMeta = {
    block: EACH;
    args: ?Object;
    context: ?Object;
};
export type SiltBlockNode = ['hbs:block', BlockMeta, Array<SiltNode>]; // eslint-disable-line no-use-before-define

export type ExpressionMeta = {
    expr: VARIABLE;
    name: string;
    unescaped: boolean;
    args: ?Object;
    context: ?Object;
};
export type SiltExpressionNode = ['hbs:expression', ExpressionMeta, []];

export type SiltDOMNodeName = '#text' | '#document-fragment' | string;
export type SiltDOMNodeAttributeKey = string | SiltExpressionNode;
export type SiltDOMNodeAttributeValue = string | SiltExpressionNode;
export type SiltDOMNodeAttribute = [SiltDOMNodeAttributeKey, SiltDOMNodeAttributeValue];
export type SiltDOMNode = [SiltDOMNodeName, Array<SiltDOMNodeAttribute>, Array<SiltNode> | string]; // eslint-disable-line no-use-before-define

export type SiltNode = SiltDOMNode | SiltExpressionNode | SiltBlockNode;
