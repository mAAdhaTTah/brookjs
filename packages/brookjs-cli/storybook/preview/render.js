import { Kefir } from 'brookjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { stripIndents } from 'common-tags';
import { logger } from '@storybook/client-logger';
import { createElementFromTemplate } from 'brookjs-desalinate';
import { action } from '@storybook/addon-actions';
import ErrorDisplay from './ErrorDisplay';

class BrookStory extends React.Component { // eslint-disable-line
    componentDidMount () {
        this.sub = this.props.props$.take(1).flatMap(props => Kefir.stream(emitter => {
            const element = createElementFromTemplate(this.props.component.template, props);

            this.el.appendChild(element);

            emitter.value(element);

            return () => {
                this.el.removeChild(element);
            };
        }))
            .flatMap(element => this.props.component(element, this.props.props$))
            .observe(action('value'), action('error'), action('end'));
    }

    componentWillUnmount () {
        this.sub.unsubscribe();
    }

    render () {
        return React.createElement('div', { ref: el => this.el = el });
    }
}

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

let rootEl = null;
let previousKind = '';
let previousStory = '';
let previousRevision = -1;

if (isBrowser) {
    rootEl = document.getElementById('root');
}

export function renderError (error) {
    const properError = new Error(error.title);
    properError.stack = error.description;

    const redBox = React.createElement(ErrorDisplay, { error: properError });
    ReactDOM.render(redBox, rootEl);
}

export function renderException (error) {
    // We always need to render redbox in the mainPage if we get an error.
    // Since this is an error, this affects to the main page as well.
    const realError = new Error(error.message);
    realError.stack = error.stack;
    const redBox = React.createElement(ErrorDisplay, { error: realError });
    ReactDOM.render(redBox, rootEl);

    // Log the stack to the console. So, user could check the source code.
    logger.error(error.stack);
}

export function renderMain (data, storyStore, forceRender) {
    if (storyStore.size() === 0) {
        return null;
    }

    const NoPreview = () => React.createElement('p', null, 'No Preview Available!');
    const noPreview = React.createElement(NoPreview, null);
    const { selectedKind, selectedStory } = data;

    const revision = storyStore.getRevision();
    const story = storyStore.getStory(selectedKind, selectedStory);
    if (!story) {
        ReactDOM.render(noPreview, rootEl);
        return null;
    }

    // Unmount the previous story only if selectedKind or selectedStory has changed.
    // renderMain() gets executed after each action. Actions will cause the whole
    // story to re-render without this check.
    //    https://github.com/storybooks/react-storybook/issues/116
    // However, we do want the story to re-render if the store itself has changed
    // (which happens at the moment when HMR occurs)
    if (
        !forceRender &&
        revision === previousRevision &&
        selectedKind === previousKind &&
        previousStory === selectedStory
    ) {
        return null;
    }

    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/storybooks/react-storybook/issues/81
    previousRevision = revision;
    previousKind = selectedKind;
    previousStory = selectedStory;
    ReactDOM.unmountComponentAtNode(rootEl);

    const { component, props$ } = story;

    if (!component || !props$) {
        const error = {
            title: `Expecting a React element from the story: "${selectedStory}" of "${selectedKind}".`,
            description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
        };
        return renderError(error);
    }

    ReactDOM.render(React.createElement(BrookStory, story), rootEl);
    return null;
}

export default function renderPreview ({ reduxStore, storyStore }, forceRender = false) {
    const state = reduxStore.getState();
    if (state.error) {
        return renderException(state.error);
    }

    try {
        return renderMain(state, storyStore, forceRender);
    } catch (ex) {
        return renderException(ex);
    }
}
