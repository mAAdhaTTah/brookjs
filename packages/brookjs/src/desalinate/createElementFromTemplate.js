import * as Elements from './elements';

let range; // Create a range object for efficently rendering strings to elements.

export default function createElementFromTemplate(template, state) {
    const str = template(state);

    if (!range && document.createRange) {
        range = document.createRange();
        range.selectNode(document.body);
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
