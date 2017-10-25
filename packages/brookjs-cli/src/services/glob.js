import glob from 'glob';
import { Kefir } from 'brookjs';

export default target => Kefir.fromNodeCallback(cb => glob(target, cb));
