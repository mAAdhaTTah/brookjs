import { h } from 'brookjs-silt';
import { storiesOf } from '@storybook/react';
import Button from './Button';

storiesOf('Addon', module)
    .add('emit action', () => (
        <Button />
    ));
