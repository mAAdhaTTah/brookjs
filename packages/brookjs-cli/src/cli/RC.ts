import * as t from 'io-ts';

export const plugin = t.type({});

export type Plugin = t.TypeOf<typeof plugin>;

export const rc = t.partial({
  plugins: t.array(t.union([t.string, plugin])),
  dir: t.string,
  mocha: t.partial({
    requires: t.array(t.string),
    ui: t.string,
    reporter: t.string
  }),
  webpack: t.type({
    entry: t.union([
      t.string,
      t.dictionary(t.string, t.string),
      t.array(t.string)
    ]),
    output: t.type({
      path: t.string,
      filename: t.union([t.Function, t.string])
    })
  })
});

export type RC = t.TypeOf<typeof rc>;
