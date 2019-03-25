import * as t from 'io-ts';

export const plugin = t.type({});

export type Plugin = t.TypeOf<typeof plugin>;

const required = t.type({
  dir: t.string,
  mocha: t.partial({
    requires: t.array(t.string),
    ui: t.string,
    reporter: t.string
  })
});

const optional = t.partial({
  plugins: t.array(t.union([t.string, plugin])),
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

export const rc = t.intersection([required, optional]);

export type RC = t.TypeOf<typeof rc>;
