import combineActionReducers from './combineActionReducers';
import component from './component';
import observeDelta from './observeDelta';
import helpers from './helpers';
import bootstrap, { BROOKJS_INIT } from './bootstrap';

const brook = { bootstrap, combineActionReducers, component, observeDelta, helpers, BROOKJS_INIT };

export { brook, bootstrap, combineActionReducers, component, observeDelta, helpers, BROOKJS_INIT };

export default brook;
