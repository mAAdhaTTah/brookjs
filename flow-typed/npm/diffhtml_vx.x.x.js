// flow-typed signature: 20f746d779380eaf0454ec5d5c05ac5e
// flow-typed version: <<STUB>>/diffhtml_v1.0.0-beta.8/flow_v0.54.1

declare type vTree = {};
declare type vTreeName = '#document-fragment' | '#text' | '#comment' | string;

declare module 'diffhtml' {
    declare function createTree(input: vTreeName, attributes: Object, childNodes: Array<vTree> | string): vTree;
    declare function createTree(input: vTreeName, attributes: Object, ...rest: Array<vTree>): vTree;
    declare function createTree(input: vTreeName, childNodes: Array<vTree> | string): vTree;
    declare function createTree(input: vTreeName, ...rest: Array<vTree>): vTree;
    declare function createTree(input: Element | vTree) : vTree;
    declare function createTree(input: null): vTree;
}
