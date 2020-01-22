import { TransformOptions } from '@babel/core';
import * as t from 'io-ts';

export const BabelRC = t.partial({
  modifier: t.Function
});

export type BabelRC = Omit<t.TypeOf<typeof BabelRC>, 'modifier'> & {
  modifier?: (config: TransformOptions) => TransformOptions;
};
