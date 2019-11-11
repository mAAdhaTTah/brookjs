import path from 'path';
import Kefir, { Observable } from 'kefir';
import { fs } from '../services';

export const setupTestsPath = (cwd: string, dir: string, ext: string) =>
  path.join(cwd, dir, `setupTests.${ext}`);

export const extension$ = (cwd: string): Observable<'ts' | 'js', never> =>
  fs
    .access(path.join(cwd, 'tsconfig.json'))
    .map(() => 'ts')
    .flatMapErrors(() => Kefir.constant('js'));

export const setupTestsConfig$ = (
  cwd: string,
  dir: string,
  ext: string
): Observable<string[], never> =>
  fs
    .access(setupTestsPath(cwd, dir, ext))
    .map(() => [`<rootDir>/${dir}/setupTests.${ext}`])
    .flatMapErrors(() => Kefir.constant([]));
