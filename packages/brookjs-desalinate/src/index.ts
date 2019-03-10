export { default as chaiPlugin } from './chaiPlugin';
export { default as jestPlugin } from './jestPlugin';
export { default as register } from './register';
export { default as withJunction } from './withJunction';

declare module '@storybook/addon-actions' {
  export const ADDON_ID: string;
  export const PANEL_ID: string;
  export const EVENT_ID: string;
}
