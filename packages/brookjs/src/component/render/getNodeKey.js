import { BLACKBOX_ATTRIBUTE, CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';

/**
 * Generate a unique key for the provided vTree.
 *
 * @param {vTree} tree - Tree to get key form.
 * @returns {string} vTree key.
 */
export default function getNodeKey(tree) {
    let key = '';

    if (tree.attributes[CONTAINER_ATTRIBUTE]) {
        key = tree.attributes[CONTAINER_ATTRIBUTE];

        if (tree.attributes[KEY_ATTRIBUTE]) {
            key += `::${tree.attributes[KEY_ATTRIBUTE]}`;
        }
    }

    if (tree.attributes[BLACKBOX_ATTRIBUTE]) {
        if (key) {
            key += '::';
        }

        key += tree.attributes[BLACKBOX_ATTRIBUTE];
    }

    return key;
}
