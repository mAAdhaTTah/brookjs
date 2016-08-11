import component from './component';
import observeDelta from './observeDelta';
import util from './util';
import bootstrap, { BROOKJS_INIT } from './bootstrap';

const brook = { bootstrap, component, observeDelta, util, BROOKJS_INIT };

export { brook, bootstrap, component, observeDelta, util, BROOKJS_INIT };

export default brook;
