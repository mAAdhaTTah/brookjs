import React, { useContext, useEffect } from 'react';
import { Color, StdinContext, Box, AppContext } from 'ink';
import { toJunction } from 'brookjs-silt';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { Observable } from 'kefir';
import { Nullable } from 'typescript-nullable';
import {
  State,
  Configurable,
  unreachable,
  ConfiguredState,
  ConfiguringState
} from './types';

type Props = State & {
  onChange: (value: string) => void;
  onSubmit: () => void;
  onConfirm: (value: boolean) => void;
};

const useOnSubmit = (onSubmit: () => void) => {
  const { stdin, setRawMode } = useContext(StdinContext);

  useEffect(() => {
    const onData = (data: Buffer) => {
      const s = data.toString();

      if (s === '\r') {
        onSubmit();
      }
    };

    setRawMode!(true);
    stdin.on('data', onData);

    return () => {
      stdin.off('data', onData);
      setRawMode!(false);
    };
  }, [stdin, setRawMode, onSubmit]);
};

type Question = {
  text: string;
  placeholder: string;
};

const questions: { [key in Configurable]: Question } = {
  version: {
    text: 'What is the application version?',
    placeholder: '0.0.0'
  },
  description: {
    text: 'What is the application description?',
    placeholder: 'A brookjs application'
  },
  dir: {
    text: 'Relative to the project, where will the source code live?',
    placeholder: 'src'
  },
  license: {
    text: 'Choose a license',
    placeholder: 'MIT'
  }
};

const ConfigureStep: React.FC<
  ConfiguringState & { onChange: (value: string) => void; onSubmit: () => void }
> = ({ configuring, config, onChange, onSubmit }) => {
  useOnSubmit(onSubmit);

  if (Nullable.isNone(config.name)) {
    return (
      <Color red>
        Called <Color yellow>beaver new</Color> with no name.
      </Color>
    );
  }

  return (
    <Box flexDirection="column">
      <Color green>App name: {config.name}</Color>
      <Box>
        {questions[configuring].text}:{' '}
        <TextInput
          value={Nullable.withDefault('', config[configuring])}
          placeholder={questions[configuring].placeholder}
          focus={true}
          onChange={onChange}
        />
      </Box>
    </Box>
  );
};

const ConfirmStep: React.FC<
  ConfiguredState & { onConfirm: (value: boolean) => void }
> = ({ config: { name, version, description, dir, license }, onConfirm }) => (
  <Box flexDirection="column">
    <Box>Configuration:</Box>
    <Box>
      name: <Color green>{name}</Color>
    </Box>
    <Box>
      version: <Color green>{version}</Color>
    </Box>
    <Box>
      description: <Color green>{description}</Color>
    </Box>
    <Box>
      dir: <Color green>{dir}</Color>
    </Box>
    <Box>
      license: <Color green>{license}</Color>
    </Box>
    <Box>
      <SelectInput
        items={[
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false
          }
        ]}
        onSelect={({ value }) => onConfirm(value)}
      />
    </Box>
  </Box>
);

const CancelledStep: React.FC<{}> = () => {
  const { exit } = useContext(AppContext);

  useEffect(() => {
    exit();
  }, [exit]);

  return <Box>Cancelled!</Box>;
};

const CreatingStep: React.FC<{ name: string; }> = ({ name }) => (
  <Box flexDirection="row">
    <Color green><Spinner type="arrow3"/></Color>
    <Box marginLeft={1}>Creating app {name}</Box>
  </Box>
);

const View: React.FC<Props> = props => {
  switch (props.step) {
    case 'configure':
      return <ConfigureStep {...props} />;
    case 'confirm':
      return <ConfirmStep {...props} />;
    case 'cancelled':
      return <CancelledStep />;
    case 'creating':
      return <CreatingStep name={props.config.name} />;
    case 'complete':
      return null;
    default:
      return unreachable(props);
  }
};

const events = {
  onChange: (e$: Observable<string, Error>) =>
    e$.map((value: string) => ({ type: 'INPUT', payload: { value } })),
  onSubmit: (e$: Observable<void, Error>) => e$.map(() => ({ type: 'SUBMIT' })),
  onConfirm: (e$: Observable<boolean, Error>) =>
    e$.map((value: boolean) => ({ type: 'CONFIRM', payload: { value } }))
};

export default toJunction<Props, typeof events>(events)(View);
