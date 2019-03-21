#!/usr/bin/env node

const { create } = require('brookjs-cli');

async function main() {
  let code;

  try {
    const app = create();
    const run = app.run(process.argv.slice(2));
    await run.waitUntilExit();
    code = 0;
  } catch (err) {
    code = err.code || 1;
  }

  process.exitCode = code;
}

main();
