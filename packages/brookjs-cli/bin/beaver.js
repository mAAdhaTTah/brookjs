#!/usr/bin/env node
// @TODO(mAAdhaTTah) This needs to be set so we can use @babel/register
// to load commands & rc files. Would be nice to get rid of this and
// scope this change to the compiling process.
process.env.NODE_ENV = 'production';

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
