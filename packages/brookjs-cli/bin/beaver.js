#!/usr/bin/env node
const path = require('path');
const { promises: fs } = require('fs');
const { create } = require('brookjs-cli');

async function main() {
  let app = create();

  const cmdPath = path.join(process.cwd(), 'commands');

  try {
    if (await fs.stat(cmdPath)) {
      app = app.loadCommandsFrom(cmdPath);
    }
  } catch {}

  const run = app.run(process.argv.slice(2));

  let code = 0;

  try {
    await run.waitUntilExit();
  } catch (err) {
    code = err.code || 1;
  }

  process.exitCode = code;
}

main();
