import { createStore } from 'redux';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import keyEvents from '@storybook/ui/dist/libs/key_events';
import qs from 'qs';
import { navigator, window } from 'global';
import * as storyStore from './storyStore';
import reducer from './reducer';
import { selectStory } from './actions';
import ClientApi from './ClientApi';
import ConfigApi from './ConfigApi';
import render from './render';

// check whether we're running on node/browser
const isBrowser =
    navigator &&
    navigator.userAgent &&
    navigator.userAgent !== 'storyshots' &&
    !(navigator.userAgent.indexOf('Node.js') > -1) &&
    !(navigator.userAgent.indexOf('jsdom') > -1);

const reduxStore = createStore(reducer);
const context = { storyStore, reduxStore };

if (isBrowser) {
    const queryParams = qs.parse(window.location.search.substring(1));
    const channel = createChannel({ page: 'preview' });
    channel.on('setCurrentStory', data => {
        reduxStore.dispatch(selectStory(data.kind, data.story));
    });
    Object.assign(context, { channel, window, queryParams });
    addons.setChannel(channel);
    // set the story if correct params are loaded via the URL.
    if (queryParams.selectedKind) {
        reduxStore.dispatch(selectStory(queryParams.selectedKind, queryParams.selectedStory));
    }

    // Keep whichever of these are set that we don't override when stories change
    const originalQueryParams = queryParams;
    reduxStore.subscribe(() => {
        const { selectedKind, selectedStory } = reduxStore.getState();

        const queryString = qs.stringify({
            ...originalQueryParams,
            selectedKind,
            selectedStory,
        });
        window.history.pushState({}, '', `?${queryString}`);
    });

    // Handle keyEvents and pass them to the parent.
    window.onkeydown = e => {
        const parsedEvent = keyEvents(e);
        if (parsedEvent) {
            channel.emit('applyShortcut', { event: parsedEvent });
        }
    };
}

const clientApi = new ClientApi(context);
const configApi = new ConfigApi(context);

// do exports
export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const setAddon = clientApi.setAddon.bind(clientApi);
export const addDecorator = clientApi.addDecorator.bind(clientApi);
export const clearDecorators = clientApi.clearDecorators.bind(clientApi);
export const getStorybook = clientApi.getStorybook.bind(clientApi);
export const configure = configApi.configure.bind(configApi);

// initialize the UI
const renderUI = () => {
    if (isBrowser) {
        render(context);
    }
};

reduxStore.subscribe(renderUI);

export const forceReRender = () => render(context, true);
