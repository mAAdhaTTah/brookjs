import R from 'ramda';

/**
 * Namespace lens.
 */
export const lApp = R.lensProp('app');

/**
 * Property lenses.
 */
export const lName = R.lensProp('name');
export const lDir = R.lensProp('dir');
export const lAuthor = R.lensProp('author');
export const lVersion = R.lensProp('version');
export const lDescription = R.lensProp('description');
export const lKeywords = R.lensProp('keywords');
export const lLicense = R.lensProp('license');

/**
 * Namespace property lenses
 */
export const lAppName = R.compose(lApp, lName);
export const lAppDir = R.compose(lApp, lDir);
export const lAppAuthor = R.compose(lApp, lAuthor);
export const lAppVersion = R.compose(lApp, lVersion);
export const lAppDescription = R.compose(lApp, lDescription);
export const lAppKeywords = R.compose(lApp, lKeywords);
export const lAppLicense = R.compose(lApp, lLicense);
