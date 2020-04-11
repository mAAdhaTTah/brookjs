import * as t from 'io-ts';

export const RC = t.partial({
  dir: t.string,
  jest: t.exact(
    t.partial({
      clearMocks: t.boolean,
      collectCoverageFrom: t.array(t.string),
      coveragePathIgnorePatterns: t.array(t.string),
      coverageReporters: t.array(t.string),
      coverageThreshold: t.record(
        t.string,
        t.partial({
          branches: t.number,
          functions: t.number,
          lines: t.number,
          statements: t.number,
        }),
      ),
      displayName: t.union([
        t.string,
        t.type({
          name: t.string,
          color: t.string,
        }),
      ]),
      extraGlobals: t.array(t.string),
      globalSetup: t.string,
      globalTeardown: t.string,
      moduleNameMapper: t.record(t.string, t.string),
      resetMocks: t.boolean,
      resetModules: t.boolean,
      restoreMocks: t.boolean,
      snapshotSerializers: t.array(t.string),
      transform: t.record(
        t.string,
        t.union([t.string, t.tuple([t.string, t.object])]),
      ),
      transformIgnorePatterns: t.array(t.string),
      watchPathIgnorePatterns: t.array(t.string),
    }),
  ),
});

export type RC = t.TypeOf<typeof RC>;
