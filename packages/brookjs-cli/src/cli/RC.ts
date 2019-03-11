import * as t from 'io-ts';

export const plugin = t.type({});

export type Plugin = t.TypeOf<typeof plugin>;

export const rc = t.partial({
  plugins: t.array(t.union([t.string, plugin]))
});

export type RC = t.TypeOf<typeof rc>;
