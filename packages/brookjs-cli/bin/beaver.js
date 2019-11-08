#!/usr/bin/env node
const path = require('path');
const { create } = require('brookjs-cli');

async function main() {
  const run = await create()
    .loadCommandsFrom(path.join(process.cwd(), 'commands'))
    .run(process.argv.slice(2));

  let code;

  try {
    await run.waitUntilExit();
    code = 0;
  } catch (err) {
    code = err.code || 1;
  }

  process.exitCode = code;
}

main();
