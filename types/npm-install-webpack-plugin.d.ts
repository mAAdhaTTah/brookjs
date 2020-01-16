declare module 'npm-install-webpack-plugin' {
  import { Plugin } from 'webpack';

  export interface Options {
    dev?: boolean;
    peerDependencies?: boolean;
    quiet?: boolean;
    yarn?: boolean;
    npm?: string;
  }

  class NpmInstallPlugin extends Plugin {
    constructor(opts?: Options);
  }

  export default NpmInstallPlugin;
}
