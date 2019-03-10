import React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from '@storybook/addon-actions';

// eslint-disable-next-line import/no-internal-modules
const ActionLogger = require('@storybook/addon-actions/dist/containers/ActionLogger');

const register = () => {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'Junction Logger',
      render: ({ active }) => (
        <ActionLogger channel={channel} api={api} active={active} />
      )
    });
  });
};

export default register;
