/* global __APP_PATH__ */
import { configure } from '../index';

function loadStories() {
    const req = require.context(__APP_PATH__, true, /((.*)\.story\.js)/);

    req.keys().map(req);
}

configure(loadStories, module);
