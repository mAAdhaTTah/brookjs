import React from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import uuid from 'uuid/v1';
import { RootJunction } from 'brookjs-silt';
import { STORY_RENDERED } from '@storybook/core-events';
import Inspector from 'react-inspector';
import { withTheme, styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { opacify } from 'polished';

const ADDON_ID = 'brookjs-desalinate/storybook';
const PANEL_ID = `${ADDON_ID}/panel`;
const EVENT_ID = `${ADDON_ID}/event`;

const safeDeepEqual = (a: any, b: any) => {
  try {
    return a === b;
  } catch (e) {
    return false;
  }
};

const Actions = styled.pre({
  flex: 1,
  margin: 0,
  padding: '10px 5px 20px',
  overflowY: 'auto',
  color: '#666'
});

const Action = styled.div({
  display: 'flex',
  padding: '0',
  borderLeft: '5px solid transparent',
  borderBottom: '1px solid transparent',
  transition: 'all 0.1s',
  alignItems: 'flex-start'
});

const Counter = styled.div(({ theme }) => ({
  backgroundColor: opacify(0.5, theme.appBorderColor),
  color: theme.color.inverseText,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  lineHeight: 1,
  padding: '1px 5px',
  borderRadius: '20px',
  margin: '2px 0px'
}));

const InspectorContainer = styled.div({
  flex: 1,
  padding: '0 0 0 5px'
});

const Wrapper = styled.div({
  flex: 1,
  display: 'flex',
  position: 'relative',
  height: '100%'
});

type LoggedAction = {
  count: number;
  data: {
    name: string;
    args: any;
  };
  options: {
    clearOnStoryChange: boolean;
    limit: number;
  };
};

type ActionLoggerComponentProps = {
  onClear: Function;
  actions: LoggedAction[];
};

const ActionLoggerComponent: any /*React.SFC<ActionLoggerComponentProps> */ = withTheme(
  ({ actions, onClear, theme }) => (
    <Wrapper>
      <Actions>
        {actions.map((action: any) => (
          <Action key={action.id}>
            {action.count > 1 && <Counter>{action.count}</Counter>}
            <InspectorContainer>
              <Inspector
                theme={theme.addonActionsTheme || 'chromeLight'}
                sortObjectKeys
                showNonenumerable={false}
                name={action.data.name}
                data={action.data.args || action.data}
              />
            </InspectorContainer>
          </Action>
        ))}
      </Actions>

      <ActionBar actionItems={[{ title: 'Clear', onClick: onClear }]} />
    </Wrapper>
  )
);

type ActionLoggerProps = {
  active: boolean;
  channel: {
    emit: Function;
    on: Function;
    removeListener: Function;
  };
  api: {
    on: Function;
    off: Function;
    getQueryParam: Function;
    setQueryParams: Function;
  };
};

type State = { actions: LoggedAction[] };

class ActionLogger extends React.Component<ActionLoggerProps, State> {
  state: State = { actions: [] };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.addAction);
    api.on(STORY_RENDERED, this.handleStoryChange);
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(STORY_RENDERED, this.handleStoryChange);
    api.off(EVENT_ID, this.addAction);
  }

  handleStoryChange = () => {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  };

  addAction = (action: LoggedAction) => {
    this.setState(prevState => {
      const actions = [...prevState.actions];
      const previous = actions.length && actions[0];
      if (previous && safeDeepEqual(previous.data, action.data)) {
        previous.count++; // eslint-disable-line
      } else {
        action.count = 1; // eslint-disable-line
        actions.unshift(action);
      }
      return { actions: actions.slice(0, action.options.limit) };
    });
  };

  clearActions = () => {
    this.setState({ actions: [] });
  };

  render() {
    const { actions = [] } = this.state;
    const { active } = this.props;
    const props = {
      actions,
      onClear: this.clearActions
    };
    return active ? <ActionLoggerComponent {...props} /> : null;
  }
}

const emit = (value: any) => {
  const channel = addons.getChannel();
  const id = uuid();
  channel.emit(EVENT_ID, {
    id,
    count: 0,
    data: { name: 'emit', args: [value] },
    options: {}
  });
};

export const withJunction = makeDecorator({
  name: 'withJunction',
  parameterName: 'withJunction',
  wrapper: (Story: Function, context: any) => (
    <RootJunction
      root$={root$ => {
        root$.observe(emit);
      }}
    >
      {Story(context)}
    </RootJunction>
  )
});

export const register = () => {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'Junction Logger',
      render: ({ active, key }) => (
        <ActionLogger key={key} api={api} channel={channel} active={active} />
      )
    });
  });
};
