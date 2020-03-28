import React from 'react';
import { fireEvent } from '@testing-library/react';
import { change } from '../../actions';
import Input from '../Input';

describe('Input', () => {
  it('should emit a change event', () => {
    expect(
      <Input label="Test Input" name="test" value="" />
    ).toEmitFromJunction(
      [[0, KTU.value(change('new value'))]],
      ({ container }) => {
        fireEvent.change(container.querySelector('input'), {
          target: { value: 'new value' }
        });
      }
    );
  });
});
