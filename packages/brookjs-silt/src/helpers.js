import Kefir from 'kefir';
import React from 'react';

export const VALUE = 'value';
export const ERROR = 'error';
export const TYPE = '$$type';
export const DD_REF = '$$ref';
export const CHILDREN = 'children';
export const REF = 'ref';
export const STYLE = 'style';
export const EMBED_PROP = 'silt-embeddable';
export const EMIT_PROP = 'silt-emittable';

export const isObs = x => x instanceof Kefir.Observable;

export const isString = is => typeof is === 'string';

export const forEachInChildrenArray = (children, extra, fn) => {
    for (let i = 0, n = children.length; i < n; ++i) {
        const childI = children[i];
        if (isObs(childI)) {
            fn(extra, childI);
        } else if (Array.isArray(childI)) {
            forEachInChildrenArray(childI, extra, fn);
        }
    }
};

export const renderChildren = (children, self, values) => {
    if (isObs(children)) {
        return values[self.at++];
    }

    if (Array.isArray(children)) {
        let newChildren = children;

        for (let i = 0, n = children.length; i < n; ++i) {
            const childI = children[i];
            let newChildI = childI;

            if (isObs(childI)) {
                newChildI = values[self.at++];
            } else if (Array.isArray(childI)) {
                newChildI = renderChildren(childI, self, values);
            }

            if (newChildI !== childI) {
                if (newChildren === children) {
                    newChildren = children.slice(0);
                }

                newChildren[i] = newChildI;
            }
        }

        return newChildren;
    }

    return children;
};

export const renderStyle = (style, self, values) => {
    let newStyle = null;
    for (const i in style) {
        const styleI = style[i];
        if (isObs(styleI)) {
            if (!newStyle) {
                newStyle = {};
                for (const j in style) {
                    if (j === i) {
                        break;
                    }
                    newStyle[j] = style[j];
                }
            }
            newStyle[i] = values[self.at++];
        } else if (newStyle) {
            newStyle[i] = styleI;
        }
    }
    return newStyle || style;
};

export const render = (self, values) => {
    const props = self.props;

    let type = null;
    let newProps = null;
    let newChildren = null;

    self.at = 0;

    for (const key in props) {
        const val = props[key];
        if (CHILDREN === key) {
            newChildren = renderChildren(val, self, values);
        } else if (TYPE === key) {
            type = props[key];
        } else if (DD_REF === key) {
            newProps = newProps || {};
            newProps.ref = isObs(val) ? values[self.at++] : val;
        } else if (isObs(val)) {
            newProps = newProps || {};
            newProps[key] = values[self.at++];
        } else if (STYLE === key) {
            newProps = newProps || {};
            newProps.style = renderStyle(val, self, values);
        } else if (EMIT_PROP !== key) {
            newProps = newProps || {};
            newProps[key] = val;
        }
    }

    return newChildren instanceof Array
        ? React.createElement.apply(null, [type, newProps, ...newChildren])
        : null !== newChildren
            ? React.createElement(type, newProps, newChildren)
            : React.createElement(type, newProps);
};
