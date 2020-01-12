#!/usr/bin/env node
const path = require('path');
const { create } = require('brookjs-cli');

async function main() {
  let app = create();

  try {
    app = app.loadCommandsFrom(
      require.resolve(path.join(process.cwd(), 'commands'))
    );
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
