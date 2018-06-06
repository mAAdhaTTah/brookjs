import { createElement } from 'react';
import FromClass from './FromClass';
import { isObs, isString, CHILDREN, STYLE, EMIT_PROP,
    EMBED_PROP, REF, DD_REF, TYPE } from './helpers';

const emptyObj = {};

const warnIfNotProp = obs => {
    if (obs.getType() !== 'property') {
        // eslint-disable-next-line no-console
        console.warn(`Observable ${obs.toString()} is not a property. You may experience incomplete renders without an initial value.`);
    }
};

const hasObsInChildrenArray = children => {
    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        if (isObs(child) || Array.isArray(child) && hasObsInChildrenArray(child)) {
            if (process.env.NODE_ENV !== 'production') {
                if (isObs(child)) {
                    warnIfNotProp(child);
                }
            }
            return true;
        }
    }
    return false;
};

const hasObsInProps = props => {
    for (const key in props) {
        const val = props[key];
        if (isObs(val)) {
            if (process.env.NODE_ENV !== 'production') {
                warnIfNotProp(val);
            }

            return true;
        } else if (CHILDREN === key) {
            if (Array.isArray(val) && hasObsInChildrenArray(val)) {
                return true;
            }
        } else if (STYLE === key) {
            for (const k in val) {
                const obs = val[k];
                if (isObs(obs)) {
                    if (process.env.NODE_ENV !== 'production') {
                        warnIfNotProp(obs);
                    }

                    return true;
                }
            }
        }
    }
    return false;
};

const filterProps = (type, props) => {
    // Throw away EMBED_PROP, migrate ref.
    // eslint-disable-next-line no-unused-vars
    const { [EMBED_PROP]: _, [REF]: ref, ...rest } = props;
    return { ...rest, [DD_REF]: ref, [TYPE]: type };
};

const h = (type, props, ...children) => {
    // can be null with no props
    props = props || emptyObj;

    if (isString(type) || props[EMBED_PROP]) {
        if (hasObsInChildrenArray(children) || hasObsInProps(props)) {
            props = { ...filterProps(type, props), [EMIT_PROP]: true };
            type = FromClass;
        } else if (props[EMBED_PROP]) {
            props = filterProps(type, props);
        }
    }
    return createElement(type, props, ...children);
};

export default h;
