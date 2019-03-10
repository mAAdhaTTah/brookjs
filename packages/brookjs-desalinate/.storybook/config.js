import { configure, addDecorator } from '@storybook/react';
import { withJunction } from 'brookjs-desalinate';

const req = require.context('../stories', true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withJunction);

configure(loadStories, module);
