import uuid from 'uuid/v1';
import addons from '@storybook/addons';
import { EVENT_ID } from '@storybook/addon-actions';
import React from 'react';
import { RootJunction } from 'brookjs-silt';

const emit = (value: any) => {
  const channel = addons.getChannel();
  const id = uuid();
  channel.emit(EVENT_ID, {
    id,
    data: { name: 'emit', args: [JSON.stringify(value)] },
    options: {}
  });
};

const withJunction = (storyFn: any) => (
  <RootJunction root$={root$ => root$.observe(emit)}>{storyFn()}</RootJunction>
);

export default withJunction;
