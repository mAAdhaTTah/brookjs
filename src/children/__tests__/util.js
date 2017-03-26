import R from 'ramda';
import { pool } from 'kefir';
import sinon from 'sinon';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE, $$internals } from '../../constants';
import children from '../';

/**
 * Create new children test fixture.
 *
 * @returns {Fixture} Children test fixture.
 */
export function createFixture({ child$ = pool(), factory = sinon.spy(() => child$), createSourceStream } = {}) {
    if (createSourceStream) {
        factory[$$internals] = { createSourceStream };
    }
    let modifyChildProps = sinon.spy(R.identity);
    let preplug = sinon.spy(R.identity);
    let generator = children({ child: { factory, modifyChildProps, preplug } });

    let element = document.createElement('div');
    element.setAttribute(CONTAINER_ATTRIBUTE, 'parent');
    let firstChild = createChild('1');
    element.appendChild(firstChild);

    let props$ = pool();

    document.body.appendChild(element);
    let instance = generator(element, props$);

    return { child$, factory, modifyChildProps, preplug, generator, element, firstChild, props$, instance };
}

/**
 * Create a new element with the provided key.
 *
 * @param {string} key - Child key.
 * @returns {Element} New child element.
 */
export function createChild(key) {
    let child = document.createElement('div');

    child.setAttribute(CONTAINER_ATTRIBUTE, 'child');
    child.setAttribute(KEY_ATTRIBUTE, key);

    return child;
}
