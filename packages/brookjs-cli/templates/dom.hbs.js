import { children, component, Kefir, render, containerAttribute } from 'brookjs';
import { } from './components';
import template from './view.hbs';

export const el = doc => Kefir.fromCallback(callback => {
    callback(doc.querySelector(`[${containerAttribute('app')}]`));
});

export const view = component({
    children: children({}),
    render: render(template)
});
