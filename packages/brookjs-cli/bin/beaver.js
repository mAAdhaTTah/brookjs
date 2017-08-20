#!/usr/bin/env node
/* eslint-disable import/unambiguous */
require('babel-register');
const program = require('../src').default;

program.parse(process.argv);
