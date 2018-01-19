import { createElement } from 'react';
import FromClass from './FromClass';
import { isObs, isString, CHILDREN, STYLE, PROP, REF, DD_REF, TYPE } from './helpers';

const emptyObj = {};

const hasObsInChildrenArray = children => {
    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        if (isObs(child) || Array.isArray(child) && hasObsInChildrenArray(child)) {
            return true;
        }
    }
    return false;
};

const hasObsInProps = props => {
    for (const key in props) {
        const val = props[key];
        if (isObs(val)) {
            return true;
        } else if (CHILDREN === key) {
            if (Array.isArray(val) && hasObsInChildrenArray(val)) {
                return true;
            }
        } else if (STYLE === key) {
            for (const k in val) {
                if (isObs(val[k])) {
                    return true;
                }
            }
        }
    }
    return false;
};

const filterProps = (type, props) => {
    // Throw away PROP, migrate ref.
    const { [PROP]: _, [REF]: ref, ...rest } = props; // eslint-disable-line no-unused-vars
    return { ...rest, [DD_REF]: ref, [TYPE]: type };
};

const h = (type, props, ...children) => {
    // can be null with no props
    props = props || emptyObj;

    if (isString(type) || props[PROP]) {
        if (hasObsInChildrenArray(children) || hasObsInProps(props)) {
            props = filterProps(type, props);
            type = FromClass;
        } else if (props[PROP]) {
            props = filterProps(type, props);
        }
    }
    return createElement(type, props, ...children);
};

export default h;
