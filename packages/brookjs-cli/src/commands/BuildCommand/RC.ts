import * as t from 'io-ts';
import { BabelRC } from '../../babel';
import { WebpackRC } from '../../webpack';

export const RC = t.partial({
  dir: t.string,
  webpack: WebpackRC,
  babel: BabelRC,
});

export type RC = t.TypeOf<typeof RC> & {
  babel?: BabelRC;
  webpack?: WebpackRC;
};
