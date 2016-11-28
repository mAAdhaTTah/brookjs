import R from 'ramda';
import { pool } from 'kefir';
import sinon from 'sinon';
import children from '../';

export function createFixture() {
    let child$ = pool();
    let factory = sinon.spy(() => child$);
    let modifyChildProps = sinon.spy(R.identity);
    let preplug = sinon.spy(R.identity);
    let generator = children({ child: { factory, modifyChildProps, preplug } });

    let element = document.createElement('div');
    element.setAttribute('data-brk-container', 'parent');
    let firstChild = createChild();
    element.appendChild(firstChild);

    let props$ = pool();

    document.body.appendChild(element);
    let instance = generator(element, props$);

    return { child$, factory, modifyChildProps, preplug, generator, element, firstChild, props$, instance };
}

export function createChild() {
    let child = document.createElement('div');
    // @todo use common container attribute
    child.setAttribute('data-brk-container', 'child');
    return child;
}
