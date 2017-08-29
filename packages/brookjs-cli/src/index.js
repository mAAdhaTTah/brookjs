require = require('@std/esm')(module);

const program = require('./program').default;
const main = require('./main').default;

exports.program = program;
exports.main = main;
