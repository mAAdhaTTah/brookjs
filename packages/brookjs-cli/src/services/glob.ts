import glob from 'glob';
import Kefir, { Stream } from 'kefir';

export default (target: string): Stream<string[], Error> =>
  Kefir.fromNodeCallback(cb => glob(target, cb));
