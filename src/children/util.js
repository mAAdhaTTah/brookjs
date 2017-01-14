import R from 'ramda';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import { NODE_ADDED, NODE_REMOVED } from './actions';

const sources = new WeakMap();

export const defaults = {
    modifyChildProps: R.identity,
    preplug: R.identity,
    key: ''
};

/**
 * Create a new children stream instance from the given configuration, props$ stream & element.
 *
 * @param {Function} factory - Instance factory function.
 * @param {Function} modifyChildProps - Creates a new props$ stream for the child.
 * @param {Function} preplug - Modify the child instance stream.
 * @param {string} key - @deprecated.
 * @param {Kefir.Observable} props$ - Parent's props stream.
 * @param {Element} element - Child element.
 * @returns {Kefir.Observable} Child instance.
 */
export const createInstance = R.curry(({ factory, modifyChildProps, preplug, key }, props$, element) => {
    const hasKey = element.hasAttribute(KEY_ATTRIBUTE);
    const keyAttr = element.getAttribute(KEY_ATTRIBUTE);
    const useKey = key && hasKey;

    let childProps$ = modifyChildProps(props$, keyAttr);

    if (useKey) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`Using key in children configuration is deprecated.
Use the second parameter to modifyChildProps.`);
        }

        if ('@@key' === key) {
            childProps$ = childProps$.map(R.prop(element.getAttribute(KEY_ATTRIBUTE)));
        } else {
            childProps$ = childProps$.map(R.find(
                R.pipe(R.path(key.split('.')), R.equals(element.getAttribute(KEY_ATTRIBUTE)))
            ));
        }

        // If the key isn't found, then the child is about to
        // be removed, so don't dispatch props down the stream.
        // @todo this seems suboptimal. how to handle iterated children?
        childProps$ = childProps$.filter(
            R.pipe(R.type, R.equals('Undefined'), R.not)
        );
    }

    let instance$ = preplug(factory(element, childProps$));

    if (useKey) {
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
 * @returns {null|Node} Parent containr node.
 */
export function getContainerNode(parent) {
    if (!parent) {
        return null;
    }

    if (parent.hasAttribute && parent.hasAttribute(CONTAINER_ATTRIBUTE)) {
        return parent;
    }

    return getContainerNode(parent.parentNode);
}

export function getInstanceForElement(element) {
    return sources.get(element);
}
