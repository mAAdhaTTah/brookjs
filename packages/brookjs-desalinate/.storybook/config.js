import { configure, addDecorator } from '@storybook/react';
import { withJunction } from 'brookjs-desalinate';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withJunction);

configure(loadStories, module);
