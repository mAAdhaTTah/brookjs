// @flow
export type CommentMeta = {
    text: string;
};
export type SiltCommentNode = ['hbs:comment', CommentMeta, []];

export type BlockType = 'each' | 'unless';
export type BlockMeta = {
    block: BlockType;
    args: ?Object;
    context: string;
};
export type SiltBlockNode = ['hbs:block', BlockMeta, Array<SiltNode>]; // eslint-disable-line no-use-before-define

export type ExpressionType = 'variable' | 'partial';
export type ExpressionMeta = {
    expr: ExpressionType;
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

export type SiltNode = SiltDOMNode | SiltExpressionNode | SiltBlockNode | SiltCommentNode;
