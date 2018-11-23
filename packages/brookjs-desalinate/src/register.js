import addons from '@storybook/addons';
import { h } from 'brookjs-silt';
import ActionLogger from '@storybook/addon-actions/dist/containers/ActionLogger';
import { ADDON_ID, PANEL_ID } from '@storybook/addon-actions';

const register = () => {
    addons.register(ADDON_ID, api => {
        const channel = addons.getChannel();
        addons.addPanel(PANEL_ID, {
            title: 'Junction Logger',
            render: ({ active }) => <ActionLogger channel={channel} api={api} active={active} />,
        });
    });
};

export default register;
