import * as t from 'io-ts';

export const stringify = (v: any): string => {
  if (typeof v === 'function') {
    return t.getFunctionName(v);
  }

  if (typeof v === 'number' && !isFinite(v)) {
    if (isNaN(v)) {
      return 'NaN';
    }
    return v > 0 ? 'Infinity' : '-Infinity';
  }

  return JSON.stringify(v, null, '  ');
};

export const getContextPath = (root: string, context: t.Context): string =>
  context.map(({ key }) => (key === '' ? root : key)).join('.');

export const getMessage = (name: string, e: t.ValidationError): string => {
  if (e.message !== undefined) {
    return e.message;
  }

  if (e.value === undefined) {
    return `Required property ${getContextPath(name, e.context)} missing.`;
  }

  return `Invalid value ${stringify(e.value)} was provided for ${getContextPath(
    name,
    e.context,
  )}`;
};
