import glob from 'glob';
import Kefir from 'kefir';

export default target => Kefir.fromNodeCallback(cb => glob(target, cb));
