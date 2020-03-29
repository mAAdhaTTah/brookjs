#!/usr/bin/env node
const { create, App } = require('brookjs-cli');

async function main() {
  let app = create();

  try {
    app = app.loadCommandsFrom(App.resolve('./commands', process.cwd()));
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
