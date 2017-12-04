import assert from 'assert';
import { outerHTML } from 'diffhtml';
import { raf$ } from '../rAF';

export default (el, vdom$) =>
    vdom$.flatMapLatest(vdom => raf$.take(1).flatMap(() => {
        if (process.env.NODE_ENV !== 'production') {
            assert(
                vdom != null &&
                    (typeof vdom === 'string' || typeof vdom === 'object'),
                '`vdom` should be an HTML string or a VDOM object');
        }

        return outerHTML(el, vdom);
    })).setName(vdom$, 'effects$');
