import children from './children';
import combineActionReducers from './combineActionReducers';
import component from './component';
import events from './events';
import observeDelta from './observeDelta';
import helpers from './helpers';
import bootstrap, { BROOKJS_INIT } from './bootstrap';
import render from './render';

const brook = { bootstrap, children, combineActionReducers, component,
    events, observeDelta, helpers, render, BROOKJS_INIT };

export { brook, children, bootstrap, combineActionReducers,
    component, events, observeDelta, helpers, render, BROOKJS_INIT };

export default brook;
