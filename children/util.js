import R from 'ramda';
import { NODE_ADDED, NODE_REMOVED } from './actions';

const sources = new WeakMap();

export const defaults = {
    modifyChildProps: R.identity,
    preplug: R.identity
};

export const createInstance = R.curry(({ factory, modifyChildProps, preplug }, props$, element) => {
    let instance$ = preplug(factory(element, modifyChildProps(props$)));
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

export const keyMatches = key => R.pipe(R.prop('key'), R.equals(key));

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
