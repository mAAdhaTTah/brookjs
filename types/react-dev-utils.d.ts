declare module 'react-dev-utils/ModuleNotFoundPlugin' {
  import { Plugin as WebpackPlugin } from 'webpack';
  // @TODO(mAAdhaTTah) write types
  export default class Plugin extends WebpackPlugin {
    constructor(appPath: string);
  }
}
