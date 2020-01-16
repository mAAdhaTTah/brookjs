import * as t from 'io-ts';
import { TransformOptions } from '@babel/core';

export const Babel = t.partial({
  modifier: t.Function
});

type BabelBase = t.TypeOf<typeof Babel>;

export type Babel = Omit<BabelBase, 'modifier'> & {
  modifier?: (config: TransformOptions) => TransformOptions;
};
