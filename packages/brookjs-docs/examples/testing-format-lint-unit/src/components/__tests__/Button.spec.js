import React from 'react';
import { fireEvent } from '@testing-library/react';
import { click } from '../../actions';
import Button from '../Button';

describe('Button', () => {
  it('should emit a click event', () => {
    expect(<Button>Click me</Button>).toEmitFromJunction(
      [[0, KTU.value(click())]],
      ({ container }) => {
        fireEvent.click(container.querySelector('button'));
      }
    );
  });
});
