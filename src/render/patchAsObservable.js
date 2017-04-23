import { createNode } from 'diffhtml/lib/node';
import { stream } from 'kefir';

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

const removeAttribute = (domNode, name) => {
    domNode.removeAttribute(name);

    if (name in domNode) {
        domNode[name] = undefined;
    }
};

export default function patchAsObservable(patches, { NodeCache, protectVTree, unprotectVTree, decodeEntities, escape }) {
    const observables = [];
    const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

    // Set attributes.
    if (SET_ATTRIBUTE.length) {
        for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
            const vTree = SET_ATTRIBUTE[i];
            const attribute = SET_ATTRIBUTE[i + 1];
            const newValue = decodeEntities(SET_ATTRIBUTE[i + 2]);
            const domNode = createNode(vTree);

            // Triggered either synchronously or asynchronously depending on if a
            // transition was invoked.
            const isObject = typeof newValue === 'object';
            const isFunction = typeof newValue === 'function';

            // Events must be lowercased otherwise they will not be set correctly.
            const name = attribute.indexOf('on') === 0 ? attribute.toLowerCase() : attribute;

            // Normal attribute value.
            if (!isObject && !isFunction && name) {
                observables.push(stream(emitter => {
                    const noValue = newValue === null || newValue === undefined;

                    // Allow the user to find the real value in the DOM Node as a
                    // property.
                    try {
                        domNode[name] = newValue;
                    } catch (unhandledException) {}

                    // Set the actual attribute, this will ensure attributes like
                    // `autofocus` aren't reset by the property call above.
                    domNode.setAttribute(name, noValue ? '' : newValue);

                    emitter.end();
                }));
            }
            // Support patching an object representation of the style object.
            else if (isObject && name === 'style') {
                observables.push(stream(emitter => {
                    const keys = Object.keys(newValue);

                    for (let i = 0; i < keys.length; i++) {
                        domNode.style[keys[i]] = newValue[keys[i]];
                    }

                    emitter.end();
                }));
            } else if (typeof newValue !== 'string') {
                observables.push(stream(emitter => {
                    // We remove and re-add the attribute to trigger a change in a web
                    // component or mutation observer. Although you could use a setter or
                    // proxy, this is more natural.
                    if (domNode.hasAttribute(name) && domNode[name] !== newValue) {
                        domNode.removeAttribute(name, '');
                    }

                    // Necessary to track the attribute/prop existence.
                    domNode.setAttribute(name, '');

                    // Since this is a property value it gets set directly on the node.
                    try {
                        domNode[name] = newValue;
                    } catch (unhandledException) {}

                    emitter.end();
                }));
            }
        }
    }

    // Remove attributes.
    if (REMOVE_ATTRIBUTE.length) {
        for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
            const vTree = REMOVE_ATTRIBUTE[i];
            const name = REMOVE_ATTRIBUTE[i + 1];
            const domNode = NodeCache.get(vTree);

            observables.push(stream(emitter => {
                removeAttribute(domNode, name);
                emitter.end();
            }));
        }
    }

    // First do all DOM tree operations, and then do attribute and node value.
    for (let i = 0; i < TREE_OPS.length; i++) {
        const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

        // Insert/append elements.
        if (INSERT_BEFORE && INSERT_BEFORE.length) {
            for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
                const vTree = INSERT_BEFORE[i];
                const newTree = INSERT_BEFORE[i + 1];
                const referenceTree = INSERT_BEFORE[i + 2];
                const domNode = NodeCache.get(vTree);
                const referenceNode = referenceTree && createNode(referenceTree);

                observables.push(stream(emitter => {
                    if (referenceTree) {
                        protectVTree(referenceTree);
                    }

                    const newNode = createNode(newTree);
                    protectVTree(newTree);

                    // If refNode is `null` then it will simply append like `appendChild`.
                    domNode.insertBefore(newNode, referenceNode);

                    emitter.end();
                }));
            }
        }

        // Remove elements.
        if (REMOVE_CHILD && REMOVE_CHILD.length) {
            for (let i = 0; i < REMOVE_CHILD.length; i++) {
                const vTree = REMOVE_CHILD[i];
                const domNode = NodeCache.get(vTree);

                observables.push(stream(emitter => {
                    domNode.parentNode.removeChild(domNode);
                    unprotectVTree(vTree);
                    emitter.end();
                }));
            }
        }

        // Replace elements.
        if (REPLACE_CHILD && REPLACE_CHILD.length) {
            for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
                const newTree = REPLACE_CHILD[i];
                const oldTree = REPLACE_CHILD[i + 1];
                const oldDomNode = NodeCache.get(oldTree);
                const newDomNode = createNode(newTree);

                observables.push(stream(emitter => {
                    // Always insert before to allow the element to transition.
                    oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
                    protectVTree(newTree);

                    oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
                    unprotectVTree(oldTree);

                    emitter.end();
                }));
            }
        }
    }

    // Change all nodeValues.
    if (NODE_VALUE.length) {
        for (let i = 0; i < NODE_VALUE.length; i += 3) {
            const vTree = NODE_VALUE[i];
            const nodeValue = NODE_VALUE[i + 1];

            observables.push(stream(emitter => {
                // Wait... this doesn't seem right...?
                const domNode = NodeCache.get(vTree);
                const { parentNode } = domNode;

                if (nodeValue.includes('&')) {
                    domNode.nodeValue = decodeEntities(nodeValue);
                } else {
                    domNode.nodeValue = nodeValue;
                }

                if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
                    parentNode.nodeValue = escape(decodeEntities(nodeValue));
                }

                emitter.end();
            }));
        }
    }

    return observables;
}
