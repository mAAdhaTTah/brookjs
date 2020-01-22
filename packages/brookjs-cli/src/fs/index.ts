import fs from 'fs';
import Kefir from 'kefir';

export const service = {
  access(path: string) {
    return Kefir.fromNodeCallback<void, NodeJS.ErrnoException>(callback =>
      fs.access(path, err => callback(err))
    );
  },

  readFile(path: string) {
    return Kefir.fromNodeCallback<Buffer, NodeJS.ErrnoException>(callback =>
      fs.readFile(path, callback)
    );
  }
};
