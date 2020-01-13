import { CLIEngine } from 'eslint';
import { Stream } from 'kefir';
import fs from './fs';

export default class ESLintService {
  private engine: CLIEngine;

  static create(opts: { cwd: string; fix: boolean }) {
    return new ESLintService(opts);
  }

  private constructor({ cwd, fix }: { cwd: string; fix: boolean }) {
    this.engine = new CLIEngine({
      baseConfig: {
        extends: 'brookjs'
      },
      cwd,
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix,
      reportUnusedDisableDirectives: true,
      useEslintrc: false
    });
  }

  check(path: string): Stream<CLIEngine.LintReport, Error> {
    return fs
      .readFile(path)
      .map(buffer => this.engine.executeOnText(buffer.toString('utf-8'), path));
  }
}
