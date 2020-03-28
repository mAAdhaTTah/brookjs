import React from 'react';
import { fireEvent } from '@testing-library/react';
import { addTodo } from '../../actions';
import AddTodo from '../AddTodo';

describe('AddTodo', () => {
  it('should emit ADD_TODO event on submit', () => {
    expect(<AddTodo />).toEmitFromJunction(
      [[0, KTU.value(addTodo('do a thing'))]],
      ({ container }) => {
        const input = container.querySelector('input');
        const button = container.querySelector('button');

        fireEvent.change(input, { target: { value: 'do a thing' } });

        expect(input).toHaveValue('do a thing');

        fireEvent.click(button);

        expect(input).toHaveValue('');
      }
    );
  });
});
