import R from 'ramda';
import { KEY_ATTRIBUTE } from '../constants';
import { NODE_ADDED, NODE_REMOVED } from './actions';

const sources = new WeakMap();

export const defaults = {
    modifyChildProps: R.identity,
    preplug: R.identity,
    key: ''
};

export const createInstance = R.curry(({ factory, modifyChildProps, preplug, key }, props$, element) => {
    let childProps$ = modifyChildProps(props$);

    if (key && element.hasAttribute(KEY_ATTRIBUTE)) {
        if ('@key' === key) {
            childProps$ = childProps$.map(R.prop(element.getAttribute(KEY_ATTRIBUTE)));
        } else {
            childProps$ = childProps$.map(R.find(
                R.pipe(R.prop(key), R.equals(element.getAttribute(KEY_ATTRIBUTE)))
            ));
        }
    }

    let instance$ = preplug(factory(element, childProps$));

    if (key && element.hasAttribute(KEY_ATTRIBUTE)) {
        instance$ = instance$.map(action => Object.assign({}, action, {
            payload: Object.assign({}, action.payload, {
                key: element.getAttribute(KEY_ATTRIBUTE)
            })
        }));
    }

    sources.set(element, instance$);

    return instance$;
});

export const isChildNode = el => R.converge(R.or, [
    R.pipe(R.path(['payload', 'parent']), R.equals(el)),
    R.pipe(R.path(['payload', 'target']), R.equals(el)),
]);

export const isAddedChildNode = el => R.converge(R.and, [
    isChildNode(el),
    R.pipe(R.prop('type'), R.equals(NODE_ADDED))
]);

export const isRemovedChildNode = el => R.converge(R.and, [
    isChildNode(el),
    R.pipe(R.prop('type'), R.equals(NODE_REMOVED))
]);

export const containerMatches = container => R.pipe(R.prop('container'), R.equals(container));

/**
 * Returns the container node of the provided node.
 *
 * @param {Node} parent - Parent node to check.
 * @returns {null|Node} Parent container node.
 */
export function getContainerNode(parent) {
    if (!parent) {
        return null;
    }

    if (parent.hasAttribute && parent.hasAttribute('data-brk-container')) {
        return parent;
    }

    return getContainerNode(parent.parentNode);
}

export function getInstanceForElement(element) {
    return sources.get(element);
}
