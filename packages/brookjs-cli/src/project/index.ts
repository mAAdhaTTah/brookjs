import path from 'path';
import Kefir, { Observable } from 'kefir';
import { service as fs } from '../fs';

export type Ext = 'ts' | 'js';

export const setupTestsPath = (cwd: string, dir: string, ext: Ext) =>
  path.join(cwd, dir, `setupTests.${ext}`);

export const extension$ = (cwd: string): Observable<Ext, never> =>
  fs
    .access(path.join(cwd, 'tsconfig.json'))
    .map(() => 'ts')
    .flatMapErrors(() => Kefir.constant('js'));

export const setupTestsConfig$ = (
  cwd: string,
  dir: string,
  ext: Ext
): Observable<string[], never> =>
  fs
    .access(setupTestsPath(cwd, dir, ext))
    .map(() => [`<rootDir>/${dir}/setupTests.${ext}`])
    .flatMapErrors(() => Kefir.constant([]));
