declare module 'webpack-common-shake' {
  import { Plugin as WebpackPlugin } from 'webpack';

  export interface Options {
    warnings: Partial<{
      global: boolean,
      module: false
    }>,
    onExportDelete: (resource: any, property: any) => any,
    onModuleBailout: (module: any, bailouts: any) => any,
    onGlobalBailout: (bailouts: any) => any
  }

  export class Plugin extends WebpackPlugin {
    constructor(opts?: Partial<Options>);
  }
}
