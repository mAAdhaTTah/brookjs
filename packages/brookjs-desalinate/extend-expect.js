const Kefir = require('kefir');
const { jestPlugin } = require('brookjs-desalinate');

const { extensions, ...helpers } = jestPlugin(Kefir);
expect.extend(extensions);
global.KTU = helpers;
