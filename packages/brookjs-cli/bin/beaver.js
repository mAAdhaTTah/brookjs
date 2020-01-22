#!/usr/bin/env node
const path = require('path');
const { create } = require('brookjs-cli');
const resolve = require('resolve');

async function main() {
  let app = create();

  try {
    app = app.loadCommandsFrom(
      resolve.sync(path.join(process.cwd(), 'commands'), {
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx']
      })
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
