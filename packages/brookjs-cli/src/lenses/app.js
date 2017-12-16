import R from 'ramda';
import { lName, lDir, lAuthor, lVersion,
    lDescription, lKeywords, lLicense, lEntry } from './properties';

/**
 * Namespace lens.
 */
export const nslApp = R.lensProp('app');

/**
 * Namespace property lenses
 */
export const lAppName = R.compose(nslApp, lName);
export const lAppDir = R.compose(nslApp, lDir);
export const lAppAuthor = R.compose(nslApp, lAuthor);
export const lAppVersion = R.compose(nslApp, lVersion);
export const lAppDescription = R.compose(nslApp, lDescription);
export const lAppKeywords = R.compose(nslApp, lKeywords);
export const lAppLicense = R.compose(nslApp, lLicense);
export const lAppEntry = R.compose(nslApp, lEntry);
