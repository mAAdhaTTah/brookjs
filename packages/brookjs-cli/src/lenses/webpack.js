import R from 'ramda';
import { lFilename, lOutput, lPath } from './properties';

/**
 * Namespace lens.
 */
export const nslWebpack = R.lensProp('webpack');

/**
 * Namespace property lenses
 */
export const lWebpackOutput = R.compose(nslWebpack, lOutput);
export const lWebpackOutputPath = R.compose(lWebpackOutput, lPath);
export const lWebpackOutputFilename = R.compose(lWebpackOutput, lFilename);
