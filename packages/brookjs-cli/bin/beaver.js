#!/usr/bin/env node

const { create } = require('brookjs-cli');

const app = create();
app.run(process.argv.slice(2));
