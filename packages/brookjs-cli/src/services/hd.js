import { Kefir } from 'brookjs';
import fs from 'fs-extra';

export const read = path => Kefir.fromNodeCallback(callback =>
    fs.readFile(path, 'utf8', callback)
);

export const write = (path, contents) => Kefir.fromNodeCallback(callback =>
    fs.outputFile(path, contents, { mode: '644' }, callback)
);

export const stat = path => Kefir.fromNodeCallback(callback =>
    fs.stat(path, callback)
);

export const mkdir = path => Kefir.fromNodeCallback(callback =>
    fs.mkdir(path, '755', callback)
);
