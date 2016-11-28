import combineActionReducers from './combineActionReducers';
import component from './component';
import events from './events';
import observeDelta from './observeDelta';
import helpers from './helpers';
import bootstrap, { BROOKJS_INIT } from './bootstrap';

const brook = { bootstrap, combineActionReducers, component,
    events, observeDelta, helpers, BROOKJS_INIT };

export { brook, bootstrap, combineActionReducers,
    component, events, observeDelta, helpers, BROOKJS_INIT };

export default brook;
