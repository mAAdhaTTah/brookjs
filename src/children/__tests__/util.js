import R from 'ramda';
import Kefir from '../../kefir';
import sinon from 'sinon';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE, $$internals } from '../../constants';
import children from '../';

/**
 * Create new children test fixture.
 *
 * @returns {Fixture} Children test fixture.
 */
export function createFixture({ child$ = Kefir.pool(), factory = sinon.spy(() => child$), createSourceStream } = {}) {
    if (createSourceStream) {
        factory[$$internals] = { createSourceStream };
    }
    const modifyChildProps = sinon.spy(R.identity);
    const preplug = sinon.spy(R.identity);
    const generator = children({ child: { factory, modifyChildProps, preplug } });

    const element = document.createElement('div');
    element.setAttribute(CONTAINER_ATTRIBUTE, 'parent');
    const firstChild = createChild('1');
    element.appendChild(firstChild);

    const props$ = Kefir.pool();

    document.body.appendChild(element);
    const instance = generator(element, props$);

    return { child$, factory, modifyChildProps, preplug, generator, element, firstChild, props$, instance };
}

/**
 * Create a new element with the provided key.
 *
 * @param {string} key - Child key.
 * @returns {Element} New child element.
 */
export function createChild(key) {
    const child = document.createElement('div');

    child.setAttribute(CONTAINER_ATTRIBUTE, 'child');
    child.setAttribute(KEY_ATTRIBUTE, key);

    return child;
}
