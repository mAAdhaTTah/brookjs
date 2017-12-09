// @flow
import * as Elements from './elements';

let range; // Create a range object for efficiently rendering strings to elements.

export default function createElementFromTemplate<P>(template: P => string, props: P): Node {
    const str = template(props);

    if (!range && document.createRange) {
        range = document.createRange();
        range.selectNode(document.body || document.createElement('body'));
    }

    let fragment;

    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = document.createElement('body');
        fragment.innerHTML = str;
    }

    const el = fragment.childNodes[0];
    Elements.register(el);
    return el;
}
