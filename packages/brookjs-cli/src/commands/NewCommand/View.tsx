import React, { useContext, useEffect } from 'react';
import { Color, StdinContext, Box } from 'ink';
import { toJunction } from 'brookjs-silt';
import TextInput from 'ink-text-input';
import { Observable } from 'kefir';
import { State } from './types';
import { defaultSteps } from './constants';

type Props = State & {
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const useOnSubmit = (onSubmit: () => void) => {
  const { stdin } = useContext(StdinContext);

  useEffect(() => {
    const onData = (data: Buffer) => {
      const s = data.toString();

      if (s === '\r') {
        onSubmit();
      }
    };

    stdin.on('data', onData);

    return () => {
      stdin.off('data', onData);
    };
  }, []);
};

const View: React.FC<Props> = ({
  name,
  version,
  description,
  step,
  onChange,
  onSubmit
}) => {
  useOnSubmit(onSubmit);

  if (!name) {
    return (
      <Color red>
        Called{' '}
        <Color bgWhiteBright black>
          beaver new
        </Color>{' '}
        with no name.
      </Color>
    );
  }

  if (step === 'complete') {
    return (
      <div>
        <Color green>App name: {name}</Color>
        version: <Color green>{version}</Color>
        description: <Color green>{description}</Color>
      </div>
    );
  }

  return (
    <Box flexDirection="column">
      <Color green>App name: {name}</Color>
      <Box>
        What is the application version?:{' '}
        {step === 'version' ? (
          <TextInput
            value={version}
            placeholder={'0.0.0'}
            focus={step === 'version'}
            onChange={onChange}
          />
        ) : (
          <Color dim green>
            {version}
          </Color>
        )}
      </Box>
      {step === 'description' ? (
        <Box>
          What is the application description?:{'  '}
          <TextInput
            value={description}
            placeholder={defaultSteps.description}
            focus={step === 'description'}
            onChange={onChange}
          />
        </Box>
      ) : description !== '' ? (
        <Box>
          What is the application description?:{'  '}
          <Color dim green>
            {description}
          </Color>
        </Box>
      ) : null}
    </Box>
  );
};

const events = {
  onChange: (e$: Observable<string, Error>) =>
    e$.map((value: string) => ({ type: 'INPUT', payload: { value } })),
  onSubmit: (e$: Observable<void, Error>) => e$.map(() => ({ type: 'SUBMIT' }))
};

export default toJunction<Props, typeof events>(events)(View);
