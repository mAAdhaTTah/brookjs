import component from './component';
import observeDelta from './observeDelta';
import helpers from './helpers';
import bootstrap, { BROOKJS_INIT } from './bootstrap';

const brook = { bootstrap, component, observeDelta, helpers, BROOKJS_INIT };

export { brook, bootstrap, component, observeDelta, helpers, BROOKJS_INIT };

export default brook;
