import initStoryshots from '@storybook/addon-storyshots';
import { render } from '@testing-library/react';
import { RootJunction } from 'brookjs-silt';

const reactTestingLibrarySerializer = {
  print: (val, serialize) => serialize(val.container.firstChild),
  test: val => val && val.hasOwnProperty('container')
};

initStoryshots({
  framework: 'react',
  renderer: element =>
    render(element, {
      wrapper: RootJunction
    }),
  snapshotSerializers: [reactTestingLibrarySerializer]
});
