import * as t from 'io-ts';
import { TransformOptions } from '@babel/core';
import { babelIO } from '../../rc';
import { WebpackRC } from '../../webpack';

export const RC = t.partial({
  dir: t.string,
  webpack: WebpackRC,
  babel: babelIO
});

type Babel = Omit<t.TypeOf<typeof babelIO>, 'modifier'> & {
  modifier?: (config: TransformOptions) => TransformOptions;
};

export type RC = t.TypeOf<typeof RC> & {
  babel?: Babel;
  webpack?: WebpackRC;
};
